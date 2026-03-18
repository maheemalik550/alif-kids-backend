import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FillTheKabah, FillTheKabahDocument } from '../schemas';
import { CreateFillTheKabahDto, UpdateFillTheKabahDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class FillTheKabahService extends BaseActivityService<FillTheKabahDocument> {
  constructor(
    @InjectModel('FillTheKabah') model: Model<FillTheKabahDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateFillTheKabahDto): Promise<FillTheKabahDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateFillTheKabahDto,
  ): Promise<FillTheKabahDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
