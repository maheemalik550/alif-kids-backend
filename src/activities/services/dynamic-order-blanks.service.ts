import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DynamicOrderBlanks, DynamicOrderBlanksDocument } from '../schemas';
import {
  CreateDynamicOrderBlanksDto,
  UpdateDynamicOrderBlanksDto,
} from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class DynamicOrderBlanksService extends BaseActivityService<DynamicOrderBlanksDocument> {
  constructor(
    @InjectModel('DynamicOrderBlanks') model: Model<DynamicOrderBlanksDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(
    dto: CreateDynamicOrderBlanksDto,
  ): Promise<DynamicOrderBlanksDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateDynamicOrderBlanksDto,
  ): Promise<DynamicOrderBlanksDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
