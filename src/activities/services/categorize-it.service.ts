import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategorizeIt, CategorizeItDocument } from '../schemas';
import { CreateCategorizeItDto, UpdateCategorizeItDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class CategorizeItService extends BaseActivityService<CategorizeItDocument> {
  constructor(
    @InjectModel('CategorizeIt') model: Model<CategorizeItDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateCategorizeItDto): Promise<CategorizeItDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateCategorizeItDto,
  ): Promise<CategorizeItDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
