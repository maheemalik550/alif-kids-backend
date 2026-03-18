import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { MobileAuthService } from './mobile-auth.service';
import { CreateMobileAuthDto } from './dto/create-mobile-auth.dto';
import { UpdateMobileAuthDto } from './dto/update-mobile-auth.dto';

@Controller('mobile-auth')
export class MobileAuthController {
  constructor(private readonly mobileAuthService: MobileAuthService) {}

  /**
   * 🔍 Check if mobile user exists by inAppUserId
   * Public endpoint - No authentication required
   */
  @Get('check-user')
  @HttpCode(HttpStatus.OK)
  async checkUser(@Query('inAppUserId') inAppUserId: string) {
    return this.mobileAuthService.checkUserExistenceByInAppUserId(inAppUserId);
  }

  /**
   * ➕ Create a new mobile user
   * Public endpoint for mobile app registration
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMobileAuthDto: CreateMobileAuthDto) {
    return this.mobileAuthService.create(createMobileAuthDto);
  }

  /**
   * 🔄 Update mobile user by inAppUserId
   * Can update username, email, appVersion, osType, etc.
   */
  @Put('update/:inAppUserId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('inAppUserId') inAppUserId: string,
    @Body() updateMobileAuthDto: UpdateMobileAuthDto,
  ) {
    return this.mobileAuthService.update(inAppUserId, updateMobileAuthDto);
  }
}
