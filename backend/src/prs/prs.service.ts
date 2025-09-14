import { Injectable, NotFoundException } from "@nestjs/common";
import prisma from "../prisma";

@Injectable()
export class PrsService {
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
      const user = await prisma.user.findFirst({
        where: { id: filter.ownerUserId as any },
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
      prisma.pullRequest.findMany({ where, orderBy, skip, take: pageSize }),
      prisma.pullRequest.count({ where }),
      (async () => {
        if (!filter?.includeMeta) return undefined;
        let metaWhere: any = undefined;
        if (filter?.ownerUserId) {
          const user = await prisma.user.findFirst({
            where: { id: filter.ownerUserId as any },
            select: { githubId: true },
          });
          const gh = (user as any)?.githubId?.trim?.();
          metaWhere = gh
            ? { OR: [{ ownerUserId: filter.ownerUserId as any }, { user: gh }] }
            : { ownerUserId: filter.ownerUserId as any };
        }
        const distinct = await prisma.pullRequest.findMany({
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
      const out: any = {};
      for (const [k, v] of Object.entries(pr))
        out[k] = typeof v === "bigint" ? Number(v) : v;
      if (!out.state)
        out.state = out.mergedAt ? "merged" : out.closedAt ? "closed" : "open";
      return out;
    });
    return { items, total, page, pageSize, meta };
  }
  get(id: number) {
    return prisma.pullRequest.findUnique({ where: { id } });
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
    return prisma.pullRequest.create({ data: mapped });
  }
  async update(id: number, data: any) {
    const exists = await prisma.pullRequest.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("PR not found");
    const mapped = this.mapIncoming(data);
    delete mapped.id;
    await this.assignOwnerUserId(mapped);
    return prisma.pullRequest.update({ where: { id }, data: mapped });
  }
  async remove(id: number) {
    await prisma.pullRequest.delete({ where: { id } });
    return { deleted: true };
  }
  private async assignOwnerUserId(mapped: any) {
    if (mapped.ownerUserId || !mapped.user) return;
    const gh = String(mapped.user).trim();
    if (!gh) return;
    const owner = (await prisma.user.findFirst({
      where: { githubId: gh },
    })) as any;
    if (owner) mapped.ownerUserId = owner.id as any;
  }
}
