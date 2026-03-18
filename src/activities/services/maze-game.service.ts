import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MazeGame, MazeGameDocument } from '../schemas';
import { CreateMazeGameDto, UpdateMazeGameDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class MazeGameService extends BaseActivityService<MazeGameDocument> {
  constructor(
    @InjectModel('MazeGame') model: Model<MazeGameDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateMazeGameDto): Promise<MazeGameDocument> {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateMazeGameDto): Promise<MazeGameDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
