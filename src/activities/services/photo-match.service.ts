import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhotoMatch, PhotoMatchDocument } from '../schemas';
import { CreatePhotoMatchDto, UpdatePhotoMatchDto } from '../dto';
import { BaseActivityService } from './base-activity.service';

@Injectable()
export class PhotoMatchService extends BaseActivityService<PhotoMatchDocument> {
  constructor(
    @InjectModel('PhotoMatch') model: Model<PhotoMatchDocument>,
    @InjectModel('UserActivityProgress') userActivityProgressModel: Model<any>,
  ) {
    super(model, userActivityProgressModel);
  }

  async create(dto: CreatePhotoMatchDto): Promise<PhotoMatchDocument> {
    return this.model.create(dto);
  }

  async update(
    id: string,
    dto: UpdatePhotoMatchDto,
  ): Promise<PhotoMatchDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }
}
