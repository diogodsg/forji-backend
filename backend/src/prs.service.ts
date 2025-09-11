import { Injectable, NotFoundException } from "@nestjs/common";
import prisma from "./prisma";

@Injectable()
export class PrsService {
  list() {
    return prisma.pullRequest.findMany({ orderBy: { createdAt: "desc" } });
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
    return prisma.pullRequest.create({ data: mapped });
  }

  async update(id: number, data: any) {
    const exists = await prisma.pullRequest.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("PR not found");
    const mapped = this.mapIncoming(data);
    delete mapped.id; // never allow id change
    return prisma.pullRequest.update({ where: { id }, data: mapped });
  }

  async remove(id: number) {
    await prisma.pullRequest.delete({ where: { id } });
    return { deleted: true };
  }
}
