import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FillTheColor, FillTheColorDocument } from '../schemas';
import { CreateFillTheColorDto, UpdateFillTheColorDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class FillTheColorService extends BaseActivityService<FillTheColorDocument> {
  constructor(
    @InjectModel('FillTheColor') model: Model<FillTheColorDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateFillTheColorDto): Promise<FillTheColorDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateFillTheColorDto,
  ): Promise<FillTheColorDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }

  async findByEpisodeId(episodeId: string): Promise<FillTheColorDocument[]> {
    return this.model
      .find({ episodeId })
      .populate('episodeId typeId createdBy')
      .exec();
  }

  async findById(id: string): Promise<FillTheColorDocument> {
    return this.model
      .findById(id)
      .populate('episodeId typeId createdBy')
      .exec();
  }
}
