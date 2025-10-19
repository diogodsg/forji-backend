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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { CreateUserOnboardingDto } from './dto/create-user-onboarding.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users - List all users with pagination
   */
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @CurrentUser() user?: any,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.usersService.findAll(pageNum, limitNum, search, user?.workspaceId);
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
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: any) {
    return this.usersService.create(createUserDto, user.id);
  }

  /**
   * POST /users/onboarding - Create new user with full onboarding setup
   * Allows setting manager, team, and workspace role in a single request
   */
  @Post('onboarding')
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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id - Update user profile
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: any) {
    return this.usersService.update(id, updateUserDto, user.id);
  }

  /**
   * PATCH /users/:id/password - Update user password
   */
  @Patch(':id/password')
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
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.remove(id, user.id);
  }
}
