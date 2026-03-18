import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { FilterAudiosDto } from './dto/filter-audios.dto';
import { Audio, AudioDocument } from './schemas/audio.schema';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AudiosService {
  constructor(
    @InjectModel(Audio.name) private audioModel: Model<AudioDocument>,
    private settingsService: SettingsService,
  ) {}

  async create(createAudioDto: CreateAudioDto, userId?: string) {
    if (createAudioDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields('audio', createAudioDto.dynamicFields);
      if (!validation.valid) {
        throw new BadRequestException({ message: 'Dynamic fields validation failed', errors: validation.errors });
      }
    }
    if (!createAudioDto.episodeId && !createAudioDto.seasonId) {
      throw new BadRequestException('Either episodeId or seasonId is required');
    }
    const slug = createAudioDto.slug || slugify(createAudioDto.title, { lower: true });
    const audio = new this.audioModel({
      ...createAudioDto,
      slug,
      ...(createAudioDto.seasonId ? { seasonId: new Types.ObjectId(createAudioDto.seasonId) } : {}),
      ...(createAudioDto.episodeId ? { episodeId: new Types.ObjectId(createAudioDto.episodeId) } : {}),
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
      dynamicFields: createAudioDto.dynamicFields || {},
    });
    return audio.save();
  }

  async findAll(filterDto?: FilterAudiosDto) {
    const page = Number(filterDto?.page || 1);
    const limit = Number(filterDto?.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = filterDto?.sortBy || 'order';
    const sortOrder = filterDto?.sortOrder === 'asc' ? 1 : -1;
    const query: any = {};
    if (filterDto?.title?.trim()) query.title = { $regex: filterDto.title.trim(), $options: 'i' };
    if (filterDto?.minAge !== undefined) query['age.1'] = { $gte: filterDto.minAge };
    if (filterDto?.maxAge !== undefined) query['age.0'] = { $lte: filterDto.maxAge };
    if (filterDto?.series) query.series = filterDto.series;
    if (filterDto?.series_list?.length) query.series = { $in: filterDto.series_list };
    if (filterDto?.values?.length) query.values = { $in: filterDto.values };
    if (filterDto?.isPremium !== undefined) query.isPremium = filterDto.isPremium;
    if (filterDto?.isActive !== undefined) query.isActive = filterDto.isActive;

    const [data, total] = await Promise.all([
      this.audioModel.find(query).populate('episodeId').populate('seasonId').populate('createdBy', '-password -refreshToken -__v').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).exec(),
      this.audioModel.countDocuments(query).exec(),
    ]);
    return { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findByEpisodeId(episodeId: string, filterDto?: FilterAudiosDto) {
    if (!Types.ObjectId.isValid(episodeId)) throw new BadRequestException('Invalid episode ID');
    return this.findAllByQuery({ episodeId: new Types.ObjectId(episodeId) }, filterDto);
  }

  async findBySeasonId(seasonId: string, filterDto?: FilterAudiosDto) {
    if (!Types.ObjectId.isValid(seasonId)) throw new BadRequestException('Invalid season ID');
    return this.findAllByQuery({ seasonId: new Types.ObjectId(seasonId) }, filterDto);
  }

  private async findAllByQuery(baseQuery: any, filterDto?: FilterAudiosDto) {
    const page = Number(filterDto?.page || 1);
    const limit = Number(filterDto?.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = filterDto?.sortBy || 'order';
    const sortOrder = filterDto?.sortOrder === 'asc' ? 1 : -1;
    const query: any = { ...baseQuery };
    if (filterDto?.title?.trim()) query.title = { $regex: filterDto.title.trim(), $options: 'i' };
    const [data, total] = await Promise.all([
      this.audioModel.find(query).populate('episodeId').populate('seasonId').populate('createdBy', '-password -refreshToken -__v').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).exec(),
      this.audioModel.countDocuments(query).exec(),
    ]);
    return { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const audio = await this.audioModel.findById(id).populate('episodeId').populate('seasonId').populate('createdBy', '-password -refreshToken -__v');
    if (!audio) throw new NotFoundException('Audio not found');
    return audio;
  }

  async update(id: string, updateAudioDto: UpdateAudioDto) {
    if (updateAudioDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields('audio', updateAudioDto.dynamicFields);
      if (!validation.valid) {
        throw new BadRequestException({ message: 'Dynamic fields validation failed', errors: validation.errors });
      }
    }
    const updated = await this.audioModel.findByIdAndUpdate(id, {
      ...updateAudioDto,
      ...(updateAudioDto.seasonId ? { seasonId: new Types.ObjectId(updateAudioDto.seasonId) } : {}),
      ...(updateAudioDto.episodeId ? { episodeId: new Types.ObjectId(updateAudioDto.episodeId) } : {}),
      ...(updateAudioDto.title ? { slug: slugify(updateAudioDto.title, { lower: true }) } : {}),
    }, { new: true });
    if (!updated) throw new NotFoundException('Audio not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.audioModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Audio not found');
    return { success: true, message: 'Audio deleted successfully' };
  }
}
