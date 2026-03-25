import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Res,
  Req,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Headers,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ResendOtpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { SetPasswordDto } from './dto/set-password.dto';
import { SetPasswordByTokenDto } from './dto/set-password-by-token.dto';
import { SendInviteDto } from './dto/send-invite.dto';
import { ProfileService } from '../profiles/profile.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('register')
  register(
    @Body() createAuthDto: CreateAuthDto,

    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(createAuthDto, res);
  }

  @Post('login')
  login(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return this.authService.login(createAuthDto, res, req);
  }

  @Post('revoke-premium')
  async revokePremium(@Body('email') email: string) {
    if (!email) {
      throw new HttpException(
        { success: false, message: 'Email is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authService.revokePremiumByEmail(email);
  }

  @Post('user/delete')
  async deletedAccount(@Body('email') email: string) {
    if (!email) {
      throw new HttpException(
        { success: false, message: 'Email is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authService.deletedAccount(email);
  }

  @Post('set-password')
  async setPassword(@Body() setPasswordDto: SetPasswordDto) {
    return this.authService.setPassword(setPasswordDto);
  }


  @Post('send-invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async sendInvite(@Body() dto: SendInviteDto) {
    return this.authService.sendInvite(dto.userId);
  }

  @Get('validate-invite')
  async validateInvite(@Query('token') token: string) {
    return this.authService.validateInviteToken(token);
  }

  @Post('set-password-by-token')
  async setPasswordByToken(@Body() dto: SetPasswordByTokenDto) {
    return this.authService.setPasswordByInviteToken(dto);
  }


  @Post('generate')
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto.email);
  }
  // reset password 
  //  @Post('forget-password')
  // forgetPassword(
  //   @Req() req: any,
  //   @Body() forgetPasswordDto: ForgetPasswordDto
  // ) {
  //   return this.authService.forgetPassword(forgetPasswordDto.email);
  // }

  // @Post('verify-forget-password')
  // verifyForgetPassword(
  //   @Req() req: any,
  //   @Body() verifyForgetPassword: VerifyForgetPassword
  // ) {
  //   return this.authService.verifyForgetPassword(verifyForgetPassword);
  // }

  // @Post('reset-password')
  // resetPassword(
  //   @Req() req: any,
  //   @Body() resetPasswordDto: ResetPasswordDto
  // ) {
  //   return this.authService.resetPassword(resetPasswordDto);
  // }

  @Post('refresh')
  refresh(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Headers('Authorization') Authorization: string,
  ) {
    return this.authService.refresh(req, res, Authorization);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  // 🛡️ Protected route example
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const userInfo = req.user;
    const userId = userInfo.id || userInfo._id || userInfo.sub;
    
    // Try to fetch profiles for the user
    try {
      if (userId) {
        const profilesResponse = await this.profileService.getUserProfiles(userId);
        userInfo.profiles = profilesResponse?.data || [];
      } else {
        userInfo.profiles = [];
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      // If profiles can't be fetched, still return user info with empty profiles
      userInfo.profiles = [];
    }
    
    return userInfo;
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getPremiumSubscribers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pageNum = Math.max(parseInt(String(page)) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 100);
    return this.authService.getPremiumSubscribers(pageNum, limitNum);
  }

  @Get('user-list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserList(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pageNum = Math.max(parseInt(String(page)) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 100);
    return this.authService.getUserList(pageNum, limitNum);
  }
}
