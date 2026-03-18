import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import type { File } from 'multer';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { FilterEpisodesDto } from './dto/filter-episodes.dto';
import { Episode, EpisodeDocument } from './schemas/episode.schema';
import { Series } from '../series/schemas/series.schema';
import { Season } from '../seasons/schemas/season.schema';
import { SettingsService } from '../settings/settings.service';
import { uploadOnCloudinary } from '../common/helpers/cloudinary';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectModel(Episode.name) private episodeModel: Model<EpisodeDocument>,
    @InjectModel(Series.name) private seriesModel: Model<any>,
    @InjectModel(Season.name) private seasonModel: Model<any>,
    private settingsService: SettingsService,
  ) {}

  async create(createEpisodeDto: CreateEpisodeDto) {
    try {
      // Validate dynamic fields if provided
      if (createEpisodeDto.dynamicFields) {
        const validation = await this.settingsService.validateDynamicFields(
          'episode',
          createEpisodeDto.dynamicFields,
        );
        if (!validation.valid) {
          throw new BadRequestException({
            message: 'Dynamic fields validation failed',
            errors: validation.errors,
          });
        }
      }

      // Trim string fields
      const trimmedDto = {
        ...createEpisodeDto,
        name: createEpisodeDto.name?.trim(),
        status: createEpisodeDto.status?.trim(),
        description: createEpisodeDto.description?.trim(),
        overview: createEpisodeDto.overview?.trim(),
        talkingPoints: createEpisodeDto.talkingPoints?.trim(),
        notes: createEpisodeDto.notes?.trim(),
        forParentsAndTeachers: createEpisodeDto.forParentsAndTeachers?.trim(),
        dynamicFields: createEpisodeDto.dynamicFields || {},
      };

      // Validate that series exists
      const series = await this.seriesModel
        .findById(trimmedDto.seriesId)
        .exec();
      if (!series) {
        throw new BadRequestException(
          `Series with ID ${trimmedDto.seriesId} does not exist`
        );
      }

      // Validate that season exists
      const season = await this.seasonModel
        .findById(trimmedDto.seasonId)
        .exec();
      if (!season) {
        throw new BadRequestException(
          `Season with ID ${trimmedDto.seasonId} does not exist`
        );
      }

      // Additional validation: ensure the season belongs to the specified series
      if (season.seriesId.toString() !== trimmedDto.seriesId) {
        throw new BadRequestException(
          `Season with ID ${trimmedDto.seasonId} does not belong to Series with ID ${trimmedDto.seriesId}`
        );
      }

      const createdEpisode = new this.episodeModel(trimmedDto);
      const savedEpisode = await createdEpisode.save();

      // Increment episode count in Season
      await this.seasonModel
        .findByIdAndUpdate(
          trimmedDto.seasonId,
          { $inc: { episodes: 1 } },
          { new: true }
        )
        .exec();

      // Increment episode count in Series
      await this.seriesModel
        .findByIdAndUpdate(
          trimmedDto.seriesId,
          { $inc: { episodes: 1 } },
          { new: true }
        )
        .exec();

      return savedEpisode;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error creating episode: ${error.message}`);
    }
  }

  private transformEpisodeResponse(episode: any) {
    const doc = episode.toObject ? episode.toObject() : episode;
    if (doc.seriesId) {
      doc.series = doc.seriesId;
      delete doc.seriesId;
    }
    if (doc.seasonId) {
      doc.season = doc.seasonId;
      delete doc.seasonId;
    }
    return doc;
  }

  async findAll(filterEpisodesDto?: FilterEpisodesDto) {
    const query: any = {};
    const page = filterEpisodesDto?.page || 1;
    const limit = filterEpisodesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterEpisodesDto?.sortBy || 'createdAt';
    const sortOrder = filterEpisodesDto?.sortOrder === 'asc' ? 1 : -1;

    if (filterEpisodesDto) {
      // Search by name/title
      if (filterEpisodesDto.title && filterEpisodesDto.title.trim()) {
        query.name = { $regex: filterEpisodesDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want episodes where the age range overlaps with the filter
      if (filterEpisodesDto.minAge !== undefined) {
        // Episode's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterEpisodesDto.minAge };
      }
      if (filterEpisodesDto.maxAge !== undefined) {
        // Episode's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterEpisodesDto.maxAge };
      }

      // Filter by values (any matching values)
      if (filterEpisodesDto.values && filterEpisodesDto.values.length > 0) {
        query.values = { $in: filterEpisodesDto.values };
      }

      // Filter by series (any matching series)
      if (filterEpisodesDto.series && filterEpisodesDto.series.length > 0) {
        query.seriesId = { $in: filterEpisodesDto.series };
      }
    }

    const [episodes, total] = await Promise.all([
      this.episodeModel
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('seriesId')
        .populate('seasonId')
        .exec(),
      this.episodeModel.countDocuments(query).exec(),
    ]);

    return {
      data: episodes.map((episode) => this.transformEpisodeResponse(episode)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findAllWithFilters(filterEpisodesDto: FilterEpisodesDto) {
    return this.findAll(filterEpisodesDto);
  }

  async findOne(id: string) {
    const episode = await this.episodeModel
      .findById(id)
      .populate('seriesId')
      .populate('seasonId')
      .exec();
    if (!episode) return null;
    return this.transformEpisodeResponse(episode);
  }

  async update(id: string, updateEpisodeDto: UpdateEpisodeDto) {
    try {
      // Validate dynamic fields if provided
      if (updateEpisodeDto.dynamicFields) {
        const validation = await this.settingsService.validateDynamicFields(
          'episode',
          updateEpisodeDto.dynamicFields,
        );
        if (!validation.valid) {
          throw new BadRequestException({
            message: 'Dynamic fields validation failed',
            errors: validation.errors,
          });
        }
      }

      // Trim string fields
      const trimmedDto = {
        ...updateEpisodeDto,
        ...(updateEpisodeDto.name && { name: updateEpisodeDto.name.trim() }),
        ...(updateEpisodeDto.status && { status: updateEpisodeDto.status.trim() }),
        ...(updateEpisodeDto.description && { description: updateEpisodeDto.description.trim() }),
        ...(updateEpisodeDto.overview && { overview: updateEpisodeDto.overview.trim() }),
        ...(updateEpisodeDto.talkingPoints && { talkingPoints: updateEpisodeDto.talkingPoints.trim() }),
        ...(updateEpisodeDto.notes && { notes: updateEpisodeDto.notes.trim() }),
        ...(updateEpisodeDto.forParentsAndTeachers && { forParentsAndTeachers: updateEpisodeDto.forParentsAndTeachers.trim() }),
      };

      return await this.episodeModel
        .findByIdAndUpdate(id, trimmedDto, { new: true })
        .exec();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error updating episode: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      // Find the episode to ensure it exists
      const episode = await this.episodeModel.findById(id).exec();
      if (!episode) {
        throw new NotFoundException(`Episode with ID ${id} not found`);
      }

      // Delete the episode
      await this.episodeModel.findByIdAndDelete(id).exec();

      // Decrement episode count in Season
      await this.seasonModel
        .findByIdAndUpdate(
          episode.seasonId,
          { $inc: { episodes: -1 } },
          { new: true }
        )
        .exec();

      // Decrement episode count in Series
      await this.seriesModel
        .findByIdAndUpdate(
          episode.seriesId,
          { $inc: { episodes: -1 } },
          { new: true }
        )
        .exec();

      return {
        success: true,
        message: 'Episode deleted successfully',
        deletedData: {
          episodeId: id,
          seriesId: episode.seriesId,
          seasonId: episode.seasonId,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting episode: ${error.message}`);
    }
  }

  async uploadEpisodeImage(id: string, file: File): Promise<any> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const result = await uploadOnCloudinary(file.path);

      if (!result) {
        throw new BadRequestException('File upload to Cloudinary failed');
      }

      // Update episode with the image URL
      const updatedEpisode = await this.episodeModel.findByIdAndUpdate(
        id,
        { imageUrl: result.secure_url || result.url },
        { new: true },
      );

      return {
        success: true,
        message: 'Episode image uploaded successfully',
        data: {
          episodeId: id,
          imageUrl: result.secure_url || result.url,
          publicId: result.public_id,
          episode: updatedEpisode,
        },
      };
    } catch (error) {
      console.error('Episode image upload error:', error);
      throw error;
    }
  }

  /**
   * Get similar episodes based on series, age range, and values
   */
  async getSimilarEpisodes(episodeId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(episodeId)) {
        throw new BadRequestException('Invalid episode ID');
      }

      const episode = await this.episodeModel.findById(episodeId).exec();
      if (!episode) {
        throw new NotFoundException(`Episode with ID ${episodeId} not found`);
      }

      const similarEpisodes = await this.episodeModel
        .find({
          _id: { $ne: episodeId },
          seriesId: episode.seriesId,
          status: 'active',
        })
        .populate('seriesId')
        .populate('seasonId')
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        currentEpisode: this.transformEpisodeResponse(episode),
        similar: similarEpisodes.map((ep) => this.transformEpisodeResponse(ep)),
        count: similarEpisodes.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching similar episodes: ${error.message}`);
    }
  }

  /**
   * Get trending/related episodes based on age range and values
   */
  async getTrendingRelatedEpisodes(episodeId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(episodeId)) {
        throw new BadRequestException('Invalid episode ID');
      }

      const episode = await this.episodeModel.findById(episodeId).exec();
      if (!episode) {
        throw new NotFoundException(`Episode with ID ${episodeId} not found`);
      }

      const trendingEpisodes = await this.episodeModel
        .find({
          _id: { $ne: episodeId },
          $or: [
            {
              age: {
                $elemMatch: {
                  $gte: episode.age[0],
                  $lte: episode.age[1],
                },
              },
            },
            { values: { $in: episode.values || [] } },
          ],
          status: 'active',
        })
        .populate('seriesId')
        .populate('seasonId')
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        currentEpisode: this.transformEpisodeResponse(episode),
        related: trendingEpisodes.map((ep) => this.transformEpisodeResponse(ep)),
        count: trendingEpisodes.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching trending episodes: ${error.message}`);
    }
  }
}
