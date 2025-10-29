# Forji Backend API Documentation

Complete REST API for team management and gamification platform with multi-workspace support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run start:dev
```

## 📚 API Documentation

Interactive API documentation available at: **http://localhost:8000/api/docs**

## 🔑 Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication.

Add the Bearer token to requests:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints Summary

### Authentication (5 endpoints)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/switch-workspace` - Switch workspace context

### Workspaces (6 endpoints)

- `GET /api/workspaces` - List user's workspaces
- `GET /api/workspaces/:id` - Get workspace details
- `POST /api/workspaces` - Create new workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace
- `POST /api/workspaces/:id/invite` - Invite user to workspace

### Users (7 endpoints)

- `GET /api/users` - List users with pagination
- `GET /api/users/search` - Search users by name/email
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user (admin)
- `PATCH /api/users/:id` - Update user profile
- `PATCH /api/users/:id/password` - Update password
- `DELETE /api/users/:id` - Soft delete user

### Teams (10 endpoints)

- `GET /api/teams` - List teams in workspace
- `GET /api/teams/search` - Search teams by name
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create new team
- `PATCH /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Soft delete team
- `GET /api/teams/:id/members` - List team members
- `POST /api/teams/:id/members` - Add member to team
- `PATCH /api/teams/:id/members/:userId` - Update member role
- `DELETE /api/teams/:id/members/:userId` - Remove member

### Management (6 endpoints)

- `GET /api/management/subordinates` - List subordinates
- `GET /api/management/teams` - List managed teams
- `GET /api/management/rules` - List all rules (admin)
- `POST /api/management/rules` - Create management rule
- `DELETE /api/management/rules/:id` - Delete rule
- `GET /api/management/check/:userId` - Check if user is managed

**Total: 37 endpoints**

## 🏗️ Architecture

### Multi-Workspace System

- Users can belong to multiple workspaces
- Each workspace has isolated data
- JWT token contains workspace context
- Workspace roles: OWNER, ADMIN, MEMBER

### Hierarchical Management

- **INDIVIDUAL rules**: Manager → Subordinate (1:1)
- **TEAM rules**: Manager → Team (1:N)
- Circular hierarchy prevention
- Breadth-first search for hierarchy validation

### Team System

- Teams belong to workspaces
- Team members have roles: MANAGER, MEMBER
- Soft delete support
- Member count aggregations

## 🔒 Security Features

- ✅ **JWT Authentication** with workspace context
- ✅ **Helmet** security headers
- ✅ **Rate Limiting** (10 req/10s globally)
- ✅ **CORS** protection
- ✅ **Input Validation** with class-validator
- ✅ **Global Exception Filter** with proper error handling
- ✅ **Logging Interceptor** for request/response tracking

## 🛠️ Tech Stack

- **NestJS 10** - Progressive Node.js framework
- **Prisma 5** - Modern ORM with type safety
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Swagger** - API documentation
- **TypeScript** - Type-safe development

## 📊 Database Schema

### Core Models

- `User` - User accounts
- `Workspace` - Multi-tenant workspaces
- `WorkspaceMember` - User-workspace relationships
- `Team` - Team entities
- `TeamMember` - Team membership
- `ManagementRule` - Hierarchical management rules

## 🧪 Testing Endpoints

### Example: Register User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "position": "Developer"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Example: Create Team (with token)

```bash
curl -X POST http://localhost:8000/api/teams \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Team",
    "description": "React developers"
  }'
```

## 📝 Environment Variables

See `.env.example` for all available configuration options.

Required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time

## 🚦 Rate Limiting

Default rate limits:

- Global: 10 requests per 10 seconds

Can be configured in `app.module.ts` via ThrottlerModule.

## 📈 Monitoring & Logging

All requests are logged with:

- HTTP method and URL
- Status code
- Response time
- User ID (if authenticated)
- IP address
- User agent

Errors are logged with full stack traces in development mode.

## 🔄 API Versioning

Current version: **v1.0**

Global prefix: `/api`

## 📞 Support

For issues or questions, please refer to the project documentation.

---

Built with ❤️ using NestJS
