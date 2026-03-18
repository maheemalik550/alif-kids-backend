import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserActivityProgress, UserActivityProgressDocument } from '../schemas';
import {
  CreateUserActivityProgressDto,
  UpdateUserActivityProgressDto,
} from '../dto';

@Injectable()
export class UserActivityProgressService {
  constructor(
    @InjectModel('UserActivityProgress')
    private model: Model<UserActivityProgressDocument>,
    @InjectModel('MultiChoiceQuestion')
    private multiChoiceModel: Model<any>,
    @InjectModel('FillInTheBlanks')
    private fillInTheBlanksModel: Model<any>,
    @InjectModel('CardMatch')
    private cardMatchModel: Model<any>,
    @InjectModel('CategorizeIt')
    private categorizeItModel: Model<any>,
    @InjectModel('PhotoMatch')
    private photoMatchModel: Model<any>,
    @InjectModel('TranslationMatch')
    private translationMatchModel: Model<any>,
    @InjectModel('ListMatch')
    private listMatchModel: Model<any>,
    @InjectModel('WordDiscovery')
    private wordDiscoveryModel: Model<any>,
    @InjectModel('MazeGame')
    private mazeGameModel: Model<any>,
    @InjectModel('CrosswordPuzzle')
    private crosswordPuzzleModel: Model<any>,
    @InjectModel('QAShortAnswer')
    private qaShortAnswerModel: Model<any>,
    @InjectModel('ReflectRespond')
    private reflectRespondModel: Model<any>,
    @InjectModel('MultiAnswerShortQA')
    private multiAnswerShortQAModel: Model<any>,
    @InjectModel('HandsOnActivity')
    private handsOnActivityModel: Model<any>,
    @InjectModel('FreeDrawing')
    private freeDrawingModel: Model<any>,
    @InjectModel('DynamicOrderBlanks')
    private dynamicOrderBlanksModel: Model<any>,
    @InjectModel('CompleteTheShape')
    private completeTheShapeModel: Model<any>,
    @InjectModel('LocateIt')
    private locateItModel: Model<any>,
    @InjectModel('FillTheKabah')
    private fillTheKabahModel: Model<any>,
    @InjectModel('FillTheColor')
    private fillTheColorModel: Model<any>,
    @InjectModel('ActivityType')
    private activityTypeModel: Model<any>,
  ) {}

  async create(
    dto: CreateUserActivityProgressDto,
  ): Promise<UserActivityProgressDocument> {
    // Normalize userId to ObjectId
    const normalizedDto = this.normalizeIds(dto);
    return this.model.create(normalizedDto);
  }

  /**
   * Normalize IDs to ensure consistent ObjectId format
   */
  private normalizeIds(dto: any): any {
    const normalized = { ...dto };

    // Convert userId to ObjectId (required field)
    if (normalized.userId !== undefined && normalized.userId !== null) {
      if (normalized.userId === 'undefined' || String(normalized.userId).trim() === '') {
        throw new Error('userId is required and cannot be undefined or empty');
      }
      // Convert to ObjectId if it's not already
      if (!(normalized.userId instanceof Types.ObjectId)) {
        normalized.userId = Types.ObjectId.isValid(normalized.userId)
          ? new Types.ObjectId(normalized.userId)
          : normalized.userId;
      }
    }

    // Convert activityId to ObjectId (required field)
    if (normalized.activityId !== undefined && normalized.activityId !== null) {
      if (!(normalized.activityId instanceof Types.ObjectId)) {
        normalized.activityId = Types.ObjectId.isValid(normalized.activityId)
          ? new Types.ObjectId(normalized.activityId)
          : normalized.activityId;
      }
    }

    // Convert episodeId to ObjectId (required field)
    if (normalized.episodeId !== undefined && normalized.episodeId !== null) {
      if (!(normalized.episodeId instanceof Types.ObjectId)) {
        normalized.episodeId = Types.ObjectId.isValid(normalized.episodeId)
          ? new Types.ObjectId(normalized.episodeId)
          : normalized.episodeId;
      }
    }

    return normalized;
  }

