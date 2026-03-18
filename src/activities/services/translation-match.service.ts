import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TranslationMatch, TranslationMatchDocument } from '../schemas';
import { CreateTranslationMatchDto, UpdateTranslationMatchDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class TranslationMatchService extends BaseActivityService<TranslationMatchDocument> {
  constructor(
    @InjectModel('TranslationMatch') model: Model<TranslationMatchDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(
    dto: CreateTranslationMatchDto,
  ): Promise<TranslationMatchDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateTranslationMatchDto,
  ): Promise<TranslationMatchDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
