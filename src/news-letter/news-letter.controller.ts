import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { NewsLetterService } from './news-letter.service';
import { CreateNewsLetterDto } from './dto/create-news-letter.dto';
import { ApiResponse } from './types/api-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('newsletter')
export class NewsLetterController {
  constructor(private readonly newsletterService: NewsLetterService) {}

  // Subscribe
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async subscribe(@Body() dto: CreateNewsLetterDto): Promise<ApiResponse> {
    const created = await this.newsletterService.create(dto);
    return {
      success: true,
      message: 'Subscribed successfully',
      data: {
        id: created._id,
        email: created.email,
      },
    };
  }

  // // Get all subscribers
  // @Get()
  // async findAll(): Promise<ApiResponse> {
  //   const items = await this.newsletterService.findAll();
  //   return {
  //     success: true,
  //     message: 'Subscribers fetched',
  //     data: items.map((i) => ({
  //       id: i._id,
  //       email: i.email,
  //     })),
  //   };
  // }

  // // Delete subscriber
  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // async delete(@Param('id') id: string): Promise<ApiResponse> {
  //   const deleted = await this.newsletterService.delete(id);
  //   if (!deleted) {
  //     return { success: false, message: 'Subscriber not found', data: null };
  //   }
  //   return {
  //     success: true,
  //     message: 'Subscriber removed',
  //     data: { id: deleted._id },
  //   };
  // }
}
