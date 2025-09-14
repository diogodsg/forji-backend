import { ConflictException } from "@nestjs/common";

// Maps Prisma P2002 unique constraint violations to friendly messages.
// targetMap: key (fragment contained in meta.target) -> message
export function handlePrismaUniqueError(
  e: any,
  targetMap: Record<string, string>
) {
  if (e?.code !== "P2002") return null;
  const target = Array.isArray(e?.meta?.target)
    ? e.meta.target.join(",")
    : String(e?.meta?.target || "");
  for (const [fragment, message] of Object.entries(targetMap)) {
    if (target.includes(fragment)) {
      return new ConflictException(message);
    }
  }
  return new ConflictException("Violação de unicidade");
}
