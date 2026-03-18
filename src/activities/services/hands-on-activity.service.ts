import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HandsOnActivity, HandsOnActivityDocument } from '../schemas';
import { CreateHandsOnActivityDto, UpdateHandsOnActivityDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class HandsOnActivityService extends BaseActivityService<HandsOnActivityDocument> {
  constructor(
    @InjectModel('HandsOnActivity') model: Model<HandsOnActivityDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(
    dto: CreateHandsOnActivityDto,
  ): Promise<HandsOnActivityDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateHandsOnActivityDto,
  ): Promise<HandsOnActivityDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
