import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

export class BaseActivityService<T> {
  constructor(
    protected model: Model<T>,
    protected userActivityProgressModel?: Model<any>,
  ) {}

  async create(dto: any): Promise<T> {
    return this.model.create(dto);
  }

  async findAll(): Promise<T[]> {
    return this.model
      .find({ isActive: true })
      .populate('episodeId typeId createdBy');
  }

  async findByEpisodeId(episodeId: string): Promise<T[]> {
    return this.model
      .find({ episodeId, isActive: true })
      .sort({ order: 1 })
      .populate('typeId createdBy');
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(id).populate('episodeId typeId createdBy');
  }

  async update(id: string, dto: any): Promise<T> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('episodeId typeId createdBy');
  }

  async delete(id: string): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    await this.model.findByIdAndDelete(objectId);
    // Cascade delete user activity progress for this activity
    if (this.userActivityProgressModel) {
      await this.userActivityProgressModel.deleteMany({ activityId: objectId });
    }
  }

  async deleteByEpisodeId(episodeId: string): Promise<void> {
    const episodeObjectId = Types.ObjectId.isValid(episodeId) ? new Types.ObjectId(episodeId) : episodeId;
    
    // Get all activities in this episode to delete their progress records
    const activities = await this.model.find({ episodeId: episodeObjectId });

    // Delete all user progress for each activity using $in operator
    if (this.userActivityProgressModel && activities.length > 0) {
      const activityIds = activities.map((a) => a._id);
      await this.userActivityProgressModel.deleteMany({
        activityId: { $in: activityIds },
      });
    }

    // Delete the activities
    await this.model.deleteMany({ episodeId: episodeObjectId });
  }

  /**
   * Get all related activities from the same episode
   */
  async getRelatedActivities(activityId: string, limit: number = 10): Promise<any> {
    const activity = await this.model.findById(activityId).populate('episodeId typeId');
    if (!activity) {
      throw new Error('Activity not found');
    }

    const activityAny = activity as any;
    const relatedActivities = await this.model
      .find({
        episodeId: activityAny.episodeId,
        _id: { $ne: activityId },
        isActive: true,
      })
      .populate('typeId createdBy')
      .limit(limit)
      .sort({ order: 1 });

    return {
      currentActivity: activity,
      related: relatedActivities,
      count: relatedActivities.length,
    };
  }

  /**
   * Get similar activities based on type and values
   */
  async getSimilarActivities(activityId: string, limit: number = 10): Promise<any> {
    const activity = await this.model.findById(activityId).populate('typeId');
    if (!activity) {
      throw new Error('Activity not found');
    }

    const activityAny = activity as any;
    const query: any = {
      _id: { $ne: activityId },
      isActive: true,
      typeId: activityAny.typeId?._id,
    };

    const similarActivities = await this.model
      .find(query)
      .populate('episodeId typeId createdBy')
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      currentActivity: activity,
      similar: similarActivities,
      count: similarActivities.length,
    };
  }
}
