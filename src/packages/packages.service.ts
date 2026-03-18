import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from './schemas/package.schema';
import { CreatePackageDto, UpdatePackageDto } from './dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
  ) {}

  /**
   * Create a new package
   */
  async create(createPackageDto: CreatePackageDto): Promise<PackageDocument> {
    try {
      // Check if package with same id already exists
      const existingPackage = await this.packageModel.findOne({
        id: createPackageDto.id,
      });

      if (existingPackage) {
        throw new ConflictException(
          `Package with ID "${createPackageDto.id}" already exists`,
        );
      }

      const newPackage = new this.packageModel({
        ...createPackageDto,
        isActive: createPackageDto.isActive ?? true,
      });

      return await newPackage.save();
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Error creating package: ${error.message}`);
    }
  }

  /**
   * Get all packages
   */
  async findAll(filters?: {
    isActive?: boolean;
    limit?: number;
    skip?: number;
  }): Promise<{
    data: PackageDocument[];
    total: number;
    limit?: number;
    skip?: number;
  }> {
    try {
      const query: any = {};

      if (filters?.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      const limit = filters?.limit || 10;
      const skip = filters?.skip || 0;

      const [data, total] = await Promise.all([
        this.packageModel
          .find(query)
          .limit(limit)
          .skip(skip)
          .sort({ createdAt: -1 }),
        this.packageModel.countDocuments(query),
      ]);

      return {
        data,
        total,
        limit,
        skip,
      };
    } catch (error) {
      throw new BadRequestException(`Error fetching packages: ${error.message}`);
    }
  }

  /**
   * Get a single package by ID
   */
  async findById(id: string): Promise<PackageDocument> {
    try {
      const packageItem = await this.packageModel.findById(id);

      if (!packageItem) {
        throw new NotFoundException(`Package with ID ${id} not found`);
      }

      return packageItem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching package: ${error.message}`);
    }
  }

  /**
   * Get package by custom ID
   */
  async findByCustomId(customId: string): Promise<PackageDocument> {
    try {
      const packageItem = await this.packageModel.findOne({ id: customId });

      if (!packageItem) {
        throw new NotFoundException(`Package "${customId}" not found`);
      }

      return packageItem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching package: ${error.message}`);
    }
  }

  /**
   * Update a package
   */
  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageDocument> {
    try {
      // Check if custom ID is being changed and if new ID already exists
      if (updatePackageDto.id) {
        const existingPackage = await this.packageModel.findOne({
          id: updatePackageDto.id,
          _id: { $ne: id },
        });

        if (existingPackage) {
          throw new ConflictException(
            `Package with ID "${updatePackageDto.id}" already exists`,
          );
        }
      }

      const updatedPackage = await this.packageModel.findByIdAndUpdate(
        id,
        { ...updatePackageDto, updatedAt: new Date() },
        { new: true },
      );

      if (!updatedPackage) {
        throw new NotFoundException(`Package with ID ${id} not found`);
      }

      return updatedPackage;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(`Error updating package: ${error.message}`);
    }
  }

  /**
   * Delete a package
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const deletedPackage = await this.packageModel.findByIdAndDelete(id);

      if (!deletedPackage) {
        throw new NotFoundException(`Package with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Package deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting package: ${error.message}`);
    }
  }

  /**
   * Toggle package active status
   */
  async toggleActive(id: string): Promise<PackageDocument> {
    try {
      const packageItem = await this.packageModel.findById(id);

      if (!packageItem) {
        throw new NotFoundException(`Package with ID ${id} not found`);
      }

      packageItem.isActive = !packageItem.isActive;
      return await packageItem.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error toggling package status: ${error.message}`);
    }
  }
}
