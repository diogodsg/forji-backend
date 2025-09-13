// Deprecated: remote PR fetching moved to feature hooks (see src/features/prs)
export function useRemotePrs(): never {
  throw new Error("useRemotePrs deprecated; use feature PR hooks");
}
