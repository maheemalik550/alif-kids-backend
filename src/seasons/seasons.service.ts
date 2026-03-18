import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { FilterSeasonDto } from './dto/filter-season.dto';
import { Season, SeasonDocument } from './schemas/season.schema';
import { Episode } from '../episodes/schemas/episode.schema';
import { Series } from '../series/schemas/series.schema';
import { Book } from '../books/schemas/book.schema';
import { Video } from '../videos/schemas/video.schema';
import { Audio } from '../audios/schemas/audio.schema';
import { Game } from '../games/schemas/game.schema';
import { Printable } from '../printables/schemas/printable.schema';

@Injectable()
export class SeasonsService {
  constructor(
    @InjectModel(Season.name) private seasonModel: Model<SeasonDocument>,
    @InjectModel(Episode.name) private episodeModel: Model<any>,
    @InjectModel(Series.name) private seriesModel: Model<any>,
    @InjectModel(Book.name) private bookModel: Model<any>,
    @InjectModel(Video.name) private videoModel: Model<any>,
    @InjectModel(Audio.name) private audioModel: Model<any>,
    @InjectModel(Game.name) private gameModel: Model<any>,
    @InjectModel(Printable.name) private printableModel: Model<any>,
  ) {}

  async create(createSeasonDto: CreateSeasonDto) {
    try {
      // Trim string fields
      const trimmedDto = {
        ...createSeasonDto,
        name: createSeasonDto.name?.trim(),
        status: createSeasonDto.status?.trim(),
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

      // Validate that season title is unique for the same series (case-insensitive)
      const existingSeason = await this.seasonModel
        .findOne({
          seriesId: trimmedDto.seriesId,
          name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
        })
        .exec();
      if (existingSeason) {
        throw new BadRequestException(
          `Season with title "${trimmedDto.name}" already exists in this series`
        );
      }

      const createdSeason = new this.seasonModel(trimmedDto);
      const savedSeason = await createdSeason.save();

      // Increment season count in Series and initialize episodes to 0
      await this.seriesModel
        .findByIdAndUpdate(
          trimmedDto.seriesId,
          { $inc: { seasons: 1 } },
          { new: true }
        )
        .exec();

      return savedSeason;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error creating season: ${error.message}`);
    }
  }

  async findAll(filterSeasonDto?: FilterSeasonDto) {
    const page = filterSeasonDto?.page || 1;
    const limit = filterSeasonDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterSeasonDto?.sortBy || 'createdAt';
    const sortOrder = filterSeasonDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = {};

    // Search by name or other fields
    if (filterSeasonDto?.search) {
      query.$or = [
        { name: { $regex: filterSeasonDto.search, $options: 'i' } },
        { status: { $regex: filterSeasonDto.search, $options: 'i' } },
      ];
    }

    if(filterSeasonDto?.seriesId) {
      query.seriesId = filterSeasonDto.seriesId;
    }

    const [data, total] = await Promise.all([
      this.seasonModel
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.seasonModel.countDocuments(query).exec(),
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
    return this.seasonModel.findById(id).exec();
  }

  private uniqueById(items: any[] = []) {
    const seen = new Set<string>();
    return items.filter((item: any) => {
      const key = String(item?._id || '');
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async findPublicDetails(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid season ID');
    }

    const season = await this.seasonModel.findById(id).lean().exec();
    if (!season) {
      throw new NotFoundException(`Season with ID ${id} not found`);
    }

    const series = await this.seriesModel.findById((season as any).seriesId).lean().exec();
    const objectId = new Types.ObjectId(id);
    const episodeIds = (await this.episodeModel.find({ seasonId: id }).select('_id').lean().exec()).map((item: any) => item._id);

    const activeOrMissing = [{ isActive: true }, { isActive: { $exists: false } }];
    const seasonMatch = [{ seasonId: objectId }, { seasonId: id }];
    const episodeMatch = episodeIds.length ? [{ episodeId: { $in: episodeIds } }] : [];

    const [books, videos, audios, games, printables] = await Promise.all([
      this.bookModel.find({ $and: [{ $or: activeOrMissing }, { $or: [...seasonMatch, ...episodeMatch] }] }).sort({ order: 1, createdAt: -1, title: 1 }).lean().exec(),
      this.videoModel.find({ $and: [{ $or: activeOrMissing }, { $or: [...seasonMatch, ...episodeMatch] }] }).sort({ order: 1, createdAt: -1, title: 1 }).lean().exec(),
      this.audioModel.find({ $and: [{ $or: activeOrMissing }, { $or: [...seasonMatch, ...episodeMatch] }] }).sort({ order: 1, createdAt: -1, title: 1 }).lean().exec(),
      this.gameModel.find({ $and: [{ $or: activeOrMissing }, { $or: [...seasonMatch, ...episodeMatch] }] }).sort({ order: 1, createdAt: -1, title: 1 }).lean().exec(),
      this.printableModel.find({ $and: [{ $or: activeOrMissing }, { $or: [...seasonMatch, ...episodeMatch] }] }).sort({ order: 1, createdAt: -1, title: 1 }).lean().exec(),
    ]);

    return {
      season: {
        ...season,
        icon: (season as any).icon || '',
      },
      series: series
        ? {
            ...series,
            icon: (series as any).icon || (series as any).imageUrl || '',
          }
        : null,
      books: this.uniqueById(books),
      videos: this.uniqueById(videos),
      audios: this.uniqueById(audios),
      games: this.uniqueById(games),
      printables: this.uniqueById(printables),
    };
  }

  async update(id: string, updateSeasonDto: UpdateSeasonDto) {
    try {
      // Trim string fields
      const trimmedDto = {
        ...updateSeasonDto,
        ...(updateSeasonDto.name && { name: updateSeasonDto.name.trim() }),
        ...(updateSeasonDto.status && { status: updateSeasonDto.status.trim() }),
      };

      // Handle cascading status update
      if (trimmedDto.status === 'inActive') {
        // Set all episodes in this season to inActive
        await this.episodeModel
          .updateMany({ seasonId: id }, { status: 'inActive' })
          .exec();
      }

      return await this.seasonModel
        .findByIdAndUpdate(id, trimmedDto, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Error updating season: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      // Find the season to ensure it exists
      const season = await this.seasonModel.findById(id).exec();
      if (!season) {
        throw new NotFoundException(`Season with ID ${id} not found`);
      }

      // Delete all episodes for this season
      const deleteResult = await this.episodeModel.deleteMany({ seasonId: id }).exec();
      const episodesDeleted = deleteResult.deletedCount || 0;

      // Delete the season itself
      await this.seasonModel.findByIdAndDelete(id).exec();

      // Decrement season count in Series
      await this.seriesModel
        .findByIdAndUpdate(
          season.seriesId,
          { $inc: { seasons: -1, episodes: -episodesDeleted } },
          { new: true }
        )
        .exec();

      return {
        success: true,
        message: 'Season and all related episodes deleted successfully',
        deletedData: {
          seasonId: id,
          seriesId: season.seriesId,
          episodesDeleted: episodesDeleted,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting season: ${error.message}`);
    }
  }
}
