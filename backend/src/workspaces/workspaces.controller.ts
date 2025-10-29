import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteToWorkspaceDto } from './dto';

/**
 * WorkspacesController
 *
 * Controller responsável pelo gerenciamento de workspaces (espaços de trabalho).
 * Permite criar, gerenciar e controlar acesso aos workspaces da plataforma.
 *
 * Um workspace é um ambiente isolado onde equipes podem colaborar,
 * gerenciar projetos e acompanhar o desenvolvimento profissional dos membros.
 *
 * @author Forji Tecnologia
 * @version 1.0.0
 */
@ApiTags('Workspaces')
@Controller('Workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  /**
   * Listar workspaces do usuário
   *
   * Retorna todos os workspaces aos quais o usuário autenticado tem acesso,
   * incluindo informações básicas como nome, descrição e role do usuário.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar workspaces do usuário',
    description:
      'Retorna todos os workspaces aos quais o usuário autenticado possui acesso, com informações sobre sua role em cada workspace.',
    operationId: 'getUserWorkspaces',
  })
  @ApiOkResponse({
    description: 'Lista de workspaces retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único do workspace' },
          name: { type: 'string', description: 'Nome do workspace' },
          description: { type: 'string', nullable: true, description: 'Descrição do workspace' },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
            description: 'Status do workspace',
          },
          createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
          role: {
            type: 'string',
            enum: ['ADMIN', 'MANAGER', 'MEMBER'],
            description: 'Role do usuário no workspace',
          },
          memberCount: { type: 'number', description: 'Número total de membros' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  getUserWorkspaces(@CurrentUser() user: any) {
    return this.workspacesService.getUserWorkspaces(user.id);
  }

  /**
   * Criar novo workspace
   *
   * Cria um novo workspace com o usuário autenticado como administrador.
   * O workspace será criado com status ACTIVE por padrão.
   */
  @Post()
  @ApiOperation({
    summary: 'Criar novo workspace',
    description:
      'Cria um novo workspace com o usuário autenticado como administrador. O workspace pode ser usado para organizar equipes e projetos.',
    operationId: 'createWorkspace',
  })
  @ApiBody({
    type: CreateWorkspaceDto,
    description: 'Dados para criação do workspace',
    examples: {
      'workspace-example': {
        summary: 'Exemplo de workspace',
        value: {
          name: 'Equipe de Desenvolvimento',
          description: 'Workspace para a equipe de desenvolvimento de produtos',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Workspace criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'ID único do workspace' },
        name: { type: 'string', description: 'Nome do workspace' },
        description: { type: 'string', nullable: true, description: 'Descrição do workspace' },
        status: { type: 'string', enum: ['ACTIVE'], description: 'Status do workspace' },
        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' },
        ownerId: { type: 'string', format: 'uuid', description: 'ID do proprietário' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos fornecidos' })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  createWorkspace(@CurrentUser() user: any, @Body() createDto: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(user.id, createDto);
  }

  /**
   * Obter detalhes do workspace
   *
   * Retorna informações detalhadas de um workspace específico,
   * incluindo estatísticas e configurações (se o usuário tiver permissão).
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes do workspace',
    description:
      'Retorna informações detalhadas de um workspace específico, incluindo estatísticas de membros e projetos.',
    operationId: 'getWorkspace',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Detalhes do workspace retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'ID único do workspace' },
        name: { type: 'string', description: 'Nome do workspace' },
        description: { type: 'string', nullable: true, description: 'Descrição do workspace' },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          description: 'Status do workspace',
        },
        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' },
        memberCount: { type: 'number', description: 'Número total de membros' },
        teamCount: { type: 'number', description: 'Número total de equipes' },
        userRole: {
          type: 'string',
          enum: ['ADMIN', 'MANAGER', 'MEMBER'],
          description: 'Role do usuário no workspace',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({ description: 'Usuário não tem acesso a este workspace' })
  @ApiNotFoundResponse({ description: 'Workspace não encontrado' })
  getWorkspace(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.getWorkspace(workspaceId, user.id);
  }

  /**
   * Atualizar workspace
   *
   * Atualiza informações do workspace. Apenas usuários com role
   * ADMIN podem executar esta operação.
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar workspace',
    description:
      'Atualiza informações do workspace como nome, descrição e status. Requer permissões de administrador.',
    operationId: 'updateWorkspace',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateWorkspaceDto,
    description: 'Dados para atualização do workspace',
    examples: {
      'update-name': {
        summary: 'Atualizar nome',
        value: {
          name: 'Novo Nome do Workspace',
        },
      },
      'update-description': {
        summary: 'Atualizar descrição',
        value: {
          description: 'Nova descrição do workspace',
        },
      },
      'update-status': {
        summary: 'Atualizar status',
        value: {
          status: 'INACTIVE',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Workspace atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'ID único do workspace' },
        name: { type: 'string', description: 'Nome atualizado do workspace' },
        description: { type: 'string', nullable: true, description: 'Descrição atualizada' },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], description: 'Status atualizado' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos fornecidos' })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({ description: 'Usuário não tem permissões de administrador' })
  @ApiNotFoundResponse({ description: 'Workspace não encontrado' })
  updateWorkspace(
    @Param('id') workspaceId: string,
    @CurrentUser() user: any,
    @Body() updateDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.updateWorkspace(workspaceId, user.id, updateDto);
  }

  /**
   * Arquivar workspace
   *
   * Arquiva (soft delete) um workspace. Apenas o proprietário do workspace
   * pode executar esta operação. O workspace ficará inacessível mas os dados são preservados.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Arquivar workspace',
    description:
      'Arquiva um workspace (soft delete). Apenas o proprietário pode executar esta operação. Os dados são preservados mas o workspace fica inacessível.',
    operationId: 'deleteWorkspace',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace a ser arquivado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Workspace arquivado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Workspace arquivado com sucesso' },
        workspaceId: { type: 'string', format: 'uuid', description: 'ID do workspace arquivado' },
        archivedAt: { type: 'string', format: 'date-time', description: 'Data do arquivamento' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({ description: 'Apenas o proprietário pode arquivar o workspace' })
  @ApiNotFoundResponse({ description: 'Workspace não encontrado' })
  deleteWorkspace(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.deleteWorkspace(workspaceId, user.id);
  }

  /**
   * Listar membros do workspace
   *
   * Retorna todos os membros do workspace com suas respectivas roles
   * e informações básicas de perfil.
   */
  @Get(':id/members')
  @ApiOperation({
    summary: 'Listar membros do workspace',
    description:
      'Retorna todos os membros do workspace com suas roles, informações de perfil e data de entrada.',
    operationId: 'getWorkspaceMembers',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Lista de membros retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        members: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'ID do usuário' },
              name: { type: 'string', description: 'Nome do usuário' },
              email: { type: 'string', format: 'email', description: 'Email do usuário' },
              position: { type: 'string', nullable: true, description: 'Cargo do usuário' },
              role: {
                type: 'string',
                enum: ['ADMIN', 'MANAGER', 'MEMBER'],
                description: 'Role no workspace',
              },
              joinedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Data de entrada no workspace',
              },
              avatarId: { type: 'string', nullable: true, description: 'ID do avatar do usuário' },
            },
          },
        },
        totalMembers: { type: 'number', description: 'Total de membros' },
        roleDistribution: {
          type: 'object',
          properties: {
            admins: { type: 'number', description: 'Número de administradores' },
            managers: { type: 'number', description: 'Número de gerentes' },
            members: { type: 'number', description: 'Número de membros' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({ description: 'Usuário não tem acesso a este workspace' })
  @ApiNotFoundResponse({ description: 'Workspace não encontrado' })
  getWorkspaceMembers(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.getWorkspaceMembers(workspaceId, user.id);
  }

  /**
   * Convidar usuário para workspace
   *
   * Convida um usuário para participar do workspace com uma role específica.
   * Apenas usuários com role ADMIN ou MANAGER podem convidar outros usuários.
   */
  @Post(':id/members')
  @ApiOperation({
    summary: 'Convidar usuário para workspace',
    description:
      'Convida um usuário para participar do workspace. Apenas administradores e gerentes podem enviar convites.',
    operationId: 'inviteToWorkspace',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: InviteToWorkspaceDto,
    description: 'Dados do convite',
    examples: {
      'invite-by-email': {
        summary: 'Convite por email',
        value: {
          email: 'usuario@empresa.com',
          role: 'MEMBER',
        },
      },
      'invite-manager': {
        summary: 'Convidar como gerente',
        value: {
          email: 'gerente@empresa.com',
          role: 'MANAGER',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Convite enviado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Convite enviado com sucesso' },
        inviteId: { type: 'string', format: 'uuid', description: 'ID do convite' },
        invitedUser: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: 'Email do usuário convidado' },
            role: {
              type: 'string',
              enum: ['ADMIN', 'MANAGER', 'MEMBER'],
              description: 'Role atribuída',
            },
          },
        },
        expiresAt: {
          type: 'string',
          format: 'date-time',
          description: 'Data de expiração do convite',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Email inválido ou usuário já é membro' })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({ description: 'Usuário não tem permissões para convidar membros' })
  @ApiNotFoundResponse({ description: 'Workspace não encontrado' })
  inviteToWorkspace(
    @Param('id') workspaceId: string,
    @CurrentUser() user: any,
    @Body() inviteDto: InviteToWorkspaceDto,
  ) {
    return this.workspacesService.inviteToWorkspace(workspaceId, user.id, inviteDto);
  }

  /**
   * Atualizar role de membro do workspace
   *
   * Atualiza a role de um membro do workspace (OWNER, ADMIN, MEMBER).
   * Apenas usuários com role OWNER ou ADMIN podem executar esta operação.
   */
  @Patch(':id/members/:userId/role')
  @ApiOperation({
    summary: 'Atualizar role de membro',
    description:
      'Atualiza a role (permissão) de um membro do workspace. Apenas OWNER e ADMIN podem executar.',
    operationId: 'updateMemberRole',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    format: 'uuid',
    description: 'ID único do usuário',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['role'],
      properties: {
        role: {
          type: 'string',
          enum: ['OWNER', 'ADMIN', 'MEMBER'],
          description: 'Nova role do membro',
          example: 'ADMIN',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Role atualizada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Role atualizada com sucesso' },
        member: {
          type: 'object',
          properties: {
            userId: { type: 'string', format: 'uuid' },
            workspaceId: { type: 'string', format: 'uuid' },
            role: { type: 'string', enum: ['OWNER', 'ADMIN', 'MEMBER'] },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Role inválida fornecida' })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({ description: 'Usuário não tem permissões para alterar roles' })
  @ApiNotFoundResponse({ description: 'Workspace ou membro não encontrado' })
  updateMemberRole(
    @Param('id') workspaceId: string,
    @Param('userId') memberUserId: string,
    @Body() body: { role: 'OWNER' | 'ADMIN' | 'MEMBER' },
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.updateMemberRole(workspaceId, memberUserId, body.role);
  }

  /**
   * Remover membro do workspace
   *
   * Remove um membro do workspace. Apenas usuários com role ADMIN
   * podem remover outros membros. Administradores não podem ser removidos.
   */
  @Delete(':id/members/:userId')
  @ApiOperation({
    summary: 'Remover membro do workspace',
    description:
      'Remove um membro do workspace. Apenas administradores podem executar esta operação. O proprietário não pode ser removido.',
    operationId: 'removeMember',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    format: 'uuid',
    description: 'ID único do usuário a ser removido',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @ApiOkResponse({
    description: 'Membro removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Membro removido com sucesso' },
        removedUser: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID do usuário removido' },
            name: { type: 'string', description: 'Nome do usuário removido' },
            email: { type: 'string', format: 'email', description: 'Email do usuário removido' },
          },
        },
        removedAt: { type: 'string', format: 'date-time', description: 'Data da remoção' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({
    description: 'Usuário não tem permissões de administrador ou tentativa de remover proprietário',
  })
  @ApiNotFoundResponse({ description: 'Workspace ou usuário não encontrado' })
  removeMember(
    @Param('id') workspaceId: string,
    @Param('userId') memberUserId: string,
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.removeMember(workspaceId, memberUserId);
  }

  /**
   * Sair do workspace
   *
   * Permite que o usuário saia voluntariamente do workspace.
   * O proprietário do workspace não pode sair - deve transferir a propriedade primeiro.
   */
  @Post(':id/leave')
  @ApiOperation({
    summary: 'Sair do workspace',
    description:
      'Permite que o usuário saia voluntariamente do workspace. O proprietário deve transferir a propriedade antes de sair.',
    operationId: 'leaveWorkspace',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único do workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Usuário saiu do workspace com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Você saiu do workspace com sucesso' },
        workspaceName: { type: 'string', description: 'Nome do workspace que o usuário saiu' },
        leftAt: { type: 'string', format: 'date-time', description: 'Data/hora da saída' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente' })
  @ApiForbiddenResponse({ description: 'Proprietário não pode sair do workspace' })
  @ApiNotFoundResponse({ description: 'Workspace não encontrado ou usuário não é membro' })
  leaveWorkspace(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.leaveWorkspace(workspaceId, user.id);
  }
}