  async findByUserAndActivity(
    userId: string,
    activityId: string,
  ): Promise<UserActivityProgressDocument> {
    // Build query to match both string and ObjectId formats for userId
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    // Build query to match both string and ObjectId formats for activityId
    const activityIdQueries: any[] = [{ activityId: activityId }];
    if (Types.ObjectId.isValid(activityId)) {
      activityIdQueries.push({
        activityId: new Types.ObjectId(activityId),
      } as any);
    }

    // Combine queries with $and to ensure both conditions match
    return this.model.findOne({
      $and: [{ $or: userIdQueries }, { $or: activityIdQueries }],
    });
  }

  async findByUserAndEpisode(
    userId: string,
    episodeId: string,
  ): Promise<UserActivityProgressDocument[]> {
    return this.model.find({ userId, episodeId }).populate('userId episodeId');
  }

  async findUserProgress(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: any[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    // Build query to match both string and ObjectId formats for userId
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    const query = { $or: userIdQueries };

    const [progressRecords, total] = await Promise.all([
      this.model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .select('-__v'),
      this.model.countDocuments(query),
    ]);

    if (progressRecords.length === 0) {
      return {
        data: [],
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      };
    }

    const activityModels = {
      MultiChoiceQuestion: this.multiChoiceModel,
      FillInTheBlanks: this.fillInTheBlanksModel,
      CardMatch: this.cardMatchModel,
      CategorizeIt: this.categorizeItModel,
      PhotoMatch: this.photoMatchModel,
      TranslationMatch: this.translationMatchModel,
      ListMatch: this.listMatchModel,
      WordDiscovery: this.wordDiscoveryModel,
      MazeGame: this.mazeGameModel,
      CrosswordPuzzle: this.crosswordPuzzleModel,
      QAShortAnswer: this.qaShortAnswerModel,
      ReflectRespond: this.reflectRespondModel,
      MultiAnswerShortQA: this.multiAnswerShortQAModel,
      HandsOnActivity: this.handsOnActivityModel,
      FreeDrawing: this.freeDrawingModel,
      DynamicOrderBlanks: this.dynamicOrderBlanksModel,
      CompleteTheShape: this.completeTheShapeModel,
      LocateIt: this.locateItModel,
      FillTheKabah: this.fillTheKabahModel,
      FillTheColor: this.fillTheColorModel,
    };

    const enrichedData = await Promise.all(
      progressRecords.map(async (progressRecord) => {
        const modelName = progressRecord.activityModel;
        const model = activityModels[modelName];

        let activityObject = null;
        if (model) {
          activityObject = await model
            .findById(progressRecord.activityId)
            .lean()
            .select('-__v');

          if (activityObject && activityObject.typeId) {
            const typeObject = await this.activityTypeModel
              .findById(activityObject.typeId)
              .lean()
              .select('-__v');
            activityObject.type = typeObject;
            delete activityObject.typeId;
          }
        }

        return {
          ...progressRecord,
          activity: activityObject,
          activityData: progressRecord.activityData || {},
        };
      }),
    );

    return {
      data: enrichedData,
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  /**
   * Enrich progress records with activity details
   */
  private async enrichProgressRecords(
    progressRecords: any[],
    activityModels: any = null,
  ): Promise<any[]> {
    if (!activityModels) {
      activityModels = {
        MultiChoiceQuestion: this.multiChoiceModel,
        FillInTheBlanks: this.fillInTheBlanksModel,
        CardMatch: this.cardMatchModel,
        CategorizeIt: this.categorizeItModel,
        PhotoMatch: this.photoMatchModel,
        TranslationMatch: this.translationMatchModel,
        ListMatch: this.listMatchModel,
        WordDiscovery: this.wordDiscoveryModel,
        MazeGame: this.mazeGameModel,
        CrosswordPuzzle: this.crosswordPuzzleModel,
        QAShortAnswer: this.qaShortAnswerModel,
        ReflectRespond: this.reflectRespondModel,
        MultiAnswerShortQA: this.multiAnswerShortQAModel,
        HandsOnActivity: this.handsOnActivityModel,
        FreeDrawing: this.freeDrawingModel,
        DynamicOrderBlanks: this.dynamicOrderBlanksModel,
        CompleteTheShape: this.completeTheShapeModel,
        LocateIt: this.locateItModel,
        FillTheKabah: this.fillTheKabahModel,
        FillTheColor: this.fillTheColorModel,
      };
    }

    return Promise.all(
      progressRecords.map(async (progressRecord) => {
        const modelName = progressRecord.activityModel;
        const model = activityModels[modelName];

        let activityObject = null;
        if (model) {
          activityObject = await model
            .findById(progressRecord.activityId)
            .lean()
            .select('-__v');

          if (activityObject && activityObject.typeId) {
            const typeObject = await this.activityTypeModel
              .findById(activityObject.typeId)
              .lean()
              .select('-__v');
            activityObject.type = typeObject;
            delete activityObject.typeId;
          }
        }

        return {
          ...progressRecord,
          activity: activityObject,
          activityData: progressRecord.activityData || {},
        };
      }),
    );
  }

  async update(
    id: string,
    dto: UpdateUserActivityProgressDto,
  ): Promise<UserActivityProgressDocument> {
    // Normalize IDs in update DTO
    const normalizedDto = this.normalizeIds(dto);
    const updated = await this.model.findByIdAndUpdate(id, normalizedDto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('User activity progress not found');
    }

    // Enrich with activity object
    const enrichedRecords = await this.enrichProgressRecords([updated.toObject()]);
    return enrichedRecords[0];
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async getEpisodeProgress(episodeId: string, userId: string) {
    return this.model
      .find({ episodeId, userId })
      .select('-activityProgressHistoryData');
  }

  async getUserProgressForAllActivities(
    userId: string,
    episodeId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: any[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }> {
    if (!userId || !episodeId) {
      throw new BadRequestException('User ID and Episode ID are required');
    }

    const skip = (page - 1) * limit;

    // Build query to match both string and ObjectId formats for userId
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    // Build query to match both string and ObjectId formats for episodeId
    const episodeIdQueries: any[] = [{ episodeId: episodeId }];
    if (Types.ObjectId.isValid(episodeId)) {
      episodeIdQueries.push({
        episodeId: new Types.ObjectId(episodeId),
      } as any);
    }

    const query = {
      $and: [{ $or: userIdQueries }, { $or: episodeIdQueries }],
    };

    const [progressRecords, total] = await Promise.all([
      this.model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .select('-__v'),
      this.model.countDocuments(query),
    ]);

    const activityModels = {
      MultiChoiceQuestion: this.multiChoiceModel,
      FillInTheBlanks: this.fillInTheBlanksModel,
      CardMatch: this.cardMatchModel,
      CategorizeIt: this.categorizeItModel,
      PhotoMatch: this.photoMatchModel,
      TranslationMatch: this.translationMatchModel,
      ListMatch: this.listMatchModel,
      WordDiscovery: this.wordDiscoveryModel,
      MazeGame: this.mazeGameModel,
      CrosswordPuzzle: this.crosswordPuzzleModel,
      QAShortAnswer: this.qaShortAnswerModel,
      ReflectRespond: this.reflectRespondModel,
      MultiAnswerShortQA: this.multiAnswerShortQAModel,
      HandsOnActivity: this.handsOnActivityModel,
      FreeDrawing: this.freeDrawingModel,
      DynamicOrderBlanks: this.dynamicOrderBlanksModel,
      CompleteTheShape: this.completeTheShapeModel,
      LocateIt: this.locateItModel,
      FillTheKabah: this.fillTheKabahModel,
      FillTheColor: this.fillTheColorModel,
    };

    const enrichedData = await Promise.all(
      progressRecords.map(async (progressRecord) => {
        const modelName = progressRecord.activityModel;
        const model = activityModels[modelName];

        let activityObject = null;
        if (model) {
          activityObject = await model
            .findById(progressRecord.activityId)
            .lean()
            .select('-__v');

          if (activityObject && activityObject.typeId) {
            const typeObject = await this.activityTypeModel
              .findById(activityObject.typeId)
              .lean()
              .select('-__v');
            activityObject.type = typeObject;
            delete activityObject.typeId;
          }
        }

        return {
          ...progressRecord,
          activity: activityObject,
          activityData: progressRecord.activityData || {},
        };
      }),
    );

    return {
      data: enrichedData,
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  /**
   * Delete user progress by user and episode ID
   */
  async deleteUserProgress(
    userId: string,
    episodeId: string,
  ): Promise<{ success: boolean; deletedCount: number; message: string }> {
    if (!userId || !episodeId) {
      throw new BadRequestException('User ID and Episode ID are required');
    }

    // Build query to match both string and ObjectId formats for userId
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    // Build query to match both string and ObjectId formats for episodeId
    const episodeIdQueries: any[] = [{ episodeId: episodeId }];
    if (Types.ObjectId.isValid(episodeId)) {
      episodeIdQueries.push({
        episodeId: new Types.ObjectId(episodeId),
      } as any);
    }

    const query = {
      $and: [{ $or: userIdQueries }, { $or: episodeIdQueries }],
    };

    const result = await this.model.deleteMany(query);

    return {
      success: true,
      deletedCount: result.deletedCount,
      message: 'User progress deleted successfully',
    };
  }

  /**
   * Update and get user activity progress by user and activity ID
   */
  async updateAndGetProgress(
    userId: string,
    activityId: string,
    updateData: UpdateUserActivityProgressDto,
  ): Promise<UserActivityProgressDocument | null> {
    if (!userId || !activityId) {
      throw new BadRequestException('User ID and Activity ID are required');
    }

    // Normalize IDs in update data for consistency
    const normalizedData = this.normalizeIds(updateData);

    // Build query to match both string and ObjectId formats for userId
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    // Build query to match both string and ObjectId formats for activityId
    const activityIdQueries: any[] = [{ activityId: activityId }];
    if (Types.ObjectId.isValid(activityId)) {
      activityIdQueries.push({
        activityId: new Types.ObjectId(activityId),
      } as any);
    }

    const query = {
      $and: [{ $or: userIdQueries }, { $or: activityIdQueries }],
    };

    const updated = await this.model.findOneAndUpdate(
      query,
      normalizedData,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(
        'User activity progress not found for this user and activity',
      );
    }

    return updated;
  }

  /**
   * Drop the user activity progress collection (admin only)
   */
  async dropCollection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.model.collection.drop();
      return {
        success: true,
        message: 'User activity progress collection dropped successfully',
      };
    } catch (error) {
      if (error.message.includes('ns not found')) {
        return {
          success: true,
          message: 'Collection does not exist or already dropped',
        };
      }
      throw new InternalServerErrorException(
        'Failed to drop collection: ' + error.message,
      );
    }
  }

  /**
   * Bulk create user progress for all activities in an episode
   */
  async bulkCreateByEpisode(
    userId: string,
    episodeId: string,
  ): Promise<{ success: boolean; createdCount: number; message: string }> {
    if (!userId || !episodeId) {
      throw new BadRequestException('User ID and Episode ID are required');
    }

    // Convert to ObjectId for creating records
    const userObjectId = Types.ObjectId.isValid(userId)
      ? new Types.ObjectId(userId)
      : userId;
    const episodeObjectId = Types.ObjectId.isValid(episodeId)
      ? new Types.ObjectId(episodeId)
      : episodeId;

    // Build query to match both string and ObjectId formats for userId
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    // Build query to match both string and ObjectId formats for episodeId
    const episodeIdQueries: any[] = [{ episodeId: episodeId }];
    if (Types.ObjectId.isValid(episodeId)) {
      episodeIdQueries.push({
        episodeId: new Types.ObjectId(episodeId),
      } as any);
    }

    const queryForFetch = {
      $and: [{ $or: userIdQueries }, { $or: episodeIdQueries }],
    };

    // Get all activity models
    const activityModels = {
      MultiChoiceQuestion: this.multiChoiceModel,
      FillInTheBlanks: this.fillInTheBlanksModel,
      CardMatch: this.cardMatchModel,
      CategorizeIt: this.categorizeItModel,
      PhotoMatch: this.photoMatchModel,
      TranslationMatch: this.translationMatchModel,
      ListMatch: this.listMatchModel,
      WordDiscovery: this.wordDiscoveryModel,
      MazeGame: this.mazeGameModel,
      CrosswordPuzzle: this.crosswordPuzzleModel,
      QAShortAnswer: this.qaShortAnswerModel,
      ReflectRespond: this.reflectRespondModel,
      MultiAnswerShortQA: this.multiAnswerShortQAModel,
      HandsOnActivity: this.handsOnActivityModel,
      FreeDrawing: this.freeDrawingModel,
      DynamicOrderBlanks: this.dynamicOrderBlanksModel,
      CompleteTheShape: this.completeTheShapeModel,
      LocateIt: this.locateItModel,
      FillTheKabah: this.fillTheKabahModel,
      FillTheColor: this.fillTheColorModel,
    };

    // Fetch all activities in this episode
    const projectionFields = {
      _id: 1,
      title: 1,
      description: 1,
      episodeId: 1,
      typeId: 1,
      slug: 1,
      createdBy: 1,
      createdAt: 1,
    };

    // Fetch all activities in parallel with lean()
    const results = await Promise.allSettled(
      Object.entries(activityModels).map(async ([modelName, model]) => {
        const data = await model
          .find({ episodeId: episodeId })
          .select(projectionFields)
          .sort({ createdAt: -1 })
          .lean();
        return data.map((item) => ({ ...item, activityModel: modelName }));
      }),
    );

    // Merge all activities from all models
    const allActivities = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r: any) => r.value);

    if (allActivities.length === 0) {
      return {
        success: true,
        createdCount: 0,
        message: 'No activities found for this episode',
      };
    }

    // Get all existing progress records for this user and episode
    const existingProgress = await this.model.find(queryForFetch);

    // Create a set of existing activity IDs for quick lookup
    const existingActivityIds = new Set(
      existingProgress.map((p) => p.activityId.toString()),
    );

    // Filter activities to only include those without existing progress
    const activitiesToCreate = allActivities.filter(
      (activity) => !existingActivityIds.has(activity._id.toString()),
    );

    if (activitiesToCreate.length === 0) {
      return {
        success: true,
        createdCount: 0,
        message:
          'All activities in this episode already have progress records for this user',
      };
    }

    // Create progress record for each activity with correct model name
    const progressRecords = activitiesToCreate.map((activity) => ({
      userId: userObjectId,
      episodeId: episodeObjectId,
      activityId: activity._id,
      activityModel: activity.activityModel,
      status: 'pending',
      score: 0,
      progress: 0,
      timer: 0,
      correctAttempts: 0,
      wrongAttempts: 0,
      questionsCount: 0,
      activityData: {},
    }));

    // Normalize IDs in all progress records for consistency
    const normalizedRecords = progressRecords.map((record) =>
      this.normalizeIds(record),
    );

    // Insert all records
    const created = await this.model.insertMany(normalizedRecords);

    return {
      success: true,
      createdCount: created.length,
      message: `${created.length} user activity progress records created successfully`,
    };
  }

  /**
   * Get related activities in the same episode that user has started
   */
  async getRelatedActivitiesForUser(
    userId: string,
    activityId: string,
    limit: number = 10,
  ): Promise<any> {
    const userProgress = await this.model.findOne({ activityId });
    if (!userProgress) {
      throw new Error('User activity progress not found');
    }

    // Build query to match both string and ObjectId formats for userId
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    // Get all user's activities in the same episode
    const relatedProgress = await this.model
      .find({
        $and: [
          { $or: userIdQueries },
          { episodeId: userProgress.episodeId },
          { activityId: { $ne: activityId } },
        ],
      })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .select('-__v');

    const activityModels = {
      MultiChoiceQuestion: this.multiChoiceModel,
      FillInTheBlanks: this.fillInTheBlanksModel,
      CardMatch: this.cardMatchModel,
      CategorizeIt: this.categorizeItModel,
      PhotoMatch: this.photoMatchModel,
      TranslationMatch: this.translationMatchModel,
      ListMatch: this.listMatchModel,
      WordDiscovery: this.wordDiscoveryModel,
      MazeGame: this.mazeGameModel,
      CrosswordPuzzle: this.crosswordPuzzleModel,
      QAShortAnswer: this.qaShortAnswerModel,
      ReflectRespond: this.reflectRespondModel,
      MultiAnswerShortQA: this.multiAnswerShortQAModel,
      HandsOnActivity: this.handsOnActivityModel,
      FreeDrawing: this.freeDrawingModel,
      DynamicOrderBlanks: this.dynamicOrderBlanksModel,
      CompleteTheShape: this.completeTheShapeModel,
      LocateIt: this.locateItModel,
      FillTheKabah: this.fillTheKabahModel,
      FillTheColor: this.fillTheColorModel,
    };

    const enrichedData = await Promise.all(
      relatedProgress.map(async (progressRecord) => {
        const modelName = progressRecord.activityModel;
        const model = activityModels[modelName];

        let activityObject = null;
        if (model) {
          activityObject = await model
            .findById(progressRecord.activityId)
            .lean()
            .select('-__v');

          if (activityObject && activityObject.typeId) {
            const typeObject = await this.activityTypeModel
              .findById(activityObject.typeId)
              .lean()
              .select('-__v');
            activityObject.type = typeObject;
            delete activityObject.typeId;
          }
        }

        return {
          ...progressRecord,
          activity: activityObject,
        };
      }),
    );

    return {
      currentProgress: userProgress,
      related: enrichedData,
      count: enrichedData.length,
    };
  }

  /**
   * Get similar activities by type that user hasn't started yet
   */
  async getSimilarActivitiesForUser(
    userId: string,
    activityId: string,
    limit: number = 10,
  ): Promise<any> {
    const userProgress = await this.model.findOne({ activityId });
    if (!userProgress) {
      throw new Error('User activity progress not found');
    }

    const activityModels = {
      MultiChoiceQuestion: this.multiChoiceModel,
      FillInTheBlanks: this.fillInTheBlanksModel,
      CardMatch: this.cardMatchModel,
      CategorizeIt: this.categorizeItModel,
      PhotoMatch: this.photoMatchModel,
      TranslationMatch: this.translationMatchModel,
      ListMatch: this.listMatchModel,
      WordDiscovery: this.wordDiscoveryModel,
      MazeGame: this.mazeGameModel,
      CrosswordPuzzle: this.crosswordPuzzleModel,
      QAShortAnswer: this.qaShortAnswerModel,
      ReflectRespond: this.reflectRespondModel,
      MultiAnswerShortQA: this.multiAnswerShortQAModel,
      HandsOnActivity: this.handsOnActivityModel,
      FreeDrawing: this.freeDrawingModel,
      DynamicOrderBlanks: this.dynamicOrderBlanksModel,
      CompleteTheShape: this.completeTheShapeModel,
      LocateIt: this.locateItModel,
      FillTheKabah: this.fillTheKabahModel,
      FillTheColor: this.fillTheColorModel,
    };

    // Get the current activity to find the model name
    const currentModel = activityModels[userProgress.activityModel];
    const currentActivity = await currentModel
      .findById(activityId)
      .lean()
      .select('typeId');

    if (!currentActivity) {
      throw new Error('Current activity not found');
    }

    // Get user's already started activity IDs
    const userIdQueries: any[] = [{ userId: userId }];
    if (Types.ObjectId.isValid(userId)) {
      userIdQueries.push({ userId: new Types.ObjectId(userId) } as any);
    }

    const userActivities = await this.model
      .find({ $or: userIdQueries })
      .select('activityId')
      .lean();
    const startedActivityIds = new Set(userActivities.map((p) => p.activityId.toString()));

    // Find similar activities by type that user hasn't started
    const similarities = await Promise.all(
      Object.entries(activityModels).map(async ([modelName, model]) => {
        const activities = await model
          .find({
            typeId: currentActivity.typeId,
            _id: { $ne: activityId, $nin: Array.from(startedActivityIds) },
            isActive: true,
          })
          .lean()
          .limit(limit)
          .select('-__v');

        return activities.map((activity) => ({
          ...activity,
          activityModel: modelName,
        }));
      }),
    );

    const similarActivities = similarities
      .flat()
      .sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime())
      .slice(0, limit);

    return {
      currentProgress: userProgress,
      similar: similarActivities,
      count: similarActivities.length,
    };
  }
}
