// Deprecated legacy location. Use: import { useMyReports } from '../features/admin'
export function useMyReports(): never {
  throw new Error(
    "useMyReports legacy path removed. Import from 'features/admin'."
  );
}

export interface ReportUser {
  id: number;
  name: string;
  email: string;
}
