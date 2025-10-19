import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators';
import { UserUtils } from './entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile with workspace context' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: any) {
    // Fetch full user data with workspaces
    const fullUser = await this.authService.getUserById(user.id || user.sub);

    // Add current workspace context from JWT
    return {
      user: {
        ...fullUser,
        // Current workspace from JWT token
        currentWorkspaceId: user.workspaceId,
        currentWorkspaceRole: user.workspaceRole,
      },
    };
  }

  @Post('switch-workspace')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Switch to a different workspace' })
  @ApiResponse({ status: 200, description: 'Successfully switched workspace' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async switchWorkspace(@CurrentUser() user: any, @Body('workspaceId') workspaceId: string) {
    return this.authService.switchWorkspace(user.id, workspaceId);
  }
}
