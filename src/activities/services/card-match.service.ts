import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardMatch, CardMatchDocument } from '../schemas';
import { CreateCardMatchDto, UpdateCardMatchDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class CardMatchService extends BaseActivityService<CardMatchDocument> {
  constructor(
    @InjectModel('CardMatch') model: Model<CardMatchDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateCardMatchDto): Promise<CardMatchDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateCardMatchDto,
  ): Promise<CardMatchDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
