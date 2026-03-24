import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookAge, BookAgeDocument } from './schemas/book-age.schema';
import { BookCategory, BookCategoryDocument } from './schemas/book-category.schema';
import { BookType, BookTypeDocument } from './schemas/book-type.schema';
import { CreateBookAgeDto } from './dto/create-book-age.dto';
import { UpdateBookAgeDto } from './dto/update-book-age.dto';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { CreateBookTypeDto } from './dto/create-book-type.dto';
import { UpdateBookTypeDto } from './dto/update-book-type.dto';
import { CreatePopularBookDto } from './dto/create-popular-book.dto';
import { PopularBook, PopularBookDocument } from './schemas/popular-book.schema';
import { Book, BookDocument } from 'src/books/schemas/book.schema';

@Injectable()
export class BookMetaService {
  constructor(
    @InjectModel(BookAge.name) private readonly ageModel: Model<BookAgeDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,

    @InjectModel(BookCategory.name) private readonly categoryModel: Model<BookCategoryDocument>,
    @InjectModel(BookType.name) private readonly typeModel: Model<BookTypeDocument>,
    @InjectModel(PopularBook.name) private readonly popularBooksModel: Model<PopularBookDocument>,

  ) { }

  async createAge(dto: CreateBookAgeDto) {
    return this.ageModel.create({ ...dto, minAge: dto.minAge ?? 0, maxAge: dto.maxAge ?? 0 });
  }


  async createPopularBooks(dto: CreatePopularBookDto) {
    return this.popularBooksModel.create({ ...dto });
  }

  async updateAge(id: string, dto: UpdateBookAgeDto) {
    const item = await this.ageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!item) throw new BadRequestException('Age option not found');
    return item;
  }


  async getAllBooks() {
    const [popular, trending, recomended] = await Promise.all([
      this.bookModel.find({ isPopular: true }).lean(),
      this.bookModel.find({ isTrending: true }).lean(),
      this.bookModel.find({ isRecommended: true }).lean(),
    ]);

    return {
      popular,
      trending,
      recomended,
    };
  }

  async deleteAge(id: string) {
    const item = await this.ageModel.findByIdAndDelete(id).exec();
    if (!item) throw new BadRequestException('Age option not found');
    return { success: true };
  }

  async listAges() {
    const data = await this.ageModel.find().sort({ order: 1, minAge: 1, name: 1 }).exec();
    return { data };
  }

  async createCategory(dto: CreateBookCategoryDto) {
    const exists = await this.categoryModel.findOne({ name: new RegExp(`^${dto.name}$`, 'i') }).exec();
    if (exists) throw new BadRequestException('Category already exists');
    return this.categoryModel.create(dto);
  }

  async updateCategory(id: string, dto: UpdateBookCategoryDto) {
    const item = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!item) throw new BadRequestException('Category not found');
    return item;
  }

  async deleteCategory(id: string) {
    const item = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!item) throw new BadRequestException('Category not found');
    return { success: true };
  }

  async listCategories() {
    const data = await this.categoryModel.find().sort({ createdAt: -1 }).exec();
    return { data };
  }

  async getPopularBooks() {
    const data = await this.popularBooksModel.find().sort({ order: 1, name: 1 }).exec();
    return { data };
  }


  async createType(dto: CreateBookTypeDto) {
    const exists = await this.typeModel.findOne({ name: new RegExp(`^${dto.name}$`, 'i') }).exec();
    if (exists) throw new BadRequestException('Type already exists');
    return this.typeModel.create(dto);
  }

  async updateType(id: string, dto: UpdateBookTypeDto) {
    const item = await this.typeModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!item) throw new BadRequestException('Type not found');
    return item;
  }

  async deleteType(id: string) {
    const item = await this.typeModel.findByIdAndDelete(id).exec();
    if (!item) throw new BadRequestException('Type not found');
    return { success: true };
  }

  async listTypes() {
    const data = await this.typeModel.find().sort({ order: 1, name: 1 }).exec();
    return { data };
  }
  languages = [
    { title: 'English', countryCode: 'gb' },
    { title: 'Arabic', countryCode: 'sa' },
    { title: 'Urdu', countryCode: 'pk' },
    { title: 'Turkish', countryCode: 'tr' },
    { title: 'Spanish', countryCode: 'es' },
    { title: 'French', countryCode: 'fr' },
    { title: 'Bengali', countryCode: 'bd' },
    { title: 'Malay', countryCode: 'my' },
  ];

  async getLanguages() {
    return await this.languages.map((lang) => ({
      title: lang.title,
      flag: `https://flagcdn.com/${lang.countryCode}.svg`, // SVG = sharp at any size
    }));
  }
}
