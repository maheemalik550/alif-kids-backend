import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrosswordPuzzle, CrosswordPuzzleDocument } from '../schemas';
import { CreateCrosswordPuzzleDto, UpdateCrosswordPuzzleDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class CrosswordPuzzleService extends BaseActivityService<CrosswordPuzzleDocument> {
  constructor(
    @InjectModel('CrosswordPuzzle') model: Model<CrosswordPuzzleDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(
    dto: CreateCrosswordPuzzleDto,
  ): Promise<CrosswordPuzzleDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateCrosswordPuzzleDto,
  ): Promise<CrosswordPuzzleDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
