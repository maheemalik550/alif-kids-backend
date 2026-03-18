import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MultiAnswerShortQA, MultiAnswerShortQADocument } from '../schemas';
import {
  CreateMultiAnswerShortQADto,
  UpdateMultiAnswerShortQADto,
} from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class MultiAnswerShortQAService extends BaseActivityService<MultiAnswerShortQADocument> {
  constructor(
    @InjectModel('MultiAnswerShortQA') model: Model<MultiAnswerShortQADocument>,
  ) {
    super(model);
  }

  async create(
    dto: CreateMultiAnswerShortQADto,
  ): Promise<MultiAnswerShortQADocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateMultiAnswerShortQADto,
  ): Promise<MultiAnswerShortQADocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
