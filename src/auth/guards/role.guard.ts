import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (!user.role || !this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${this.allowedRoles.join(', ')}`,
      );
    }

    return true;
  }
}
