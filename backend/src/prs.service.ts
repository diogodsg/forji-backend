import { Injectable, NotFoundException } from "@nestjs/common";
import prisma from "./prisma";

@Injectable()
export class PrsService {
  async list(filter?: {
    ownerUserId?: number;
    page?: number;
    pageSize?: number;
  }) {
    const page = filter?.page && filter.page > 0 ? filter.page : 1;
    const pageSize =
      filter?.pageSize && filter.pageSize > 0 ? filter.pageSize : 20;
    const skip = (page - 1) * pageSize;

    let where: any = undefined;
    if (filter?.ownerUserId) {
      // We need PRs linked via ownerUserId OR whose raw login matches the user's githubId
      const user = await prisma.user.findFirst({
        where: { id: filter.ownerUserId as any },
      });
      const gh = (user as any)?.githubId?.trim?.();
      where = gh
        ? {
            OR: [{ ownerUserId: filter.ownerUserId as any }, { user: gh }],
          }
        : { ownerUserId: filter.ownerUserId as any };
    }

    const [items, total] = await Promise.all([
      prisma.pullRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.pullRequest.count({ where }),
    ]);
    return { items, total, page, pageSize };
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
      user: "user", // same but explicit
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
      let v = raw[k];
      // Convert date strings to Date
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
    // Auto-link by githubId if ownerUserId not provided and PR 'user' (login) present
    if (!mapped.ownerUserId && mapped.user) {
      const gh = String(mapped.user).trim();
      if (gh) {
        const owner = (await prisma.user.findFirst({
          where: { githubId: gh } as any,
        })) as any;
        if (owner) mapped.ownerUserId = owner.id as any;
      }
    }
    return prisma.pullRequest.create({ data: mapped });
  }

  async update(id: number, data: any) {
    const exists = await prisma.pullRequest.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("PR not found");
    const mapped = this.mapIncoming(data);
    delete mapped.id; // never allow id change
    if (!mapped.ownerUserId && mapped.user) {
      const gh = String(mapped.user).trim();
      if (gh) {
        const owner = (await prisma.user.findFirst({
          where: { githubId: gh } as any,
        })) as any;
        if (owner) mapped.ownerUserId = owner.id as any;
      }
    }
    return prisma.pullRequest.update({ where: { id }, data: mapped });
  }

  async remove(id: number) {
    await prisma.pullRequest.delete({ where: { id } });
    return { deleted: true };
  }
}
