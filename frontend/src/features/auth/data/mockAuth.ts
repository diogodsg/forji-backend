import type { AuthUser } from "../types/auth";

/**
 * Mock users para autenticação
 * Senha padrão para todos: "senha123"
 * IDs agora são UUIDs (string) para compatibilidade com backend
 */
export const mockAuthUsers: AuthUser[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Diego Santos",
    email: "diego@forge.com",
    isAdmin: true,
    isManager: true,
    position: "Tech Lead",
    bio: "Líder técnico com experiência em desenvolvimento full-stack",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Maria da Silva Sauro",
    email: "maria@forge.com",
    isAdmin: false,
    isManager: true,
    position: "Product Manager",
    bio: "Gerente de produto focada em UX e estratégia",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Ana Silva",
    email: "ana@forge.com",
    isAdmin: false,
    isManager: false,
    position: "Developer",
    bio: "Desenvolvedora especialista em React e TypeScript",
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Carlos Oliveira",
    email: "carlos@forge.com",
    isAdmin: false,
    isManager: false,
    position: "Frontend Developer",
    bio: "Desenvolvedor frontend com foco em performance e acessibilidade",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Pedro Costa",
    email: "pedro@forge.com",
    isAdmin: false,
    isManager: false,
    position: "UX Designer",
    bio: "Designer UX/UI especialista em design systems",
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
  },
];

/**
 * Simula login com mock data
 * Qualquer senha é aceita para simplificar testes
 */
export function mockLogin(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string }> {
  return new Promise((resolve, reject) => {
    // Simular delay de rede
    setTimeout(() => {
      const user = mockAuthUsers.find((u) => u.email === email);

      if (!user) {
        reject(new Error("Email não encontrado"));
        return;
      }

      // No mock, qualquer senha é aceita
      // Na produção, validaria a senha aqui
      if (!password) {
        reject(new Error("Senha é obrigatória"));
        return;
      }

      // Gerar token mock (não é JWT real, apenas identificador)
      const token = `mock_token_${user.id}_${Date.now()}`;

      console.log("✅ Login mock bem-sucedido:", user.name);
      resolve({ user, token });
    }, 500);
  });
}

/**
 * Simula registro com mock data
 * Cria novo usuário temporário (não persiste após reload)
 */
export function mockRegister(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; token: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Verificar se email já existe
      const exists = mockAuthUsers.find((u) => u.email === data.email);
      if (exists) {
        reject(new Error("Email já cadastrado"));
        return;
      }

      // Criar novo usuário com UUID simulado
      const newUserId = `550e8400-e29b-41d4-a716-${Date.now()
        .toString()
        .slice(-12)
        .padStart(12, "0")}`;
      const newUser: AuthUser = {
        id: newUserId,
        name: data.name,
        email: data.email,
        isAdmin: false,
        isManager: false,
        position: "Novo Colaborador",
        bio: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Adicionar à lista (só existe na sessão atual)
      mockAuthUsers.push(newUser);

      const token = `mock_token_${newUser.id}_${Date.now()}`;

      console.log("✅ Registro mock bem-sucedido:", newUser.name);
      resolve({ user: newUser, token });
    }, 600);
  });
}

/**
 * Recupera usuário pelo token mock
 */
export function mockGetUserByToken(token: string): AuthUser | null {
  if (!token || !token.startsWith("mock_token_")) {
    return null;
  }

  // Extrair UUID do token (formato: mock_token_UUID_timestamp)
  // Remove o prefixo "mock_token_"
  const withoutPrefix = token.substring("mock_token_".length);

  // Divide pela última ocorrência de "_" para separar UUID do timestamp
  const lastUnderscoreIndex = withoutPrefix.lastIndexOf("_");
  if (lastUnderscoreIndex === -1) {
    return null;
  }

  const userId = withoutPrefix.substring(0, lastUnderscoreIndex);

  return mockAuthUsers.find((u) => u.id === userId) || null;
}

/**
 * Helper para pegar usuário por email (útil para testes)
 */
export function getMockUserByEmail(email: string): AuthUser | undefined {
  return mockAuthUsers.find((u) => u.email === email);
}

/**
 * Helper para listar todos os usuários mock
 */
export function getAllMockAuthUsers(): AuthUser[] {
  return mockAuthUsers;
}
