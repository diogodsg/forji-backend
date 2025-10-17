export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    position?: string | null;
    bio?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
  workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }>;
}
