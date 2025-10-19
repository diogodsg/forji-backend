import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

// Repository
import { UsersRepository } from './repositories/users.repository';

// Services
import { PasswordService } from './services/password.service';
import { PermissionsService } from './services/permissions.service';

// Use Cases
import {
  FindAllUsersUseCase,
  FindOneUserUseCase,
  SearchUsersUseCase,
  CreateUserUseCase,
  OnboardUserUseCase,
  UpdateUserUseCase,
  UpdatePasswordUseCase,
  AdminResetPasswordUseCase,
  DeleteUserUseCase,
} from './use-cases';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    // Main Service (Facade)
    UsersService,

    // Repository
    UsersRepository,

    // Auxiliary Services
    PasswordService,
    PermissionsService,

    // Use Cases
    FindAllUsersUseCase,
    FindOneUserUseCase,
    SearchUsersUseCase,
    CreateUserUseCase,
    OnboardUserUseCase,
    UpdateUserUseCase,
    UpdatePasswordUseCase,
    AdminResetPasswordUseCase,
    DeleteUserUseCase,
  ],
  exports: [
    UsersService,
    UsersRepository, // Export in case other modules need it
    PasswordService, // Export for reuse in auth module
    PermissionsService, // Export for reuse in other modules
  ],
})
export class UsersModule {}
