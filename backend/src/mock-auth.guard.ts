import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Mock: always allow, but attach a fake user
    const request = context.switchToHttp().getRequest();
    request.user = { id: 1, name: "Dev User", role: "user" };
    return true;
  }
}
