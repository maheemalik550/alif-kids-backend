import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReflectRespond, ReflectRespondDocument } from '../schemas';
import { CreateReflectRespondDto, UpdateReflectRespondDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class ReflectRespondService extends BaseActivityService<ReflectRespondDocument> {
  constructor(
    @InjectModel('ReflectRespond') model: Model<ReflectRespondDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateReflectRespondDto): Promise<ReflectRespondDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateReflectRespondDto,
  ): Promise<ReflectRespondDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
