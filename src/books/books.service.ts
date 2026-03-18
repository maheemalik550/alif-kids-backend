import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { Book, BookDocument } from './schemas/book.schema';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private settingsService: SettingsService,
  ) {}

  async create(createBookDto: CreateBookDto, userId?: string) {
    // Validate dynamic fields if provided
    if (createBookDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'book',
        createBookDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    if (!createBookDto.episodeId && !createBookDto.seasonId) {
      throw new BadRequestException('Either episodeId or seasonId is required');
    }

    const slug = createBookDto.slug || slugify(createBookDto.title, { lower: true });
    const bookData = {
      ...createBookDto,
      slug,
      ...(createBookDto.seasonId ? { seasonId: new Types.ObjectId(createBookDto.seasonId) } : {}),
      ...(createBookDto.episodeId ? { episodeId: new Types.ObjectId(createBookDto.episodeId) } : {}),
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
      dynamicFields: createBookDto.dynamicFields || {},
      ...(createBookDto.ageGroupId ? { ageGroupId: new Types.ObjectId(createBookDto.ageGroupId) } : {}),
      ...(createBookDto.categoryIds?.length ? { categoryIds: createBookDto.categoryIds.map((id: any) => new Types.ObjectId(id)) } : {}),
      ...(createBookDto.typeId ? { typeId: new Types.ObjectId(createBookDto.typeId) } : {}),
    };
    const createdBook = new this.bookModel(bookData);
    return createdBook.save();
  }

  async findAll(filterBooksDto?: FilterBooksDto) {
    const query: any = {};
    const page = filterBooksDto?.page || 1;
    const limit = filterBooksDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterBooksDto?.sortBy || 'order';
    const sortOrder = filterBooksDto?.sortOrder === 'asc' ? 1 : -1;

    if (filterBooksDto) {
      // Search by title
      if (filterBooksDto.title && filterBooksDto.title.trim()) {
        query.title = { $regex: filterBooksDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want books where the age range overlaps with the filter
      if (filterBooksDto.minAge !== undefined) {
        // Book's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterBooksDto.minAge };
      }
      if (filterBooksDto.maxAge !== undefined) {
        // Book's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterBooksDto.maxAge };
      }

      // Filter by series
      if (filterBooksDto.series) {
        query.series = filterBooksDto.series;
      }

      // Filter by series list (any matching)
      if (filterBooksDto.series_list && filterBooksDto.series_list.length > 0) {
        query.series = { $in: filterBooksDto.series_list };
      }

      // Filter by format
      if (filterBooksDto.format) {
        query.format = filterBooksDto.format;
      }

      // Filter by values (any matching values)
      if (filterBooksDto.values && filterBooksDto.values.length > 0) {
        query.values = { $in: filterBooksDto.values };
      }

      // Filter by isPremium
      if (filterBooksDto.isPremium !== undefined) {
        query.isPremium = filterBooksDto.isPremium;
      }

      // Filter by isActive
      if (filterBooksDto.isActive !== undefined) {
        query.isActive = filterBooksDto.isActive;
      }

      if (filterBooksDto.isPopular !== undefined) {
        query.isPopular = filterBooksDto.isPopular;
      }
      if (filterBooksDto.isTrending !== undefined) {
        query.isTrending = filterBooksDto.isTrending;
      }
      if (filterBooksDto.isRecommended !== undefined) {
        query.isRecommended = filterBooksDto.isRecommended;
      }
      if (filterBooksDto.language) {
        query.language = filterBooksDto.language;
      }
      if (filterBooksDto.ageGroupId) {
        query.ageGroupId = new Types.ObjectId(filterBooksDto.ageGroupId);
      }
      if (filterBooksDto.categoryIds?.length) {
        query.categoryIds = { $in: filterBooksDto.categoryIds.map((id) => new Types.ObjectId(id)) };
      }
      if (filterBooksDto.typeId) {
        query.typeId = new Types.ObjectId(filterBooksDto.typeId);
      }
    }

    const [data, total] = await Promise.all([
      this.bookModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .populate('ageGroupId')
  .populate('categoryIds')
        .populate('typeId')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(query).exec(),
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

  async findByEpisodeId(episodeId: string, filterBooksDto?: FilterBooksDto) {
    if (!Types.ObjectId.isValid(episodeId)) {
      throw new BadRequestException('Invalid episode ID');
    }

    const page = filterBooksDto?.page || 1;
    const limit = filterBooksDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterBooksDto?.sortBy || 'order';
    const sortOrder = filterBooksDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = { episodeId: new Types.ObjectId(episodeId) };

    if (filterBooksDto) {
      // Search by title
      if (filterBooksDto.title && filterBooksDto.title.trim()) {
        query.title = { $regex: filterBooksDto.title.trim(), $options: 'i' };
      }

      // Filter by age range
      // age is [minAge, maxAge], we want books where the age range overlaps with the filter
      if (filterBooksDto.minAge !== undefined) {
        // Book's max age (age[1]) >= filter's minAge
        query['age.1'] = { $gte: filterBooksDto.minAge };
      }
      if (filterBooksDto.maxAge !== undefined) {
        // Book's min age (age[0]) <= filter's maxAge
        query['age.0'] = { $lte: filterBooksDto.maxAge };
      }

      // Filter by series
      if (filterBooksDto.series) {
        query.series = filterBooksDto.series;
      }

      // Filter by series list (any matching)
      if (filterBooksDto.series_list && filterBooksDto.series_list.length > 0) {
        query.series = { $in: filterBooksDto.series_list };
      }

      // Filter by format
      if (filterBooksDto.format) {
        query.format = filterBooksDto.format;
      }

      // Filter by values (any matching values)
      if (filterBooksDto.values && filterBooksDto.values.length > 0) {
        query.values = { $in: filterBooksDto.values };
      }

      // Filter by isPremium
      if (filterBooksDto.isPremium !== undefined) {
        query.isPremium = filterBooksDto.isPremium;
      }

      // Filter by isActive
      if (filterBooksDto.isActive !== undefined) {
        query.isActive = filterBooksDto.isActive;
      }

      if (filterBooksDto.isPopular !== undefined) {
        query.isPopular = filterBooksDto.isPopular;
      }
      if (filterBooksDto.isTrending !== undefined) {
        query.isTrending = filterBooksDto.isTrending;
      }
      if (filterBooksDto.isRecommended !== undefined) {
        query.isRecommended = filterBooksDto.isRecommended;
      }
      if (filterBooksDto.language) {
        query.language = filterBooksDto.language;
      }
      if (filterBooksDto.ageGroupId) {
        query.ageGroupId = new Types.ObjectId(filterBooksDto.ageGroupId);
      }
      if (filterBooksDto.categoryIds?.length) {
        query.categoryIds = { $in: filterBooksDto.categoryIds.map((id) => new Types.ObjectId(id)) };
      }
      if (filterBooksDto.typeId) {
        query.typeId = new Types.ObjectId(filterBooksDto.typeId);
      }
    }

    const [data, total] = await Promise.all([
      this.bookModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .populate('ageGroupId')
  .populate('categoryIds')
        .populate('typeId')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(query).exec(),
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


  async findBySeasonId(seasonId: string, filterBooksDto?: FilterBooksDto) {
    if (!Types.ObjectId.isValid(seasonId)) {
      throw new BadRequestException('Invalid season ID');
    }

    const page = filterBooksDto?.page || 1;
    const limit = filterBooksDto?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filterBooksDto?.sortBy || 'order';
    const sortOrder = filterBooksDto?.sortOrder === 'asc' ? 1 : -1;

    const query: any = { seasonId: new Types.ObjectId(seasonId) };

    if (filterBooksDto?.title && filterBooksDto.title.trim()) {
      query.title = { $regex: filterBooksDto.title.trim(), $options: 'i' };
    }
    if (filterBooksDto?.minAge !== undefined) {
      query['age.1'] = { $gte: filterBooksDto.minAge };
    }
    if (filterBooksDto?.maxAge !== undefined) {
      query['age.0'] = { $lte: filterBooksDto.maxAge };
    }
    if (filterBooksDto?.series) {
      query.series = filterBooksDto.series;
    }
    if (filterBooksDto?.series_list?.length) {
      query.series = { $in: filterBooksDto.series_list };
    }
    if (filterBooksDto?.format) {
      query.format = filterBooksDto.format;
    }
    if (filterBooksDto?.values?.length) {
      query.values = { $in: filterBooksDto.values };
    }
    if (filterBooksDto?.isPremium !== undefined) {
      query.isPremium = filterBooksDto.isPremium;
    }
    if (filterBooksDto?.isActive !== undefined) {
      query.isActive = filterBooksDto.isActive;
    }
    if (filterBooksDto?.isPopular !== undefined) {
      query.isPopular = filterBooksDto.isPopular;
    }
    if (filterBooksDto?.isTrending !== undefined) {
      query.isTrending = filterBooksDto.isTrending;
    }
    if (filterBooksDto?.isRecommended !== undefined) {
      query.isRecommended = filterBooksDto.isRecommended;
    }
    if (filterBooksDto?.language) {
      query.language = filterBooksDto.language;
    }
    if (filterBooksDto?.ageGroupId) {
      query.ageGroupId = new Types.ObjectId(filterBooksDto.ageGroupId);
    }
    if (filterBooksDto?.categoryIds?.length) {
      query.categoryIds = { $in: filterBooksDto.categoryIds.map((id) => new Types.ObjectId(id)) };
    }

    const [data, total] = await Promise.all([
      this.bookModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .populate('ageGroupId')
  .populate('categoryIds')
        .populate('typeId')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(query).exec(),
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

  async findOne(id: string) {
    const book = await this.bookModel
      .findById(id)
      .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password')
      .populate('ageGroupId')
.populate('categoryIds')
        .populate('typeId')
      .exec();
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  async findBySlug(slug: string) {
    const book = await this.bookModel
      .findOne({ slug })
      .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password')
      .populate('ageGroupId')
.populate('categoryIds')
        .populate('typeId')
      .exec();
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    // Validate dynamic fields if provided
    if (updateBookDto.dynamicFields) {
      const validation = await this.settingsService.validateDynamicFields(
        'book',
        updateBookDto.dynamicFields,
      );
      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Dynamic fields validation failed',
          errors: validation.errors,
        });
      }
    }

    const updateData = {
      ...updateBookDto,
    };
    if (updateData.seasonId) {
      updateData.seasonId = new Types.ObjectId(updateData.seasonId);
    }
    if (updateData.episodeId) {
      updateData.episodeId = new Types.ObjectId(updateData.episodeId);
    }
    if (updateData.ageGroupId) {
      updateData.ageGroupId = new Types.ObjectId(updateData.ageGroupId);
    }
    if (updateData.categoryIds?.length) {
      updateData.categoryIds = updateData.categoryIds.map((id: any) => new Types.ObjectId(id));
    }
    if (updateData.typeId) {
      updateData.typeId = new Types.ObjectId(updateData.typeId);
    }
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password')
      .populate('ageGroupId')
.populate('categoryIds')
        .populate('typeId')
      .exec();
    if (!updatedBook) {
      throw new BadRequestException('Book not found');
    }
    return updatedBook;
  }

  async remove(id: string) {
    const deletedBook = await this.bookModel
      .findByIdAndDelete(id)
      .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password')
      .populate('ageGroupId')
.populate('categoryIds')
        .populate('typeId')
      .exec();
    if (!deletedBook) {
      throw new BadRequestException('Book not found');
    }
    return deletedBook;
  }

  /**
   * Get all related content from the same episode
   */
  async getRelatedContent(bookId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(bookId)) {
        throw new BadRequestException('Invalid book ID');
      }

      const book = await this.bookModel.findById(bookId).exec();
      if (!book) {
        throw new BadRequestException('Book not found');
      }

      const [otherBooks, episode] = await Promise.all([
        this.bookModel
          .find({
            episodeId: book.episodeId,
            _id: { $ne: bookId },
            isActive: true,
          })
          .limit(limit)
          .sort({ order: 1 })
          .exec(),
        this.bookModel.collection.db.collection('episodes').findOne({ _id: book.episodeId }),
      ]);

      return {
        currentBook: book,
        episode,
        relatedBooks: otherBooks,
        count: otherBooks.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching related content: ${error.message}`);
    }
  }

  /**
   * Get similar books based on age range, values, and premium status
   */
  async getSimilarContent(bookId: string, limit: number = 10) {
    try {
      if (!Types.ObjectId.isValid(bookId)) {
        throw new BadRequestException('Invalid book ID');
      }

      const book = await this.bookModel.findById(bookId).exec();
      if (!book) {
        throw new BadRequestException('Book not found');
      }

      const query: any = {
        _id: { $ne: bookId },
        isActive: true,
        $or: [
          {
            age: {
              $elemMatch: {
                $gte: book.age[0],
                $lte: book.age[1],
              },
            },
          },
          { values: { $in: book.values || [] } },
        ],
      };

      if (book.isPremium !== undefined) {
        query.isPremium = book.isPremium;
      }

      const similarBooks = await this.bookModel
        .find(query)
        .populate('episodeId')
        .populate('seasonId')
        .populate('createdBy', '-password -refreshToken -__v')
        .populate('ageGroupId')
  .populate('categoryIds')
        .populate('typeId')
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        currentBook: book,
        similar: similarBooks,
        count: similarBooks.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching similar books: ${error.message}`);
    }
  }
}
