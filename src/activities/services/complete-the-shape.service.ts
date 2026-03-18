import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompleteTheShape, CompleteTheShapeDocument } from '../schemas';
import { CreateCompleteTheShapeDto, UpdateCompleteTheShapeDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class CompleteTheShapeService extends BaseActivityService<CompleteTheShapeDocument> {
  constructor(
    @InjectModel('CompleteTheShape') model: Model<CompleteTheShapeDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(
    dto: CreateCompleteTheShapeDto,
  ): Promise<CompleteTheShapeDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateCompleteTheShapeDto,
  ): Promise<CompleteTheShapeDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }

  async findByEpisodeId(episodeId: string): Promise<CompleteTheShapeDocument[]> {
    return this.model
      .find({ episodeId })
      .populate('episodeId typeId createdBy')
      .exec();
  }

  async findById(id: string): Promise<CompleteTheShapeDocument> {
    return this.model
      .findById(id)
      .populate('episodeId typeId createdBy')
      .exec();
  }
}
