import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreatePrintableDto } from './dto/create-printable.dto';
import { UpdatePrintableDto } from './dto/update-printable.dto';
import { FilterPrintablesDto } from './dto/filter-printables.dto';
import { Printable, PrintableDocument } from './schemas/printable.schema';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PrintablesService {
  constructor(
    @InjectModel(Printable.name) private printableModel: Model<PrintableDocument>,
    private settingsService: SettingsService,
  ) {}

  async create(createPrintableDto: CreatePrintableDto, userId?: string) {
    // Validate dynamic fields if provided
    if (createPrintableDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'printable',
        createPrintableDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    if (!createPrintableDto.episodeId && !createPrintableDto.seasonId) {
      throw new BadRequestException('Either episodeId or seasonId is required');
    }

    const slug = createPrintableDto.slug || slugify(createPrintableDto.title, { lower: true });
    const printableData = {
      ...createPrintableDto,
      slug,
      ...(createPrintableDto.episodeId ? { episodeId: new Types.ObjectId(createPrintableDto.episodeId) } : {}),
      ...(createPrintableDto.seasonId ? { seasonId: new Types.ObjectId(createPrintableDto.seasonId) } : {}),
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
      dynamicFields: createPrintableDto.dynamicFields || {},
    };
    const createdPrintable = new this.printableModel(printableData);
    return createdPrintable.save();
  }

  async findAll(filterPrintablesDto?: FilterPrintablesDto) {
    const query: any = {};
    const page = filterPrintablesDto?.page || 1;
    const limit = filterPrintablesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterPrintablesDto?.sortBy || 'order';
    const sortOrder = filterPrintablesDto?.sortOrder === 'asc' ? 1 : -1;

    if (filterPrintablesDto) {
      // Search by title
      if (filterPrintablesDto.title && filterPrintablesDto.title.trim()) {
        query.title = { $regex: filterPrintablesDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want printables where the age range overlaps with the filter
      if (filterPrintablesDto.minAge !== undefined) {
        // Printable's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterPrintablesDto.minAge };
      }
      if (filterPrintablesDto.maxAge !== undefined) {
        // Printable's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterPrintablesDto.maxAge };
      }

      // Filter by series
      if (filterPrintablesDto.series) {
        query.series = filterPrintablesDto.series;
      }

      // Filter by series list (any matching)
      if (filterPrintablesDto.series_list && filterPrintablesDto.series_list.length > 0) {
        query.series = { $in: filterPrintablesDto.series_list };
      }

      // Filter by format
      if (filterPrintablesDto.format) {
        query.format = filterPrintablesDto.format;
      }

      // Filter by values (any matching values)
      if (filterPrintablesDto.values && filterPrintablesDto.values.length > 0) {
        query.values = { $in: filterPrintablesDto.values };
      }

      // Filter by isPremium
      if (filterPrintablesDto.isPremium !== undefined) {
        query.isPremium = filterPrintablesDto.isPremium;
      }

      // Filter by isActive
      if (filterPrintablesDto.isActive !== undefined) {
        query.isActive = filterPrintablesDto.isActive;
      }
    }

    const [data, total] = await Promise.all([
      this.printableModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.printableModel.countDocuments(query).exec(),
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

  async findByEpisodeId(episodeId: string, filterPrintablesDto?: FilterPrintablesDto) {
    if (!Types.ObjectId.isValid(episodeId)) {
      throw new BadRequestException('Invalid episode ID');
    }

    const page = filterPrintablesDto?.page || 1;
    const limit = filterPrintablesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterPrintablesDto?.sortBy || 'order';
    const sortOrder = filterPrintablesDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = { episodeId: new Types.ObjectId(episodeId) };

    if (filterPrintablesDto) {
      // Search by title
      if (filterPrintablesDto.title && filterPrintablesDto.title.trim()) {
        query.title = { $regex: filterPrintablesDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want printables where the age range overlaps with the filter
      if (filterPrintablesDto.minAge !== undefined) {
        // Printable's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterPrintablesDto.minAge };
      }
      if (filterPrintablesDto.maxAge !== undefined) {
        // Printable's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterPrintablesDto.maxAge };
      }

      // Filter by series
      if (filterPrintablesDto.series) {
        query.series = filterPrintablesDto.series;
      }

      // Filter by series list (any matching)
      if (filterPrintablesDto.series_list && filterPrintablesDto.series_list.length > 0) {
        query.series = { $in: filterPrintablesDto.series_list };
      }

      // Filter by format
      if (filterPrintablesDto.format) {
        query.format = filterPrintablesDto.format;
      }

      // Filter by values (any matching values)
      if (filterPrintablesDto.values && filterPrintablesDto.values.length > 0) {
        query.values = { $in: filterPrintablesDto.values };
      }

      // Filter by isPremium
      if (filterPrintablesDto.isPremium !== undefined) {
        query.isPremium = filterPrintablesDto.isPremium;
      }

      // Filter by isActive
      if (filterPrintablesDto.isActive !== undefined) {
        query.isActive = filterPrintablesDto.isActive;
      }
    }

    const [data, total] = await Promise.all([
      this.printableModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.printableModel.countDocuments(query).exec(),
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



  async findBySeasonId(seasonId: string, filterPrintablesDto?: FilterPrintablesDto) {
    if (!Types.ObjectId.isValid(seasonId)) throw new BadRequestException('Invalid season ID');
    const page = filterPrintablesDto?.page || 1;
    const limit = filterPrintablesDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterPrintablesDto?.sortBy || 'order';
    const sortOrder = filterPrintablesDto?.sortOrder === 'asc' ? 1 : -1;
    const query: any = { seasonId: new Types.ObjectId(seasonId) };
    if (filterPrintablesDto?.title && filterPrintablesDto.title.trim()) query.title = { $regex: filterPrintablesDto.title.trim(), $options: 'i' };
    if (filterPrintablesDto?.minAge !== undefined) query['age.1'] = { $gte: filterPrintablesDto.minAge };
    if (filterPrintablesDto?.maxAge !== undefined) query['age.0'] = { $lte: filterPrintablesDto.maxAge };
    if (filterPrintablesDto?.series) query.series = filterPrintablesDto.series;
    if (filterPrintablesDto?.series_list?.length) query.series = { $in: filterPrintablesDto.series_list };
    if (filterPrintablesDto?.format) query.format = filterPrintablesDto.format;
    if (filterPrintablesDto?.values?.length) query.values = { $in: filterPrintablesDto.values };
    if (filterPrintablesDto?.isPremium !== undefined) query.isPremium = filterPrintablesDto.isPremium;
    if (filterPrintablesDto?.isActive !== undefined) query.isActive = filterPrintablesDto.isActive;
    const [data, total] = await Promise.all([
      this.printableModel.find(query).populate('episodeId').populate('seasonId').populate('createdBy', '-password -refreshToken -__v').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).exec(),
      this.printableModel.countDocuments(query).exec(),
    ]);
    return { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const printable = await this.printableModel
      .findById(id)
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!printable) {
      throw new BadRequestException('Printable not found');
    }
    return printable;
  }

  async findBySlug(slug: string) {
    const printable = await this.printableModel
      .findOne({ slug })
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!printable) {
      throw new BadRequestException('Printable not found');
    }
    return printable;
  }

  async update(id: string, updatePrintableDto: UpdatePrintableDto) {
    // Validate dynamic fields if provided
    if (updatePrintableDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'printable',
        updatePrintableDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    const updateData = {
      ...updatePrintableDto,
    };
    if (updateData.episodeId) {
      updateData.episodeId = new Types.ObjectId(updateData.episodeId);
    }
    const updatedPrintable = await this.printableModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!updatedPrintable) {
      throw new BadRequestException('Printable not found');
    }
    return updatedPrintable;
  }

  async remove(id: string) {
    const deletedPrintable = await this.printableModel
      .findByIdAndDelete(id)
      .populate('episodeId')
      .populate('seasonId')
      .populate('createdBy', '-password')
      .exec();
    if (!deletedPrintable) {
      throw new BadRequestException('Printable not found');
    }
    return deletedPrintable;
  }
}
