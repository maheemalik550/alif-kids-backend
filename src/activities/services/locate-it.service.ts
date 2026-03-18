import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocateIt, LocateItDocument } from '../schemas';
import { CreateLocateItDto, UpdateLocateItDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class LocateItService extends BaseActivityService<LocateItDocument> {
  constructor(
    @InjectModel('LocateIt') model: Model<LocateItDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateLocateItDto): Promise<LocateItDocument> {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateLocateItDto): Promise<LocateItDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }

  async findByEpisodeId(episodeId: string): Promise<LocateItDocument[]> {
    return this.model
      .find({ episodeId })
      .populate('episodeId typeId createdBy')
      .exec();
  }

  async findById(id: string): Promise<LocateItDocument> {
    return this.model
      .findById(id)
      .populate('episodeId typeId createdBy')
      .exec();
  }
}
