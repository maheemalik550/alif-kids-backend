import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListMatch, ListMatchDocument } from '../schemas';
import { CreateListMatchDto, UpdateListMatchDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class ListMatchService extends BaseActivityService<ListMatchDocument> {
  constructor(
    @InjectModel('ListMatch') model: Model<ListMatchDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreateListMatchDto): Promise<ListMatchDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdateListMatchDto,
  ): Promise<ListMatchDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
