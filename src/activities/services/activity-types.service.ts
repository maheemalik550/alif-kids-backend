import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { File } from 'multer';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Episode } from '../../episodes/schemas/episode.schema';
import { ActivityType, ActivityTypeDocument } from '../schemas';
import { CreateActivityTypeDto, UpdateActivityTypeDto, FilterActivityDto } from '../dto';
import { uploadOnCloudinary } from '../../common/helpers/cloudinary';

@Injectable()
export class ActivityTypesService {
  constructor(
    @InjectModel(ActivityType.name) private model: Model<ActivityTypeDocument>,
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
    @InjectModel(Episode.name)
    private episodeModel: Model<any>,
  ) {}

  // ============ ACTIVITY TYPES CRUD ============

  async create(
    dto: CreateActivityTypeDto,
    userId?: string,
  ): Promise<ActivityTypeDocument> {
    const payload = {
      ...dto,
      ...(userId && { createdBy: new Types.ObjectId(userId) }),
    };
    return this.model.create(payload);
  }

  async findAll(): Promise<ActivityTypeDocument[]> {
    return this.model.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ActivityTypeDocument> {
    return this.model.findById(id);
  }

  async update(
    id: string,
    dto: UpdateActivityTypeDto,
  ): Promise<ActivityTypeDocument> {
    return this.model.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async uploadActivityImage(file: File, userId: string): Promise<any> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const result = await uploadOnCloudinary(file.path);

      if (!result) {
        throw new BadRequestException('File upload to Cloudinary failed');
      }

      return {
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
          uploadedBy: userId,
          uploadedAt: new Date(),
        },
      };
    } catch (error) {
      console.error('Activity image upload error:', error);
      throw error;
    }
  }

  // ============ ACTIVITIES BY EPISODE - GET OPERATIONS ============

  /**
   * Get all activities for a specific episode with pagination and search
   */
  async getAllActivitiesByEpisode(
    episodeId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: any[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }> {
    if (!episodeId) {
      throw new BadRequestException('Episode ID is required');
    }

    const skip = (page - 1) * limit;

    // Build query with both episodeId formats
    let query: any = this.buildEpisodeIdQuery(episodeId);

    // Add search filter if provided
    if (search) {
      query = {
        $and: [
          query, // episodeId match (already has $or)
          {
            $or: [
              { title: { $regex: search.trim(), $options: 'i' } },
              { description: { $regex: search.trim(), $options: 'i' } },
            ],
          },
        ],
      };
    }

    const models = this.getActivityModels();
    const results = await Promise.allSettled(
      Object.entries(models).map(async ([, model]) =>
        model.find(query).populate('typeId').lean(),
      ),
    );

    const allActivities = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r: any) => r.value);

    // Sort by order and createdAt
    allActivities.sort(
      (a, b) =>
        (a.order ?? Infinity) - (b.order ?? Infinity) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = allActivities.length;
    const paginatedData = allActivities.slice(skip, skip + limit);

    return {
      data: paginatedData,
      total,
      pages: Math.ceil(total / limit) || 0,
      page,
      limit,
    };
  }


  async getAllActivitiesBySeason(
    seasonId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    if (!seasonId) {
      throw new BadRequestException('Season ID is required');
    }

    const episodes = await this.episodeModel.find({ seasonId }).select('_id').lean();
    const episodeIds = episodes.map((e: any) => String(e._id));
    if (!episodeIds.length) {
      return { data: [], total: 0, pages: 0, page, limit };
    }

    const results = await Promise.all(
      episodeIds.map((episodeId) => this.getAllActivitiesByEpisode(episodeId, 1, 1000, search)),
    );
    const allActivities = results.flatMap((result: any) => result.data || []);
    allActivities.sort(
      (a: any, b: any) =>
        (a.order ?? Infinity) - (b.order ?? Infinity) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = allActivities.length;
    const skip = (page - 1) * limit;
    return {
      data: allActivities.slice(skip, skip + limit),
      total,
      pages: Math.ceil(total / limit) || 0,
      page,
      limit,
    };
  }

  /**
   * Get a single activity by ID and episode ID
   */
  async getActivityByIdAndEpisode(
    activityId: string,
    episodeId: string,
    activityType?: string,
  ): Promise<any> {
    if (!activityId || !episodeId) {
      throw new BadRequestException('Activity ID and Episode ID are required');
    }

    const objectActivityId = Types.ObjectId.isValid(activityId)
      ? new Types.ObjectId(activityId)
      : activityId;

    // Build episode query to match both string and ObjectId formats
    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();

    // If specific activity type is provided, search in that model only
    if (activityType && models[activityType]) {
      const activity = await models[activityType]
        .findOne({
          _id: objectActivityId,
          ...episodeQuery,
        })
        .populate('episodeId typeId createdBy');

      if (!activity) {
        throw new NotFoundException(
          `Activity not found in episode ${episodeId}`,
        );
      }

      return activity;
    }

    // Otherwise, search across all models
    for (const [, model] of Object.entries(models)) {
      const activity = await model
        .findOne({
          _id: objectActivityId,
          ...episodeQuery,
        })
        .populate('episodeId typeId createdBy');

      if (activity) {
        return activity;
      }
    }

    throw new NotFoundException(`Activity not found in episode ${episodeId}`);
  }

  /**
   * Get multiple activities by their IDs for a specific episode
   */
  async getActivitiesByIdsAndEpisode(
    activityIds: string[],
    episodeId: string,
  ): Promise<any[]> {
    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      throw new BadRequestException('Activity IDs array is required');
    }

    if (!episodeId) {
      throw new BadRequestException('Episode ID is required');
    }

    const objectIds = activityIds.map((id) =>
      Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id,
    );

    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();
    const results = await Promise.allSettled(
      Object.entries(models).map(async ([, model]) =>
        model
          .find({
            _id: { $in: objectIds },
            ...episodeQuery,
          })
          .lean(),
      ),
    );

    const allActivities = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r: any) => r.value);

    return allActivities;
  }

  // ============ ACTIVITIES BY EPISODE - UPDATE OPERATIONS ============

  /**
   * Update a single activity by ID and episode ID
   */
  async updateActivityByEpisode(
    activityId: string,
    episodeId: string,
    updateData: any,
    activityType?: string,
  ): Promise<any> {
    if (!activityId || !episodeId) {
      throw new BadRequestException('Activity ID and Episode ID are required');
    }

    const objectActivityId = Types.ObjectId.isValid(activityId)
      ? new Types.ObjectId(activityId)
      : activityId;
    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();

    if (activityType && models[activityType]) {
      const updated = await models[activityType].findOneAndUpdate(
        { _id: objectActivityId, ...episodeQuery },
        updateData,
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException(
          `Activity not found in episode ${episodeId}`,
        );
      }

      return {
        success: true,
        message: 'Activity updated successfully',
        data: updated,
      };
    }

    // Search across all models
    for (const [, model] of Object.entries(models)) {
      const updated = await model.findOneAndUpdate(
        { _id: objectActivityId, ...episodeQuery },
        updateData,
        { new: true },
      );

      if (updated) {
        return {
          success: true,
          message: 'Activity updated successfully',
          data: updated,
        };
      }
    }

    throw new NotFoundException(`Activity not found in episode ${episodeId}`);
  }

  /**
   * Bulk update multiple activities for an episode
   */
  async bulkUpdateActivitiesByEpisode(
    episodeId: string,
    updates: Array<{ id: string; data: any; type?: string }>,
  ): Promise<any> {
    if (!episodeId) {
      throw new BadRequestException('Episode ID is required');
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new BadRequestException(
        'Updates array is required and cannot be empty',
      );
    }

    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();
    const results = [];
    const errors = [];

    for (const update of updates) {
      if (!update.id) {
        errors.push('Activity ID is required in updates');
        continue;
      }

      const objectActivityId = Types.ObjectId.isValid(update.id)
        ? new Types.ObjectId(update.id)
        : update.id;

      if (update.type && models[update.type]) {
        const updated = await models[update.type].findOneAndUpdate(
          { _id: objectActivityId, ...episodeQuery },
          update.data,
          { new: true },
        );

        if (updated) {
          results.push(updated);
          continue;
        }
      }

      // Search across models if type not specified
      let found = false;
      for (const [, model] of Object.entries(models)) {
        const updated = await model.findOneAndUpdate(
          { _id: objectActivityId, ...episodeQuery },
          update.data,
          { new: true },
        );

        if (updated) {
          results.push(updated);
          found = true;
          break;
        }
      }

      if (!found) {
        errors.push(`Activity ${update.id} not found in episode`);
      }
    }

    if (results.length === 0) {
      throw new NotFoundException('No activities were updated in the episode');
    }

    return {
      success: true,
      message: `${results.length} out of ${updates.length} activities updated successfully`,
      updated: results.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      data: results,
    };
  }

  /**
   * Diagnostic method to find activities by IDs (ignoring episode)
   */
  async findActivitiesByIds(
    activityIds: string[],
  ): Promise<any> {
    const models = this.getActivityModels();
    const results = [];

    for (const activityId of activityIds) {
      const objectActivityId = Types.ObjectId.isValid(activityId)
        ? new Types.ObjectId(activityId)
        : activityId;

      for (const [modelName, model] of Object.entries(models)) {
        const activity = await model.findById(objectActivityId);
        if (activity) {
          results.push({
            _id: activity._id,
            foundIn: modelName,
            linkedEpisode: activity.episodeId,
            title: activity.title,
            order: activity.order,
          });
          break;
        }
      }

      if (!results.find(r => r._id.toString() === activityId.toString())) {
        results.push({
          _id: activityId,
          foundIn: null,
          linkedEpisode: null,
          title: 'NOT FOUND',
        });
      }
    }

    return results;
  }

  /**
   * Update activities order for an episode
   */
  async updateActivitiesOrder(
    episodeId: string,
    updates: Array<{ _id: string; order: number }>,
  ): Promise<any> {
    if (!episodeId) {
      throw new BadRequestException('Episode ID is required');
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new BadRequestException(
        'Updates array is required and cannot be empty',
      );
    }

    // Build episode query to match both string and ObjectId formats
    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();
    const results = [];
    const errors = [];
    for (const update of updates) {
      if (!update._id) {
        errors.push('Activity ID (_id) is required in updates');
        continue;
      }

      if (typeof update.order !== 'number') {
        errors.push(`Activity ${update._id} has invalid order value`);
        continue;
      }

      const objectActivityId = Types.ObjectId.isValid(update._id)
        ? new Types.ObjectId(update._id)
        : update._id;

      // Search across all models
      let found = false;
      for (const [modelName, model] of Object.entries(models)) {
        const query = { 
          _id: objectActivityId,
          ...episodeQuery,
        };
        const updated = await model.findOneAndUpdate(
          query,
          { order: update.order },
          { new: true },
        );

        if (updated) {
          results.push(updated);
          found = true;
          break;
        } else {
          console.log(`✗ Not found in ${modelName}`);
        }
      }

      if (!found) {
        errors.push(`Activity ${update._id} not found in episode ${episodeId}`);
      }
    }

    if (results.length === 0) {
      // Try to fetch activities for this episode to show what exists
      const episodeQueryForDebug = this.buildEpisodeIdQuery(episodeId);
      let debugActivities: any[] = [];
      
      for (const [, model] of Object.entries(models)) {
        const activities = await model.find(episodeQueryForDebug).lean().limit(5);
        debugActivities = debugActivities.concat(activities);
      }

      throw new NotFoundException({
        status: 404,
        message: `No activities found to update in episode ${episodeId}. Please verify the episode ID and activity IDs.`,
        debug: {
          episodeId,
          requestedActivityCount: updates.length,
          existingActivitiesFound: debugActivities.length,
          sampleExistingActivities: debugActivities.slice(0, 3).map(a => ({ _id: a._id, episodeId: a.episodeId })),
        },
      });
    }

    return {
      success: true,
      message: `${results.length} out of ${updates.length} activities order updated successfully`,
      updated: results.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      data: results,
    };
  }

  // ============ ACTIVITIES BY EPISODE - DELETE OPERATIONS ============

  /**
   * Delete a single activity by ID and episode ID
   */
  async deleteActivityByEpisode(
    activityId: string,
    episodeId: string,
    activityType?: string,
  ): Promise<any> {
    if (!activityId || !episodeId) {
      throw new BadRequestException('Activity ID and Episode ID are required');
    }

    const objectActivityId = Types.ObjectId.isValid(activityId)
      ? new Types.ObjectId(activityId)
      : activityId;
    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();

    if (activityType && models[activityType]) {
      const deleted = await models[activityType].findOneAndDelete({
        _id: objectActivityId,
        ...episodeQuery,
      });

      if (!deleted) {
        throw new NotFoundException(
          `Activity not found in episode ${episodeId}`,
        );
      }

      return {
        success: true,
        message: 'Activity deleted successfully',
        data: deleted,
      };
    }

    // Search across all models
    for (const [, model] of Object.entries(models)) {
      const deleted = await model.findOneAndDelete({
        _id: objectActivityId,
        ...episodeQuery,
      });

      if (deleted) {
        return {
          success: true,
          message: 'Activity deleted successfully',
          data: deleted,
        };
      }
    }

    throw new NotFoundException(`Activity not found in episode ${episodeId}`);
  }

  /**
   * Bulk delete multiple activities for an episode
   */
  async bulkDeleteActivitiesByEpisode(
    episodeId: string,
    activityIds: string[],
  ): Promise<any> {
    if (!episodeId) {
      throw new BadRequestException('Episode ID is required');
    }

    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      throw new BadRequestException(
        'Activity IDs array is required and cannot be empty',
      );
    }

    const objectIds = activityIds.map((id) =>
      Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id,
    );

    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();
    let totalDeleted = 0;

    for (const [, model] of Object.entries(models)) {
      const result = await model.deleteMany({
        _id: { $in: objectIds },
        ...episodeQuery,
      });

      totalDeleted += result.deletedCount;
    }

    if (totalDeleted === 0) {
      throw new NotFoundException(
        'No activities found to delete in the episode',
      );
    }

    return {
      success: true,
      message: `${totalDeleted} activities deleted successfully`,
      deleted: totalDeleted,
    };
  }

  /**
   * Delete all activities for an episode
   */
  async deleteAllActivitiesByEpisode(episodeId: string): Promise<any> {
    if (!episodeId) {
      throw new BadRequestException('Episode ID is required');
    }

    const episodeQuery = this.buildEpisodeIdQuery(episodeId);
    const models = this.getActivityModels();
    let totalDeleted = 0;

    for (const [, model] of Object.entries(models)) {
      const result = await model.deleteMany(episodeQuery);

      totalDeleted += result.deletedCount;
    }

    if (totalDeleted === 0) {
      throw new NotFoundException(
        'No activities found to delete in the episode',
      );
    }

    return {
      success: true,
      message: `All ${totalDeleted} activities deleted successfully for episode ${episodeId}`,
      deleted: totalDeleted,
    };
  }

  /**
   * Get all available activities regardless of episode and userId
   * Returns all activities from all activity types with pagination and filtering
   * Filters can be applied to episode fields: minAge, maxAge, series, series_list, values, isActive, isPremium
   */
  async getAllAvailableActivities(
    filterActivityDto?: FilterActivityDto,
  ): Promise<{
    data: any[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }> {
    const page = filterActivityDto?.page || 1;
    const limit = filterActivityDto?.limit || 10;
    const skip = (page - 1) * limit;
    const search = filterActivityDto?.search;
    const activityType = filterActivityDto?.activityType;
    const sortBy = filterActivityDto?.sortBy || 'createdAt';
    const sortOrder = filterActivityDto?.sortOrder === 'asc' ? 1 : -1;

    const models = this.getActivityModels();

    // Build query with search filter only (episode filters applied after population)
    let query: any = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { name: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Fetch from specific activity model or all models
    let results: any[] = [];
    
    if (activityType && models[activityType]) {
      // Fetch from specific activity type
      const model = models[activityType];
      const activities = await model
        .find(query)
        .populate({
          path: 'episodeId',
          populate: {
            path: 'seriesId',
          },
        })
        .populate('typeId')
        .exec();
      
      results = activities
        .filter((activity) =>
          this.filterActivityByEpisode(activity, filterActivityDto),
        )
        .map((activity) => this.formatActivityResponse(activity, activityType));
    } else {
      // Fetch from all activity models
      const allResults = await Promise.allSettled(
        Object.entries(models).map(async ([type, model]) => {
          const activities = await model
            .find(query)
            .populate({
              path: 'episodeId',
              populate: {
                path: 'seriesId',
              },
            })
            .populate('typeId')
            .exec();

          return activities
            .filter((activity) =>
              this.filterActivityByEpisode(activity, filterActivityDto),
            )
            .map((activity) => this.formatActivityResponse(activity, type));
        }),
      );

      // Flatten results from all models
      results = allResults
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r: any) => r.value || []);
    }

    // Sort by specified field and order
    results.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle date comparison
      if (aValue instanceof Date || bValue instanceof Date) {
        return (
          (new Date(bValue).getTime() - new Date(aValue).getTime()) * sortOrder
        );
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * sortOrder;
      }

      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * sortOrder;
      }

      // Default fallback
      return 0;
    });

    const total = results.length;
    const paginatedData = results.slice(skip, skip + limit);

    return {
      data: paginatedData,
      total,
      pages: Math.ceil(total / limit) || 0,
      page,
      limit,
    };
  }

  /**
   * Filter activity by episode properties
   * Applies filters based on episode's age, values, series, and status
   */
  private filterActivityByEpisode(
    activity: any,
    filterActivityDto?: FilterActivityDto,
  ): boolean {
    if (!filterActivityDto) {
      return true;
    }

    // Check if any episode-level filters are being applied
    const hasEpisodeFilters = this.hasEpisodeFilters(filterActivityDto);

    // If episode filters are applied, require episodeId to exist
    if (hasEpisodeFilters && !activity.episodeId) {
      return false;
    }

    // If no episode filters, accept the activity
    if (!hasEpisodeFilters) {
      return true;
    }

    const episode = activity.episodeId;

    // Age range filter
    if (filterActivityDto.minAge !== undefined && episode.age) {
      // episode.age is [minAge, maxAge]
      if (episode.age[1] < filterActivityDto.minAge) {
        return false;
      }
    }

    if (filterActivityDto.maxAge !== undefined && episode.age) {
      // episode.age is [minAge, maxAge]
      if (episode.age[0] > filterActivityDto.maxAge) {
        return false;
      }
    }

    // Values filter (any matching values)
    if (filterActivityDto.values && filterActivityDto.values.length > 0) {
      if (!episode.values || !Array.isArray(episode.values)) {
        return false;
      }
      const hasMatch = filterActivityDto.values.some((value) =>
        episode.values.includes(value),
      );
      if (!hasMatch) {
        return false;
      }
    }

    // Series filter
    if (filterActivityDto.series) {
      if (!episode.seriesId) {
        return false;
      }
      const seriesId =
        typeof episode.seriesId === 'object'
          ? episode.seriesId._id || episode.seriesId.id
          : episode.seriesId;
      if (seriesId?.toString() !== filterActivityDto.series) {
        return false;
      }
    }

    // Series list filter (any matching)
    if (
      filterActivityDto.series_list &&
      filterActivityDto.series_list.length > 0
    ) {
      if (!episode.seriesId) {
        return false;
      }
      const seriesId =
        typeof episode.seriesId === 'object'
          ? episode.seriesId._id || episode.seriesId.id
          : episode.seriesId;
      const hasMatch = filterActivityDto.series_list.some(
        (series) => seriesId?.toString() === series,
      );
      if (!hasMatch) {
        return false;
      }
    }

    // isActive filter (maps to episode.status)
    if (filterActivityDto.isActive !== undefined) {
      const isActive = episode.status === 'active';
      if (isActive !== filterActivityDto.isActive) {
        return false;
      }
    }

    // isPremium filter (if episode has isPremium field, or could be based on series)
    if (filterActivityDto.isPremium !== undefined) {
      if (episode.isPremium !== filterActivityDto.isPremium) {
        // Also check if series has isPremium
        if (
          episode.seriesId &&
          typeof episode.seriesId === 'object'
        ) {
          if (
            episode.seriesId.isPremium !== filterActivityDto.isPremium
          ) {
            return false;
          }
        } else {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if any episode-level filters are being applied
   */
  private hasEpisodeFilters(filterActivityDto: FilterActivityDto): boolean {
    return (
      filterActivityDto.minAge !== undefined ||
      filterActivityDto.maxAge !== undefined ||
      (filterActivityDto.values && filterActivityDto.values.length > 0) ||
      !!filterActivityDto.series ||
      (filterActivityDto.series_list && filterActivityDto.series_list.length > 0) ||
      filterActivityDto.isActive !== undefined ||
      filterActivityDto.isPremium !== undefined
    );
  }

  /**
   * Format activity response to match expected API structure
   * Wraps activity data and includes model type information
   */
  private formatActivityResponse(activity: any, activityType: string): any {
    const activityObj = activity.toObject?.() || activity;
    
    return {
      _id: activityObj._id,
      activityId: activityObj._id,
      activityModel: activityType,
      episodeId: activityObj.episodeId?._id || activityObj.episodeId,
      status: 'pending',
      score: 0,
      progress: 0,
      timer: 0,
      wrongAttempts: 0,
      correctAttempts: 0,
      questionsCount: 0,
      activityProgressHistoryData: [],
      createdAt: activityObj.createdAt,
      updatedAt: activityObj.updatedAt,
      activity: {
        ...activityObj,
        activityType: undefined, // Remove the added field from nested activity
      },
      activityData: {},
    };
  }

  // ============ HELPER METHODS ============

  /**
   * Build episode ID query to match both string and ObjectId formats
   */
  private buildEpisodeIdQuery(episodeId: string): any {
    // Create a query that matches episodeId as either string or ObjectId
    // This handles cases where episodeId might be stored as either format in the database
    const queries: any[] = [{ episodeId: episodeId }]; // Match as string

    if (Types.ObjectId.isValid(episodeId)) {
      queries.push({ episodeId: new Types.ObjectId(episodeId) } as any); // Also match as ObjectId
    }

    return { $or: queries };
  }

  /**
   * Get all activity models as a map
   */
  private getActivityModels() {
    return {
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
}
