import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile } from './schemas/profile.schema';
import { User } from '../auth/schemas/user.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  /**
   * 🔐 Validate PIN format (if provided)
   */
  private validatePin(pin?: string): void {
    if (!pin) {
      return; // PIN is optional, so skip if not provided
    }

    // Check if PIN contains only numeric characters
    if (!/^\d+$/.test(pin)) {
      throw new HttpException(
        'PIN must contain only numeric characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check PIN length (must be exactly 4 digits)
    if (pin.length !== 4) {
      throw new HttpException(
        'PIN must be exactly 4 digits',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * ➕ Create a new profile for user
   */
  async createProfile(userId: string, createProfileDto: CreateProfileDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Ensure maxProfiles is set to at least 5 (handle legacy users)
      if (!user.maxProfiles || user.maxProfiles < 5) {
        user.maxProfiles = 5;
        await user.save();
      }

      // Validate PIN if provided
      this.validatePin(createProfileDto.pin);

      // Check max profiles limit by querying actual profiles in database
      const profileCount = await this.profileModel.countDocuments({
        userId: new Types.ObjectId(userId),
      });

      if (profileCount >= user.maxProfiles) {
        throw new HttpException(
          `Maximum ${user.maxProfiles} profiles allowed`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check duplicate profile name for this user
      const existingProfile = await this.profileModel.findOne({
        userId: new Types.ObjectId(userId),
        profileName: createProfileDto.profileName,
      });

      if (existingProfile) {
        throw new HttpException(
          'Profile with this name already exists',
          HttpStatus.CONFLICT,
        );
      }

      const newProfile = new this.profileModel({
        userId: new Types.ObjectId(userId),
        ...createProfileDto,
        isActive: true,
        lastUsedAt: new Date(),
      });

      await newProfile.save();

      // Add profile to user's profiles array
      user.profiles.push(newProfile._id);
      if (!user.currentActiveProfile) {
        user.currentActiveProfile = newProfile._id;
      }
      await user.save();

      return {
        success: true,
        message: 'Profile created successfully',
        data: {
          _id: newProfile._id,
          profileName: newProfile.profileName,
          profilePicture: newProfile.profilePicture,
          isKidsProfile: newProfile.isKidsProfile,
          profileType: newProfile.profileType,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 📋 Get all profiles for user
   */
  async getUserProfiles(userId: string) {
    try {
      const profiles = await this.profileModel
        .find({ userId: new Types.ObjectId(userId) })
        .select('-viewingHistory -favorites -watchlist')
        .sort({ lastUsedAt: -1 });

      return {
        success: true,
        message: 'Profiles fetched successfully',
        data: profiles,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 🔄 Switch active profile
   */
  async switchProfile(userId: string, profileId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      // Update active profile and last used timestamp
      user.currentActiveProfile = new Types.ObjectId(profileId);
      profile.lastUsedAt = new Date();
      profile.isActive = true;

      await user.save();
      await profile.save();

      return {
        success: true,
        message: 'Profile switched successfully',
        data: {
          _id: profile._id,
          profileName: profile.profileName,
          profilePicture: profile.profilePicture,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * ✏️ Update profile details
   */
  async updateProfile(
    userId: string,
    profileId: string,
    updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      // Validate PIN if provided in update
      this.validatePin(updateProfileDto.pin);

      Object.assign(profile, updateProfileDto);
      await profile.save();

      return {
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 🗑️ Delete profile
   */
  async deleteProfile(userId: string, profileId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const profile = await this.profileModel.findOneAndDelete({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      // Remove from user's profiles array
      user.profiles = user.profiles.filter(
        (id) => id.toString() !== profileId,
      );

      // Reset active profile if deleted
      if (user.currentActiveProfile?.toString() === profileId) {
        user.currentActiveProfile = user.profiles[0] || null;
      }

      await user.save();

      return {
        success: true,
        message: 'Profile deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * ℹ️ Get specific profile details
   */
  async getProfileDetails(userId: string, profileId: string) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Profile details retrieved',
        data: profile,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 📺 Add to watchlist
   */
  async addToWatchlist(
    userId: string,
    profileId: string,
    contentId: string,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      if (!profile.watchlist.includes(contentId)) {
        profile.watchlist.push(contentId);
        await profile.save();
      }

      return {
        success: true,
        message: 'Added to watchlist',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * ❤️ Add to favorites
   */
  async addToFavorites(
    userId: string,
    profileId: string,
    contentId: string,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      if (!profile.favorites.includes(contentId)) {
        profile.favorites.push(contentId);
        await profile.save();
      }

      return {
        success: true,
        message: 'Added to favorites',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 📝 Remove from favorites
   */
  async removeFromFavorites(
    userId: string,
    profileId: string,
    contentId: string,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      profile.favorites = profile.favorites.filter((id) => id !== contentId);
      await profile.save();

      return {
        success: true,
        message: 'Removed from favorites',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 📺 Remove from watchlist
   */
  async removeFromWatchlist(
    userId: string,
    profileId: string,
    contentId: string,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      profile.watchlist = profile.watchlist.filter((id) => id !== contentId);
      await profile.save();

      return {
        success: true,
        message: 'Removed from watchlist',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 👀 Add to viewing history
   */
  async addToViewingHistory(
    userId: string,
    profileId: string,
    contentId: string,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      // Add to history if not already there, or move to front if already exists
      profile.viewingHistory = profile.viewingHistory.filter(
        (id) => id !== contentId,
      );
      profile.viewingHistory.unshift(contentId);

      // Keep only last 100 items in history
      if (profile.viewingHistory.length > 100) {
        profile.viewingHistory = profile.viewingHistory.slice(0, 100);
      }

      profile.lastWatchedContent = contentId;
      await profile.save();

      return {
        success: true,
        message: 'Added to viewing history',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * ⏱️ Save continue watching progress
   */
  async saveContinueWatching(
    userId: string,
    profileId: string,
    contentId: string,
    episodeId: string,
    timeStamp: number,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      profile.continueWatching = {
        contentId,
        episodeId,
        timeStamp,
      };

      await profile.save();

      return {
        success: true,
        message: 'Progress saved',
        data: profile.continueWatching,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 📊 Get profile stats
   */
  async getProfileStats(userId: string, profileId: string) {
    try {
      const profile = await this.profileModel.findOne({
        _id: new Types.ObjectId(profileId),
        userId: new Types.ObjectId(userId),
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Profile stats retrieved',
        data: {
          profileName: profile.profileName,
          favoritesCount: profile.favorites.length,
          watchlistCount: profile.watchlist.length,
          viewingHistoryCount: profile.viewingHistory.length,
          lastUsedAt: profile.lastUsedAt,
          continueWatching: profile.continueWatching,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
