import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateMobileDeviceIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const deviceId = request.body?.deviceId || request.query?.deviceId;

    // ✅ Validate deviceId exists
    if (!deviceId) {
      throw new BadRequestException({
        success: false,
        message: 'Device ID is required in request body or query',
        code: 'DEVICE_ID_REQUIRED',
      });
    }

    // ✅ Validate deviceId format (not empty or invalid)
    if (typeof deviceId !== 'string' || deviceId.trim().length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Device ID must be a non-empty string',
        code: 'INVALID_DEVICE_ID_FORMAT',
      });
    }

    // ✅ Validate deviceId length
    if (deviceId.length < 5 || deviceId.length > 255) {
      throw new BadRequestException({
        success: false,
        message: 'Device ID must be between 5 and 255 characters',
        code: 'DEVICE_ID_LENGTH_INVALID',
      });
    }

    // ✅ Validate deviceId doesn't contain invalid characters
    const validDeviceIdPattern = /^[a-zA-Z0-9_\-:.]+$/;
    if (!validDeviceIdPattern.test(deviceId.trim())) {
      throw new BadRequestException({
        success: false,
        message:
          'Device ID can only contain alphanumeric characters, hyphens, underscores, dots, and colons',
        code: 'INVALID_DEVICE_ID_CHARACTERS',
      });
    }

    // ✅ Validate osType if provided
    const osType = request.body?.osType || request.query?.osType;
    if (osType) {
      const validOSTypes = ['iOS', 'Android', 'Web'];
      if (!validOSTypes.includes(osType)) {
        throw new BadRequestException({
          success: false,
          message: `Invalid OS Type. Allowed: ${validOSTypes.join(', ')}`,
          code: 'INVALID_OS_TYPE',
        });
      }
    }

    // ✅ Validate appVersion format if provided
    const appVersion = request.body?.appVersion || request.query?.appVersion;
    if (appVersion && typeof appVersion !== 'string') {
      throw new BadRequestException({
        success: false,
        message: 'App version must be a string',
        code: 'INVALID_APP_VERSION_FORMAT',
      });
    }

    // ✅ Attach sanitized data to request
    request.sanitizedDeviceId = deviceId.trim();
    request.sanitizedOsType = osType ? osType.trim() : undefined;
    request.sanitizedAppVersion = appVersion ? appVersion.trim() : undefined;

    return true;
  }
}
