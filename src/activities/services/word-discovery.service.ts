import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WordDiscovery, WordDiscoveryDocument } from '../schemas';
import { CreateWordDiscoveryDto, UpdateWordDiscoveryDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class WordDiscoveryService extends BaseActivityService<WordDiscoveryDocument> {
  constructor(
    @InjectModel('WordDiscovery') model: Model<WordDiscoveryDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateWordDiscoveryDto): Promise<WordDiscoveryDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateWordDiscoveryDto,
  ): Promise<WordDiscoveryDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId surahId typeId createdBy');
  }

  async findByEpisodeId(episodeId: string): Promise<WordDiscoveryDocument[]> {
    return this.model
      .find({ episodeId })
      .populate('episodeId surahId typeId createdBy')
      .exec();
  }

  async findById(id: string): Promise<WordDiscoveryDocument> {
    return this.model
      .findById(id)
      .populate('episodeId surahId typeId createdBy')
      .exec();
  }
}

