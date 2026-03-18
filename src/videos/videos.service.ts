import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FilterVideosDto } from './dto/filter-videos.dto';
import { Video, VideoDocument } from './schemas/video.schema';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    private settingsService: SettingsService,
  ) {}

  async create(createVideoDto: CreateVideoDto, userId?: string) {
    // Validate dynamic fields if provided
    if (createVideoDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'video',
        createVideoDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    if (!createVideoDto.episodeId && !createVideoDto.seasonId) {
      throw new BadRequestException('Either episodeId or seasonId is required');
    }

    const slug = createVideoDto.slug || slugify(createVideoDto.title, { lower: true });
    const videoData = {
      ...createVideoDto,
      slug,
      ...(createVideoDto.seasonId ? { seasonId: new Types.ObjectId(createVideoDto.seasonId) } : {}),
      ...(createVideoDto.episodeId ? { episodeId: new Types.ObjectId(createVideoDto.episodeId) } : {}),
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
      dynamicFields: createVideoDto.dynamicFields || {},
    };
    const createdVideo = new this.videoModel(videoData);
    return createdVideo.save();
  }

  async findAll(filterVideosDto?: FilterVideosDto) {
    const query: any = {};
    const page = filterVideosDto?.page || 1;
    const limit = filterVideosDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterVideosDto?.sortBy || 'order';
    const sortOrder = filterVideosDto?.sortOrder === 'asc' ? 1 : -1;

    if (filterVideosDto) {
      // Search by title
      if (filterVideosDto.title && filterVideosDto.title.trim()) {
        query.title = { $regex: filterVideosDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want videos where the age range overlaps with the filter
      if (filterVideosDto.minAge !== undefined) {
        // Video's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterVideosDto.minAge };
      }
      if (filterVideosDto.maxAge !== undefined) {
        // Video's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterVideosDto.maxAge };
      }

      // Filter by series
      if (filterVideosDto.series) {
        query.series = filterVideosDto.series;
      }

      // Filter by series list (any matching)
      if (filterVideosDto.series_list && filterVideosDto.series_list.length > 0) {
        query.series = { $in: filterVideosDto.series_list };
      }

      // Filter by format
      if (filterVideosDto.format) {
        query.format = filterVideosDto.format;
      }

      // Filter by values (any matching values)
      if (filterVideosDto.values && filterVideosDto.values.length > 0) {
        query.values = { $in: filterVideosDto.values };
      }

      // Filter by isPremium
      if (filterVideosDto.isPremium !== undefined) {
        query.isPremium = filterVideosDto.isPremium;
      }

      // Filter by isActive
      if (filterVideosDto.isActive !== undefined) {
        query.isActive = filterVideosDto.isActive;
      }
    }

    const [data, total] = await Promise.all([
      this.videoModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.videoModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findByEpisodeId(episodeId: string, filterVideosDto?: FilterVideosDto) {
    if (!Types.ObjectId.isValid(episodeId)) {
      throw new BadRequestException('Invalid episode ID');
    }

    const page = filterVideosDto?.page || 1;
    const limit = filterVideosDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterVideosDto?.sortBy || 'order';
    const sortOrder = filterVideosDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = { episodeId: new Types.ObjectId(episodeId) };

    if (filterVideosDto) {
      // Search by title
      if (filterVideosDto.title && filterVideosDto.title.trim()) {
        query.title = { $regex: filterVideosDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want videos where the age range overlaps with the filter
      if (filterVideosDto.minAge !== undefined) {
        // Video's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterVideosDto.minAge };
      }
      if (filterVideosDto.maxAge !== undefined) {
        // Video's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterVideosDto.maxAge };
      }

      // Filter by series
      if (filterVideosDto.series) {
        query.series = filterVideosDto.series;
      }

      // Filter by series list (any matching)
      if (filterVideosDto.series_list && filterVideosDto.series_list.length > 0) {
        query.series = { $in: filterVideosDto.series_list };
      }

      // Filter by format
      if (filterVideosDto.format) {
        query.format = filterVideosDto.format;
      }

      // Filter by values (any matching values)
      if (filterVideosDto.values && filterVideosDto.values.length > 0) {
        query.values = { $in: filterVideosDto.values };
      }

      // Filter by isPremium
      if (filterVideosDto.isPremium !== undefined) {
        query.isPremium = filterVideosDto.isPremium;
      }

      // Filter by isActive
      if (filterVideosDto.isActive !== undefined) {
        query.isActive = filterVideosDto.isActive;
      }
    }

    const [data, total] = await Promise.all([
      this.videoModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.videoModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }


  async findBySeasonId(seasonId: string, filterVideosDto?: FilterVideosDto) {
    if (!Types.ObjectId.isValid(seasonId)) {
      throw new BadRequestException('Invalid season ID');
    }

    const page = filterVideosDto?.page || 1;
    const limit = filterVideosDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterVideosDto?.sortBy || 'order';
    const sortOrder = filterVideosDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = { seasonId: new Types.ObjectId(seasonId) };

    if (filterVideosDto?.title && filterVideosDto.title.trim()) {
      query.title = { $regex: filterVideosDto.title.trim(), $options: 'i' };
    }
    if (filterVideosDto?.minAge !== undefined) {
      query['age.1'] = { $gte: filterVideosDto.minAge };
    }
    if (filterVideosDto?.maxAge !== undefined) {
      query['age.0'] = { $lte: filterVideosDto.maxAge };
    }
    if (filterVideosDto?.series) {
      query.series = filterVideosDto.series;
    }
    if (filterVideosDto?.series_list?.length) {
      query.series = { $in: filterVideosDto.series_list };
    }
    if (filterVideosDto?.format) {
      query.format = filterVideosDto.format;
    }
    if (filterVideosDto?.values?.length) {
      query.values = { $in: filterVideosDto.values };
    }
    if (filterVideosDto?.isPremium !== undefined) {
      query.isPremium = filterVideosDto.isPremium;
    }
    if (filterVideosDto?.isActive !== undefined) {
      query.isActive = filterVideosDto.isActive;
    }

    const [data, total] = await Promise.all([
      this.videoModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.videoModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const video = await this.videoModel
      .findById(id)
      .populate('episodeId')
        .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!video) {
      throw new BadRequestException('Video not found');
    }
    return video;
  }

  async findBySlug(slug: string) {
    const video = await this.videoModel
      .findOne({ slug })
      .populate('episodeId')
        .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!video) {
      throw new BadRequestException('Video not found');
    }
    return video;
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    // Validate dynamic fields if provided
    if (updateVideoDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'video',
        updateVideoDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    const updateData = {
      ...updateVideoDto,
    };
    if (updateData.seasonId) {
      updateData.seasonId = new Types.ObjectId(updateData.seasonId);
    }
    if (updateData.episodeId) {
      updateData.episodeId = new Types.ObjectId(updateData.episodeId);
    }
    if (updateData.title && !updateData.slug) {
      updateData.slug = slugify(updateData.title, { lower: true });
    }
    const updatedVideo = await this.videoModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('episodeId')
        .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!updatedVideo) {
      throw new BadRequestException('Video not found');
    }
    return updatedVideo;
  }

  async remove(id: string) {
    const deletedVideo = await this.videoModel
      .findByIdAndDelete(id)
      .populate('episodeId')
        .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!deletedVideo) {
      throw new BadRequestException('Video not found');
    }
    return deletedVideo;
  }

  /**
   * Get all related content from the same episode
   */
  async getRelatedContent(videoId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(videoId)) {
        throw new BadRequestException('Invalid video ID');
      }

      const video = await this.videoModel.findById(videoId).exec();
      if (!video) {
        throw new BadRequestException('Video not found');
      }

      const otherVideos = await this.videoModel
        .find({
          episodeId: video.episodeId,
          _id: { $ne: videoId },
          isActive: true,
        })
        .limit(limit)
        .sort({ order: 1 })
        .exec();

      return {
        currentVideo: video,
        relatedVideos: otherVideos,
        count: otherVideos.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching related content: ${error.message}`);
    }
  }

  /**
   * Get similar videos based on age range and values
   */
  async getSimilarContent(videoId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(videoId)) {
        throw new BadRequestException('Invalid video ID');
      }

      const video = await this.videoModel.findById(videoId).exec();
      if (!video) {
        throw new BadRequestException('Video not found');
      }

      const query: any = {
        _id: { $ne: videoId },
        isActive: true,
        $or: [
          {
            age: {
              $elemMatch: {
                $gte: video.age[0],
                $lte: video.age[1],
              },
            },
          },
          { values: { $in: video.values || [] } },
        ],
      };

      if (video.isPremium !== undefined) {
        query.isPremium = video.isPremium;
      }

      const similarVideos = await this.videoModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        currentVideo: video,
        similar: similarVideos,
        count: similarVideos.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching similar videos: ${error.message}`);
    }
  }
}
