import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QAShortAnswer, QAShortAnswerDocument } from '../schemas';
import { CreateQAShortAnswerDto, UpdateQAShortAnswerDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class QAShortAnswerService extends BaseActivityService<QAShortAnswerDocument> {
  constructor(
    @InjectModel('QAShortAnswer') model: Model<QAShortAnswerDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateQAShortAnswerDto): Promise<QAShortAnswerDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateQAShortAnswerDto,
  ): Promise<QAShortAnswerDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
