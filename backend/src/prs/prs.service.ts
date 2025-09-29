import { Injectable, NotFoundException } from "@nestjs/common";
import { logger } from "../common/logger/pino";
import { PrismaService } from "../core/prisma/prisma.service";
import { SoftDeleteService } from "../common/prisma/soft-delete.extension";

@Injectable()
export class PrsService extends SoftDeleteService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
  async list(filter?: {
    ownerUserId?: number;
    repo?: string;
    state?: string;
    author?: string;
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    includeMeta?: boolean;
  }) {
    const page = filter?.page && filter.page > 0 ? filter.page : 1;
    const pageSize =
      filter?.pageSize && filter.pageSize > 0 ? filter.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const orClauses: any[] = [];
    const andClauses: any[] = [];
    if (filter?.ownerUserId) {
      const user = await this.prisma.user.findFirst({
        where: this.addSoftDeleteFilter({ id: filter.ownerUserId as any }),
        select: { githubId: true },
      });
      const gh = (user as any)?.githubId?.trim?.();
      if (gh) {
        orClauses.push(
          { ownerUserId: filter.ownerUserId as any },
          { user: gh }
        );
      } else {
        andClauses.push({ ownerUserId: filter.ownerUserId as any });
      }
    }
    if (filter?.repo) andClauses.push({ repo: filter.repo });
    if (filter?.state) andClauses.push({ state: filter.state });
    if (filter?.author) andClauses.push({ OR: [{ user: filter.author }] });
    if (filter?.q) {
      const q = filter.q;
      andClauses.push({
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { user: { contains: q, mode: "insensitive" } },
        ],
      });
    }
    let where: any = undefined;
    if (orClauses.length && andClauses.length)
      where = { AND: [{ OR: orClauses }, ...andClauses] };
    else if (orClauses.length) where = { OR: orClauses };
    else if (andClauses.length === 1) where = andClauses[0];
    else if (andClauses.length > 1) where = { AND: andClauses };
    const allowedSortFields = new Set([
      "createdAt",
      "updatedAt",
      "mergedAt",
      "totalAdditions",
      "totalDeletions",
      "totalChanges",
    ]);
    let orderBy: any = { createdAt: "desc" };
    if (filter?.sort) {
      const parts = filter.sort.split(",");
      const first = parts[0];
      const [fieldRaw, dirRaw] = first.split(":");
      const field = fieldRaw?.trim();
      const dir = dirRaw?.toLowerCase() === "asc" ? "asc" : "desc";
      if (field && allowedSortFields.has(field)) orderBy = { [field]: dir };
    }
    const [rawItems, total, meta] = await Promise.all([
      this.prisma.pullRequest.findMany({
        where: this.addSoftDeleteFilter(where),
        orderBy,
        skip,
        take: pageSize,
      }),
      this.prisma.pullRequest.count({ where: this.addSoftDeleteFilter(where) }),
      (async () => {
        if (!filter?.includeMeta) return undefined;
        let metaWhere: any = undefined;
        if (filter?.ownerUserId) {
          const user = await this.prisma.user.findFirst({
            where: this.addSoftDeleteFilter({ id: filter.ownerUserId as any }),
            select: { githubId: true },
          });
          const gh = (user as any)?.githubId?.trim?.();
          metaWhere = gh
            ? { OR: [{ ownerUserId: filter.ownerUserId as any }, { user: gh }] }
            : { ownerUserId: filter.ownerUserId as any };
        }
        const distinct = await this.prisma.pullRequest.findMany({
          where: metaWhere,
          select: { repo: true, user: true },
        });
        const repos = Array.from(
          new Set(distinct.map((d) => d.repo).filter(Boolean))
        ) as string[];
        const authors = Array.from(
          new Set(distinct.map((d) => d.user).filter(Boolean))
        ) as string[];
        return { repos, authors };
      })(),
    ]);
    const items = rawItems.map((pr: any) => {
      // Apenas adiciona campo state derivado se ausente; deixa BigInt para interceptor serializar
      if (!(pr as any).state) {
        (pr as any).state = pr.mergedAt
          ? "merged"
          : pr.closedAt
          ? "closed"
          : "open";
      }
      return pr;
    });
    logger.debug(
      {
        msg: "prs.list",
        total,
        page,
        pageSize,
        ownerUserId: filter?.ownerUserId,
        repo: filter?.repo,
        state: filter?.state,
        author: filter?.author,
        q: !!filter?.q,
        sort: filter?.sort,
        meta: !!filter?.includeMeta,
      },
      "prs.list page=%d size=%d total=%d",
      page,
      pageSize,
      total
    );
    return { items, total, page, pageSize, meta };
  }
  get(id: number) {
    return this.prisma.pullRequest.findFirst({ 
      where: this.addSoftDeleteFilter({ id })
    });
  }
  private mapIncoming(raw: any) {
    if (!raw || typeof raw !== "object") return {};
    const map: Record<string, string> = {
      created_at: "createdAt",
      updated_at: "updatedAt",
      closed_at: "closedAt",
      merged_at: "mergedAt",
      last_reviewed_at: "lastReviewedAt",
      review_text: "reviewText",
      total_additions: "totalAdditions",
      total_deletions: "totalDeletions",
      total_changes: "totalChanges",
      node_id: "nodeId",
      user: "user",
      number: "number",
      repo: "repo",
      state: "state",
      title: "title",
      body: "body",
      id: "id",
    };
    const out: any = {};
    Object.keys(raw).forEach((k) => {
      const target = map[k] || k;
      let v = (raw as any)[k];
      if (v && typeof v === "string" && /_at$/.test(k)) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) v = d;
      }
      out[target] = v;
    });
    return out;
  }
  async create(data: any) {
    if (!data?.id) throw new Error("id is required");
    const mapped = this.mapIncoming(data);
    await this.assignOwnerUserId(mapped);
    const created = await this.prisma.pullRequest.create({ data: mapped });
    logger.info(
      {
        msg: "prs.create",
        id: created.id,
        repo: created.repo,
        user: created.user,
      },
      "prs.create id=%s repo=%s",
      created.id,
      created.repo
    );
    return created;
  }
  async update(id: number, data: any) {
    const exists = await this.prisma.pullRequest.findFirst({ 
      where: this.addSoftDeleteFilter({ id })
    });
    if (!exists) throw new NotFoundException("PR not found");
    const mapped = this.mapIncoming(data);
    delete mapped.id;
    await this.assignOwnerUserId(mapped);
    const updated = await this.prisma.pullRequest.update({
      where: { id },
      data: mapped,
    });
    logger.info({ msg: "prs.update", id }, "prs.update id=%s", id);
    return updated;
  }
  async remove(id: number) {
    await this.softDelete('pullRequest', id);
    logger.info({ msg: "prs.softDelete", id }, "prs.softDelete id=%s", id);
    return { deleted: true };
  }

  // Método para hard delete (apenas para admin ou casos especiais)
  async hardRemove(id: number) {
    await this.hardDelete('pullRequest', id);
    logger.info({ msg: "prs.hardDelete", id }, "prs.hardDelete id=%s", id);
    return { deleted: true };
  }

  // Método para restaurar PR soft deleted
  async restorePr(id: number) {
    await this.restore('pullRequest', id);
    logger.info({ msg: "prs.restore", id }, "prs.restore id=%s", id);
    return { restored: true };
  }
  private async assignOwnerUserId(mapped: any) {
    if (mapped.ownerUserId || !mapped.user) return;
    const gh = String(mapped.user).trim();
    if (!gh) return;
    const owner = (await this.prisma.user.findFirst({
      where: this.addSoftDeleteFilter({ githubId: gh }),
    })) as any;
    if (owner) mapped.ownerUserId = owner.id as any;
  }
}
