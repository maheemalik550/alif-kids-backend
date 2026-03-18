import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FilterGamesDto } from './dto/filter-games.dto';
import { Game, GameDocument } from './schemas/game.schema';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    private settingsService: SettingsService,
  ) {}

  async create(createGameDto: CreateGameDto, userId?: string) {
    // Validate dynamic fields if provided
    if (createGameDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'game',
        createGameDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    if (!createGameDto.episodeId && !createGameDto.seasonId) {
      throw new BadRequestException('Either episodeId or seasonId is required');
    }

    const slug = createGameDto.slug || slugify(createGameDto.title, { lower: true });
    const gameData = {
      ...createGameDto,
      slug,
      ...(createGameDto.episodeId ? { episodeId: new Types.ObjectId(createGameDto.episodeId) } : {}),
      ...(createGameDto.seasonId ? { seasonId: new Types.ObjectId(createGameDto.seasonId) } : {}),
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
      dynamicFields: createGameDto.dynamicFields || {},
    };
    const createdGame = new this.gameModel(gameData);
    return createdGame.save();
  }

  async findAll(filterGamesDto?: FilterGamesDto) {
    const query: any = {};
    const page = filterGamesDto?.page || 1;
    const limit = filterGamesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterGamesDto?.sortBy || 'order';
    const sortOrder = filterGamesDto?.sortOrder === 'asc' ? 1 : -1;

    if (filterGamesDto) {
      // Search by title
      if (filterGamesDto.title && filterGamesDto.title.trim()) {
        query.title = { $regex: filterGamesDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want games where the age range overlaps with the filter
      if (filterGamesDto.minAge !== undefined) {
        // Game's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterGamesDto.minAge };
      }
      if (filterGamesDto.maxAge !== undefined) {
        // Game's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterGamesDto.maxAge };
      }

      // Filter by series
      if (filterGamesDto.series) {
        query.series = filterGamesDto.series;
      }

      // Filter by series list (any matching)
      if (filterGamesDto.series_list && filterGamesDto.series_list.length > 0) {
        query.series = { $in: filterGamesDto.series_list };
      }

      // Filter by genre
      if (filterGamesDto.genre) {
        query.genre = filterGamesDto.genre;
      }

      // Filter by values (any matching values)
      if (filterGamesDto.values && filterGamesDto.values.length > 0) {
        query.values = { $in: filterGamesDto.values };
      }

      // Filter by isPremium
      if (filterGamesDto.isPremium !== undefined) {
        query.isPremium = filterGamesDto.isPremium;
      }

      // Filter by isActive
      if (filterGamesDto.isActive !== undefined) {
        query.isActive = filterGamesDto.isActive;
      }
    }

    const [data, total] = await Promise.all([
      this.gameModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.gameModel.countDocuments(query).exec(),
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

  async findByEpisodeId(episodeId: string, filterGamesDto?: FilterGamesDto) {
    if (!Types.ObjectId.isValid(episodeId)) {
      throw new BadRequestException('Invalid episode ID');
    }

    const page = filterGamesDto?.page || 1;
    const limit = filterGamesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterGamesDto?.sortBy || 'order';
    const sortOrder = filterGamesDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = { episodeId: new Types.ObjectId(episodeId) };

    if (filterGamesDto) {
      // Search by title
      if (filterGamesDto.title && filterGamesDto.title.trim()) {
        query.title = { $regex: filterGamesDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want games where the age range overlaps with the filter
      if (filterGamesDto.minAge !== undefined) {
        // Game's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterGamesDto.minAge };
      }
      if (filterGamesDto.maxAge !== undefined) {
        // Game's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterGamesDto.maxAge };
      }

      // Filter by series
      if (filterGamesDto.series) {
        query.series = filterGamesDto.series;
      }

      // Filter by series list (any matching)
      if (filterGamesDto.series_list && filterGamesDto.series_list.length > 0) {
        query.series = { $in: filterGamesDto.series_list };
      }

      // Filter by genre
      if (filterGamesDto.genre) {
        query.genre = filterGamesDto.genre;
      }

      // Filter by values (any matching values)
      if (filterGamesDto.values && filterGamesDto.values.length > 0) {
        query.values = { $in: filterGamesDto.values };
      }

      // Filter by isPremium
      if (filterGamesDto.isPremium !== undefined) {
        query.isPremium = filterGamesDto.isPremium;
      }

      // Filter by isActive
      if (filterGamesDto.isActive !== undefined) {
        query.isActive = filterGamesDto.isActive;
      }
    }

    const [data, total] = await Promise.all([
      this.gameModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.gameModel.countDocuments(query).exec(),
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



  async findBySeasonId(seasonId: string, filterGamesDto?: FilterGamesDto) {
    if (!Types.ObjectId.isValid(seasonId)) {
      throw new BadRequestException('Invalid season ID');
    }

    const page = filterGamesDto?.page || 1;
    const limit = filterGamesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterGamesDto?.sortBy || 'order';
    const sortOrder = filterGamesDto?.sortOrder === 'asc' ? 1 : -1;
    const query: any = { seasonId: new Types.ObjectId(seasonId) };

    if (filterGamesDto?.title && filterGamesDto.title.trim()) query.title = { $regex: filterGamesDto.title.trim(), $options: 'i' };
    if (filterGamesDto?.minAge !== undefined) query['age.1'] = { $gte: filterGamesDto.minAge };
    if (filterGamesDto?.maxAge !== undefined) query['age.0'] = { $lte: filterGamesDto.maxAge };
    if (filterGamesDto?.series) query.series = filterGamesDto.series;
    if (filterGamesDto?.series_list?.length) query.series = { $in: filterGamesDto.series_list };
    if (filterGamesDto?.genre) query.genre = filterGamesDto.genre;
    if (filterGamesDto?.values?.length) query.values = { $in: filterGamesDto.values };
    if (filterGamesDto?.isPremium !== undefined) query.isPremium = filterGamesDto.isPremium;
    if (filterGamesDto?.isActive !== undefined) query.isActive = filterGamesDto.isActive;

    const [data, total] = await Promise.all([
      this.gameModel.find(query).populate('episodeId').populate('seasonId').populate('createdBy', '-password -refreshToken -__v').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).exec(),
      this.gameModel.countDocuments(query).exec(),
    ]);

    return { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const game = await this.gameModel
      .findById(id)
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!game) {
      throw new BadRequestException('Game not found');
    }
    return game;
  }

  async findBySlug(slug: string) {
    const game = await this.gameModel
      .findOne({ slug })
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!game) {
      throw new BadRequestException('Game not found');
    }
    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    // Validate dynamic fields if provided
    if (updateGameDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'game',
        updateGameDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    const updateData = {
      ...updateGameDto,
    };
    if (updateData.episodeId) {
      updateData.episodeId = new Types.ObjectId(updateData.episodeId);
    }
    const updatedGame = await this.gameModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!updatedGame) {
      throw new BadRequestException('Game not found');
    }
    return updatedGame;
  }

  async remove(id: string) {
    const deletedGame = await this.gameModel
      .findByIdAndDelete(id)
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!deletedGame) {
      throw new BadRequestException('Game not found');
    }
    return deletedGame;
  }

  /**
   * Get all related content from the same episode
   */
  async getRelatedContent(gameId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(gameId)) {
        throw new BadRequestException('Invalid game ID');
      }

      const game = await this.gameModel.findById(gameId).exec();
      if (!game) {
        throw new BadRequestException('Game not found');
      }

      const otherGames = await this.gameModel
        .find({
          episodeId: game.episodeId,
          _id: { $ne: gameId },
          isActive: true,
        })
        .limit(limit)
        .sort({ order: 1 })
        .exec();

      return {
        currentGame: game,
        relatedGames: otherGames,
        count: otherGames.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching related content: ${error.message}`);
    }
  }

  /**
   * Get similar games based on age range, values, and genre
   */
  async getSimilarContent(gameId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(gameId)) {
        throw new BadRequestException('Invalid game ID');
      }

      const game = await this.gameModel.findById(gameId).exec();
      if (!game) {
        throw new BadRequestException('Game not found');
      }

      const query: any = {
        _id: { $ne: gameId },
        isActive: true,
        $or: [
          {
            age: {
              $elemMatch: {
                $gte: game.age[0],
                $lte: game.age[1],
              },
            },
          },
          { values: { $in: game.values || [] } },
          { genre: game.genre },
        ],
      };

      if (game.isPremium !== undefined) {
        query.isPremium = game.isPremium;
      }

      const similarGames = await this.gameModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        currentGame: game,
        similar: similarGames,
        count: similarGames.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching similar games: ${error.message}`);
    }
  }
}
