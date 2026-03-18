import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import type { File } from 'multer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { FilterSeriesDto } from './dto/filter-series.dto';
import { Series, SeriesDocument } from './schemas/series.schema';
import { Season } from '../seasons/schemas/season.schema';
import { Episode } from '../episodes/schemas/episode.schema';
import { uploadOnCloudinary } from '../common/helpers/cloudinary';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>,
    @InjectModel(Season.name) private seasonModel: Model<any>,
    @InjectModel(Episode.name) private episodeModel: Model<any>,
  ) {}

  async create(createSeriesDto: CreateSeriesDto) {
    try {
      // Trim string fields
      const trimmedDto = {
        ...createSeriesDto,
        name: createSeriesDto.name?.trim(),
        status: createSeriesDto.status?.trim(),
        owner: createSeriesDto.owner?.trim(),
      };

      // Validate that series title is unique (case-insensitive)
      const existingSeries = await this.seriesModel
        .findOne({ name: { $regex: `^${trimmedDto.name}$`, $options: 'i' } })
        .exec();
      if (existingSeries) {
        throw new BadRequestException(
          `Series with title "${trimmedDto.name}" already exists`
        );
      }

      const createdSeries = new this.seriesModel(trimmedDto);
      return createdSeries.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error creating series: ${error.message}`);
    }
  }

  async findAll(filterSeriesDto?: FilterSeriesDto) {
    const page = filterSeriesDto?.page || 1;
    const limit = filterSeriesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterSeriesDto?.sortBy || 'createdAt';
    const sortOrder = filterSeriesDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = {};

    // Search by name or other fields
    if (filterSeriesDto?.search) {
      query.$or = [
        { name: { $regex: filterSeriesDto.search, $options: 'i' } },
        { status: { $regex: filterSeriesDto.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.seriesModel
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.seriesModel.countDocuments(query).exec(),
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

  findOne(id: string) {
    return this.seriesModel.findById(id).exec();
  }

  async findPublicList() {
    const series = await this.seriesModel
      .find({ status: 'active' })
      .sort({ createdAt: -1, name: 1 })
      .lean()
      .exec();

    const seriesIds = series.map((item: any) => item._id);
    const seasonCounts = await this.seasonModel.aggregate([
      { $match: { status: 'active', seriesId: { $in: seriesIds.map((id: any) => String(id)) } } },
      { $group: { _id: '$seriesId', count: { $sum: 1 } } },
    ]);

    const seasonCountMap = new Map(seasonCounts.map((item: any) => [String(item._id), item.count]));

    return series.map((item: any) => ({
      ...item,
      seasonsCount: seasonCountMap.get(String(item._id)) || 0,
      icon: item.icon || item.imageUrl || '',
    }));
  }

  async findPublicDetails(id: string): Promise<any> {
    const series = await this.seriesModel.findById(id).lean().exec();
    if (!series) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }

    const seasons = await this.seasonModel
      .find({ seriesId: id, status: 'active' })
      .sort({ seasonNumber: 1, createdAt: 1, name: 1 })
      .lean()
      .exec();

    return {
      ...series,
      icon: (series as any).icon || (series as any).imageUrl || '',
      seasons,
    };
  }

  async update(id: string, updateSeriesDto: UpdateSeriesDto) {
    try {
      // Trim string fields
      const trimmedDto = {
        ...updateSeriesDto,
        ...(updateSeriesDto.name && { name: updateSeriesDto.name.trim() }),
        ...(updateSeriesDto.status && { status: updateSeriesDto.status.trim() }),
        ...(updateSeriesDto.owner && { owner: updateSeriesDto.owner.trim() }),
      };

      // Handle cascading status update
      if (trimmedDto.status === 'inActive') {
        // Get all seasons for this series
        const seasons = await this.seasonModel.find({ seriesId: id }).exec();
        const seasonIds = seasons.map((season) => season._id);

        // Set all seasons to inActive
        if (seasonIds.length > 0) {
          await this.seasonModel
            .updateMany({ _id: { $in: seasonIds } }, { status: 'inActive' })
            .exec();

          // Set all episodes in these seasons to inActive
          await this.episodeModel
            .updateMany(
              { seasonId: { $in: seasonIds } },
              { status: 'inActive' }
            )
            .exec();
        }
      }

      return await this.seriesModel
        .findByIdAndUpdate(id, trimmedDto, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Error updating series: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      // Find the series to ensure it exists
      const series = await this.seriesModel.findById(id).exec();
      if (!series) {
        throw new NotFoundException(`Series with ID ${id} not found`);
      }

      // Find all seasons associated with this series
      const seasons = await this.seasonModel.find({ seriesId: id }).exec();
      const seasonIds = seasons.map((season) => season._id);

      // Count episodes to be deleted
      let episodesDeleted = 0;
      if (seasonIds.length > 0) {
        const episodeResult = await this.episodeModel
          .deleteMany({ seasonId: { $in: seasonIds } })
          .exec();
        episodesDeleted = episodeResult.deletedCount || 0;
      }

      // Delete all seasons for this series
      await this.seasonModel.deleteMany({ seriesId: id }).exec();

      // Delete the series itself
      await this.seriesModel.findByIdAndDelete(id).exec();

      return {
        success: true,
        message: 'Series and all related seasons and episodes deleted successfully',
        deletedData: {
          seriesId: id,
          seasonsDeleted: seasons.length,
          episodesDeleted,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting series: ${error.message}`);
    }
  }

  async uploadSeriesImage(id: string, file: File): Promise<any> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const result = await uploadOnCloudinary(file.path);

      if (!result) {
        throw new BadRequestException('File upload to Cloudinary failed');
      }

      // Update series with the image URL
      const updatedSeries = await this.seriesModel.findByIdAndUpdate(
        id,
        { imageUrl: result.secure_url || result.url },
        { new: true },
      );

      return {
        success: true,
        message: 'Series image uploaded successfully',
        data: {
          seriesId: id,
          imageUrl: result.secure_url || result.url,
          publicId: result.public_id,
          series: updatedSeries,
        },
      };
    } catch (error) {
      console.error('Series image upload error:', error);
      throw error;
    }
  }
}
