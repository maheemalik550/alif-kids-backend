import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FreeDrawing, FreeDrawingDocument } from '../schemas';
import { CreateFreeDrawingDto, UpdateFreeDrawingDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class FreeDrawingService extends BaseActivityService<FreeDrawingDocument> {
  constructor(
    @InjectModel('FreeDrawing') model: Model<FreeDrawingDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateFreeDrawingDto): Promise<FreeDrawingDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateFreeDrawingDto,
  ): Promise<FreeDrawingDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId surahId typeId createdBy');
  }

  async findByEpisodeId(episodeId: string): Promise<FreeDrawingDocument[]> {
    return this.model
      .find({ episodeId })
      .populate('episodeId surahId typeId createdBy')
      .exec();
  }

  async findById(id: string): Promise<FreeDrawingDocument> {
    return this.model
      .findById(id)
      .populate('episodeId surahId typeId createdBy')
      .exec();
  }
}
