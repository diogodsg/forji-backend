# Admin Feature

Simplificado sistema administrativo focado em **onboarding guiado** como processo central para gestão de pessoas e estrutura organizacional.

## Overview

O sistema admin foi redesenhado para priorizar o **fluxo de onboarding** ao invés de tabelas tradicionais:

- **Pessoas**: Interface principal com onboarding guiado para criação e organização
- **Organização**: Gestão de equipes e hierarquias (placeholder)
- **Insights**: Relatórios e análises (placeholder)

## Architecture

### Filosofia Workflow-Oriented

- **Onboarding Guiado**: Modal unificado para criação + organização de pessoas
- **Interface Simplificada**: Remove complexidade desnecessária das seções anteriores
- **Foco em Ações**: Prioriza "Adicionar Pessoa" sobre listagem de dados
- **Design System v2.0**: Brand colors, surface tokens, navegação consistente

### Componentes Principais

#### `WorkflowPeopleTab.tsx`

Interface principal simplificada:

- Header com contador de pessoas e botão "Adicionar Pessoa"
- Tabela detalhada expansível (quando necessário)
- Integração direta com OnboardingModal

#### `OnboardingModal.tsx`

Modal unificado de 3 etapas:

- **Criação**: Para novas pessoas (nome, email, cargo, admin)
- **Organização**: Para pessoas existentes (seleção múltipla)
- **Estrutura**: Definição de gerente e equipe
- **Revisão**: Confirmação antes de aplicar

#### Fluxo Principal

1. Usuário clica "Adicionar Pessoa"
2. OnboardingModal abre em modo "criação" (users = [])
3. 3 etapas guiadas: dados → estrutura → confirmação
4. Pessoa criada e organizada em um único fluxo

## Hook: useAdminUsers

**Responsibilities:**

- Load and manage users list
- Handle user creation, deletion, and updates
- Manage admin role toggles and manager relationships
- Provide granular loading states for UI feedback

**Key Features:**

- Real-time user filtering by name/email and role
- Password management with generated secure passwords
- Manager relationship management
- Optimistic UI updates with error handling

## Hook: useAdminTeams

**Responsibilities:**

- Team creation, editing, and deletion
- Team member management with role assignments
- Team metrics and analytics
- Search and filtering capabilities

## Key Components

### Navigation & Layout

- `AdminAccessPage` - Main route with tab navigation
- `OrganizationTab` - Teams and hierarchy management
- Subtle breadcrumb navigation
- Underline tab pattern for consistent UX

### User Management

- `SimplifiedUsersTable` - Card-based user display
- `CreateUserModal` - User creation with auto-generated passwords
- `UserMetricsCards` - User statistics dashboard
- `EnhancedUsersToolbar` - Search and filtering tools

### Team Management

- `AdminTeamsTable` - Team listing and selection
- `TeamDetailPanel` - Team member management
- `CreateTeamModal` - Team creation interface
- `TeamMetricsCards` - Team analytics

### Organizational Structure

- `AdminSubordinatesManagement` - Hierarchy management
- `ManagerPickerPopover` - Manager assignment interface

## Security & Access Control

### AdminGate Component

```tsx
import { AdminGate } from "@/features/admin";

<AdminGate>
  <SensitiveAdminPanel />
</AdminGate>;
```

**Features:**

- Role-based access control
- Graceful fallback for unauthorized users
- Custom fallback component support

## Recent Improvements

### GitHub Integration Removal

- Removed all GitHub ID fields and functionality
- Simplified user creation and management flows
- Updated metrics to exclude GitHub-related data
- Cleaned up interfaces and API endpoints

### Design System Migration

- Migrated from `indigo`/`blue` to brand colors
- Implemented surface tokens throughout
- Updated border radius to `rounded-xl`
- Applied consistent hover and focus states
- Replaced prominent gradients with subtle tab navigation

### UX Enhancements

- Consolidated 3-tab to 2-tab structure (Users + Organization)
- Implemented underline tab navigation pattern
- Simplified breadcrumb design
- Reduced visual noise with subtle color palette
- Improved information hierarchy

## API Integration

The admin feature integrates with backend endpoints for:

- User CRUD operations
- Team management
- Role assignments
- Manager relationships
- Password management

All API calls include proper error handling and loading states for optimal UX.

## Future Enhancements

- Server-side pagination for large user sets
- Advanced search with multiple criteria
- Bulk operations for user management
- Enhanced analytics and reporting
- Role-based permission matrix beyond binary admin flag
- Integration with audit logging system
- Export capabilities for user and team data
