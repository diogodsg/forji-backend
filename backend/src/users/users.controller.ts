import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { CreateUserOnboardingDto } from './dto/create-user-onboarding.dto';

/**
 * UsersController
 *
 * Controller responsável pelo gerenciamento completo de usuários na plataforma.
 * Inclui operações de CRUD, busca, autenticação e onboarding.
 *
 * Funcionalidades principais:
 * - Listagem e busca de usuários
 * - Criação e onboarding de novos usuários
 * - Atualização de perfis e senhas
 * - Gerenciamento de permissões e roles
 * - Soft delete para manter histórico
 *
 * @author Forji Tecnologia
 * @version 1.0.0
 */
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users - List all users with pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Listar usuários',
    description:
      'Retorna lista paginada de usuários com filtros opcionais. Inclui busca por nome, email, role e workspace.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (inicia em 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página (máximo 100)',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca por nome ou email (case-insensitive)',
    example: 'joão silva',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['USER', 'ADMIN', 'MANAGER'],
    description: 'Filtrar por role específica',
    example: 'USER',
  })
  @ApiQuery({
    name: 'workspaceId',
    required: false,
    type: String,
    description: 'Filtrar por workspace específico',
    example: 'clp4k5n8d0000ld0fh4qm7x8k',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por status de ativação',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clp4k5n8d0001ld0fh4qm7x8k' },
              name: { type: 'string', example: 'João Silva' },
              email: { type: 'string', example: 'joao.silva@empresa.com' },
              avatarId: { type: 'string', example: 'user_clp4k5n8d0001ld0fh4qm7x8k' },
              role: { type: 'string', example: 'USER' },
              isActive: { type: 'boolean', example: true },
              lastLogin: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-20T08:30:00.000Z',
              },
              workspace: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'clp4k5n8d0000ld0fh4qm7x8k' },
                  name: { type: 'string', example: 'Empresa ABC' },
                },
              },
              gamification: {
                type: 'object',
                properties: {
                  xp: { type: 'number', example: 1250 },
                  level: { type: 'number', example: 3 },
                  badges: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['welcome', 'first_goal', 'team_player'],
                  },
                },
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 150 },
            totalPages: { type: 'number', example: 8 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não possui permissão para listar usuários',
  })
  async findAll(@Query() query: any, @CurrentUser() user: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const search = query.search;
    // Use workspaceId from query or from logged user's workspace
    const workspaceId = query.workspaceId || user?.workspaceId;

    return this.usersService.findAll(page, limit, search, workspaceId);
  }

  /**
   * GET /users/search - Search users by query
   */
  @Get('search')
  search(@Query('q') query: string, @CurrentUser() user?: any) {
    return this.usersService.search(query, user?.workspaceId);
  }

  /**
   * POST /users - Create new user (Admin only)
   */
  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description:
      'Cria um novo usuário na plataforma com onboarding completo. Gera automaticamente avatar único, senha temporária e configurações iniciais.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados obrigatórios para criação do usuário',
    examples: {
      standard: {
        summary: 'Usuário padrão',
        value: {
          name: 'João Silva',
          email: 'joao.silva@empresa.com',
          cpf: '12345678901',
          phone: '+5511987654321',
          workspaceId: 'clp4k5n8d0000ld0fh4qm7x8k',
        },
      },
      admin: {
        summary: 'Usuário administrador',
        value: {
          name: 'Maria Santos',
          email: 'maria.santos@empresa.com',
          cpf: '10987654321',
          phone: '+5511123456789',
          workspaceId: 'clp4k5n8d0000ld0fh4qm7x8k',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID único do usuário',
          example: 'clp4k5n8d0001ld0fh4qm7x8k',
        },
        name: {
          type: 'string',
          description: 'Nome completo do usuário',
          example: 'João Silva',
        },
        email: {
          type: 'string',
          description: 'Email do usuário',
          example: 'joao.silva@empresa.com',
        },
        avatarId: {
          type: 'string',
          description: 'ID único para geração do avatar',
          example: 'user_clp4k5n8d0001ld0fh4qm7x8k',
        },
        role: {
          type: 'string',
          enum: ['USER', 'ADMIN', 'MANAGER'],
          description: 'Papel do usuário na plataforma',
          example: 'USER',
        },
        isActive: {
          type: 'boolean',
          description: 'Status de ativação do usuário',
          example: true,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Data de criação',
          example: '2024-01-20T10:30:00.000Z',
        },
        gamification: {
          type: 'object',
          description: 'Dados de gamificação iniciais',
          properties: {
            xp: { type: 'number', example: 0 },
            level: { type: 'number', example: 1 },
            badges: { type: 'array', items: { type: 'string' }, example: ['welcome'] },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já existe',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Email já está em uso' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não possui permissão para criar usuários',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Acesso negado' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    return this.usersService.create(createUserDto, req.user);
  }

  /**
   * POST /users/onboarding - Create new user with full onboarding setup
   * Allows setting manager, team, and workspace role in a single request
   */
  @Post('onboarding')
  @ApiOperation({
    summary: 'Criar usuário com onboarding completo',
    description:
      'Cria novo usuário com configuração completa de onboarding incluindo manager, equipe e papel no workspace em uma única operação.',
  })
  @ApiBody({
    type: 'CreateUserOnboardingDto',
    description: 'Dados completos para criação do usuário com onboarding',
    examples: {
      fullOnboarding: {
        summary: 'Onboarding completo',
        value: {
          name: 'Ana Costa',
          email: 'ana.costa@empresa.com',
          cpf: '11122233344',
          phone: '+5511888777666',
          workspaceId: 'clp4k5n8d0000ld0fh4qm7x8k',
          role: 'USER',
          managerId: 'clp4k5n8d0002ld0fh4qm7x8k',
          teamIds: ['clp4k5n8d0003ld0fh4qm7x8k', 'clp4k5n8d0004ld0fh4qm7x8k'],
          startDate: '2024-01-22',
          department: 'Tecnologia',
          position: 'Desenvolvedora Frontend',
        },
      },
      basicOnboarding: {
        summary: 'Onboarding básico',
        value: {
          name: 'Carlos Lima',
          email: 'carlos.lima@empresa.com',
          cpf: '55566677788',
          phone: '+5511777666555',
          workspaceId: 'clp4k5n8d0000ld0fh4qm7x8k',
          role: 'USER',
          managerId: 'clp4k5n8d0002ld0fh4qm7x8k',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com onboarding completo',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clp4k5n8d0005ld0fh4qm7x8k' },
            name: { type: 'string', example: 'Ana Costa' },
            email: { type: 'string', example: 'ana.costa@empresa.com' },
            role: { type: 'string', example: 'USER' },
            isActive: { type: 'boolean', example: true },
            avatarId: { type: 'string', example: 'user_clp4k5n8d0005ld0fh4qm7x8k' },
          },
        },
        onboarding: {
          type: 'object',
          properties: {
            manager: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clp4k5n8d0002ld0fh4qm7x8k' },
                name: { type: 'string', example: 'Pedro Manager' },
              },
            },
            teams: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'clp4k5n8d0003ld0fh4qm7x8k' },
                  name: { type: 'string', example: 'Equipe Frontend' },
                  role: { type: 'string', example: 'MEMBER' },
                },
              },
            },
            welcomeEmail: { type: 'boolean', example: true },
            temporaryPassword: { type: 'string', example: 'Welcome123!' },
            setupComplete: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de onboarding inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não possui permissão para criar usuários com onboarding',
  })
  createWithOnboarding(
    @Body() createUserOnboardingDto: CreateUserOnboardingDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.createWithOnboarding(createUserOnboardingDto, user.id);
  }

  /**
   * GET /users/:id - Get user by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description:
      'Retorna dados completos de um usuário específico incluindo informações de gamificação e workspace.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário',
    example: 'clp4k5n8d0001ld0fh4qm7x8k',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clp4k5n8d0001ld0fh4qm7x8k' },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@empresa.com' },
        cpf: { type: 'string', example: '12345678901' },
        phone: { type: 'string', example: '+5511987654321' },
        avatarId: { type: 'string', example: 'user_clp4k5n8d0001ld0fh4qm7x8k' },
        role: { type: 'string', enum: ['USER', 'ADMIN', 'MANAGER'], example: 'USER' },
        isActive: { type: 'boolean', example: true },
        lastLogin: { type: 'string', format: 'date-time', example: '2024-01-20T08:30:00.000Z' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-20T08:30:00.000Z' },
        workspace: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clp4k5n8d0000ld0fh4qm7x8k' },
            name: { type: 'string', example: 'Empresa ABC' },
            description: { type: 'string', example: 'Workspace principal da empresa' },
          },
        },
        gamification: {
          type: 'object',
          properties: {
            xp: { type: 'number', example: 1250 },
            level: { type: 'number', example: 3 },
            badges: {
              type: 'array',
              items: { type: 'string' },
              example: ['welcome', 'first_goal', 'team_player', 'mentor'],
            },
            completedGoals: { type: 'number', example: 8 },
            activeStreaks: { type: 'number', example: 3 },
          },
        },
        teams: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clp4k5n8d0002ld0fh4qm7x8k' },
              name: { type: 'string', example: 'Equipe de Desenvolvimento' },
              role: { type: 'string', example: 'MEMBER' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não possui permissão para visualizar este usuário',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id - Update user profile
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar perfil do usuário',
    description:
      'Atualiza informações do perfil do usuário. Permite atualização parcial de dados pessoais e configurações.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário a ser atualizado',
    example: 'clp4k5n8d0001ld0fh4qm7x8k',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados para atualização (apenas campos fornecidos serão atualizados)',
    examples: {
      profile: {
        summary: 'Atualização de perfil básico',
        value: {
          name: 'João Silva Santos',
          phone: '+5511999888777',
        },
      },
      role: {
        summary: 'Mudança de papel/role',
        value: {
          role: 'MANAGER',
        },
      },
      status: {
        summary: 'Ativação/desativação',
        value: {
          isActive: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clp4k5n8d0001ld0fh4qm7x8k' },
        name: { type: 'string', example: 'João Silva Santos' },
        email: { type: 'string', example: 'joao.silva@empresa.com' },
        phone: { type: 'string', example: '+5511999888777' },
        role: { type: 'string', example: 'MANAGER' },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['phone must be a valid phone number'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não possui permissão para atualizar este perfil',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: any) {
    return this.usersService.update(id, updateUserDto, user.id);
  }

  /**
   * PATCH /users/:id/password - Update user password
   */
  @Patch(':id/password')
  @ApiOperation({
    summary: 'Atualizar senha do usuário',
    description:
      'Atualiza a senha do usuário. Requer verificação da senha atual para usuários não-admin.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário',
    example: 'clp4k5n8d0001ld0fh4qm7x8k',
  })
  @ApiBody({
    type: UpdatePasswordDto,
    description: 'Dados para atualização da senha',
    examples: {
      userChange: {
        summary: 'Usuário alterando própria senha',
        value: {
          currentPassword: 'senhaAtual123',
          newPassword: 'novaSenha456!',
          confirmPassword: 'novaSenha456!',
        },
      },
      adminReset: {
        summary: 'Admin resetando senha de usuário',
        value: {
          newPassword: 'senhaTemporaria123!',
          confirmPassword: 'senhaTemporaria123!',
          forceReset: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Senha atualizada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Senha atualizada com sucesso' },
        passwordChanged: { type: 'boolean', example: true },
        lastPasswordChange: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-20T14:45:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou senhas não coincidem',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Senha atual incorreta ou novas senhas não coincidem',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não possui permissão para alterar esta senha',
  })
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto, user.id);
  }

  /**
   * POST /users/:id/reset-password - Admin reset user password
   * Allows admins to reset any user's password without knowing current password
   */
  @Post(':id/reset-password')
  @ApiOperation({
    summary: 'Resetar senha do usuário (Admin)',
    description:
      'Permite que administradores resetem a senha de qualquer usuário sem conhecer a senha atual. Gera senha temporária se não fornecida.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário',
    example: 'clp4k5n8d0001ld0fh4qm7x8k',
  })
  @ApiBody({
    description: 'Nova senha (opcional - se não fornecida, será gerada automaticamente)',
    schema: {
      type: 'object',
      properties: {
        newPassword: {
          type: 'string',
          description: 'Nova senha para o usuário',
          example: 'NovaSenha123!',
          minLength: 8,
        },
      },
    },
    examples: {
      withPassword: {
        summary: 'Com senha específica',
        value: {
          newPassword: 'SenhaEspecifica123!',
        },
      },
      generated: {
        summary: 'Senha gerada automaticamente',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Senha resetada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Senha resetada com sucesso' },
        temporaryPassword: {
          type: 'string',
          example: 'Temp123!@#',
          description: 'Senha temporária gerada (apenas se não foi fornecida)',
        },
        passwordReset: { type: 'boolean', example: true },
        mustChangePassword: { type: 'boolean', example: true },
        resetAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-20T15:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Senha inválida fornecida',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas administradores podem resetar senhas',
  })
  resetPassword(
    @Param('id') id: string,
    @Body() body: { newPassword?: string },
    @CurrentUser() user: any,
  ) {
    return this.usersService.adminResetPassword(id, user.id, body.newPassword);
  }

  /**
   * DELETE /users/:id - Delete user (soft delete)
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover usuário (soft delete)',
    description:
      'Remove usuário da plataforma usando soft delete para manter histórico. O usuário será desativado e seus dados preservados para auditoria.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário a ser removido',
    example: 'clp4k5n8d0001ld0fh4qm7x8k',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuário removido com sucesso' },
        userId: { type: 'string', example: 'clp4k5n8d0001ld0fh4qm7x8k' },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-20T15:30:00.000Z',
        },
        isActive: { type: 'boolean', example: false },
        dataRetained: {
          type: 'boolean',
          example: true,
          description: 'Indica se os dados foram mantidos para auditoria',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado ou já removido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado ou já foi removido' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não possui permissão para remover usuários',
  })
  @ApiResponse({
    status: 409,
    description: 'Não é possível remover usuário com dependências ativas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'Usuário possui metas ativas ou é responsável por equipes',
        },
        error: { type: 'string', example: 'Conflict' },
        dependencies: {
          type: 'object',
          properties: {
            activeGoals: { type: 'number', example: 3 },
            managedTeams: { type: 'number', example: 1 },
            activeCycles: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.remove(id, user.id);
  }
}

/**
 * @fileoverview Users Controller - Gerenciamento completo de usuários
 *
 * Este controller oferece um conjunto completo de endpoints para gerenciamento
 * de usuários na plataforma, incluindo:
 *
 * - CRUD completo de usuários
 * - Sistema de onboarding avançado
 * - Gerenciamento de senhas e autenticação
 * - Busca e filtros avançados
 * - Soft delete para preservação de dados
 * - Integração com sistema de gamificação
 *
 * Todas as operações são protegidas por autenticação JWT e implementam
 * controle de acesso baseado em roles (USER, ADMIN, MANAGER).
 *
 * @see UsersService Para lógica de negócio
 * @see CreateUserDto Para estrutura de dados de criação
 * @see UpdateUserDto Para estrutura de dados de atualização
 *
 * @version 1.0.0
 * @author Forji Tecnologia
 */
