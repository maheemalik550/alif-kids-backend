import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsLetter } from './schemas/news-letter.schema';
import { CreateNewsLetterDto } from './dto/create-news-letter.dto';

@Injectable()
export class NewsLetterService {
  constructor(
    @InjectModel(NewsLetter.name)
    private readonly newsletterModel: Model<NewsLetter>,
  ) {}

  async create(dto: CreateNewsLetterDto): Promise<NewsLetter> {
    const email = dto.email.toLowerCase().trim();

    // Check duplicate first (gives nicer error than catching mongo E11000)
    const exists = await this.newsletterModel.findOne({ email }).lean().exec();
    if (exists) {
      throw new ConflictException('This email is already subscribed.');
    }

    try {
      const doc = new this.newsletterModel({ email });
      return await doc.save();
    } catch (err) {
      // If a race condition leads to duplicate index error, surface a friendly message
      if (err?.code === 11000) {
        throw new ConflictException('This email is already subscribed.');
      }
      throw new InternalServerErrorException('Failed to save subscriber');
    }
  }

  // async findAll(): Promise<NewsLetter[]> {
  //   return this.newsletterModel.find().sort({ createdAt: -1 }).lean().exec();
  // }

  // async delete(id: string): Promise<NewsLetter | null> {
  //   return this.newsletterModel.findByIdAndDelete(id).exec();
  // }
}
