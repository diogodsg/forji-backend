import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * Specifies which roles can access a route
 * Use with RolesGuard
 *
 * Usage:
 * @Get('admin-only')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin')
 * adminOnlyRoute() {
 *   return 'Admin only';
 * }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
