import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MultiChoiceQuestion, MultiChoiceQuestionDocument } from '../schemas';
import {
  CreateMultiChoiceQuestionDto,
  UpdateMultiChoiceQuestionDto,
} from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class MultiChoiceQuestionsService extends BaseActivityService<MultiChoiceQuestionDocument> {
  constructor(
    @InjectModel('MultiChoiceQuestion')
    multiChoiceModel: Model<MultiChoiceQuestionDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(multiChoiceModel, userActivityProgressModel);
  }

  async create(
    dto: CreateMultiChoiceQuestionDto,
  ): Promise<MultiChoiceQuestionDocument> {
    return this.model.create(dto);
  }

  async findAll(): Promise<MultiChoiceQuestionDocument[]> {
    return this.model
      .find({ isActive: true })
      .populate('episodeId typeId createdBy');
  }

  async findByEpisodeId(
    episodeId: string,
  ): Promise<MultiChoiceQuestionDocument[]> {
    return this.model
      .find({ episodeId, isActive: true })
      .sort({ order: 1 })
      .populate('typeId createdBy');
  }

  async findById(id: string): Promise<MultiChoiceQuestionDocument> {
    return this.model.findById(id).populate('episodeId typeId createdBy');
  }

  async update(
    id: string,
    dto: UpdateMultiChoiceQuestionDto,
  ): Promise<MultiChoiceQuestionDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
    // Cascade delete user activity progress for this activity
    await this.userActivityProgressModel.deleteMany({ activityId: id });
  }
}
