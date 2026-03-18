import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { School } from '../schools/schemas/school.schema';
import { CreateSchoolUserDto } from './dto/create-school-user.dto';
import { UpdateSchoolUserDto } from './dto/update-school-user.dto';
import { FilterSchoolUserDto } from './dto/filter-school-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SchoolUsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(School.name) private schoolModel: Model<School>,
  ) {}

  async create(dto: CreateSchoolUserDto) {
    await this.ensureSchool(dto.schoolId);
    const email = dto.email?.trim().toLowerCase();
    const exists = await this.userModel.findOne({ email });
    if (exists) throw new BadRequestException('Email already exists');
    const hashedPassword = await bcrypt.hash('Assd@123', 10);
    const user = new this.userModel({
      username: dto.name?.trim(),
      email,
      schoolId: new Types.ObjectId(dto.schoolId),
      role: 'user',
      type: 'school',
      password: hashedPassword,
      refreshToken: '',
      isRegistered: false,
      premiumSubscription: false,
    });
    return user.save();
  }

  async findAll(filterDto?: FilterSchoolUserDto) {
    const page = Number(filterDto?.page || 1);
    const limit = Number(filterDto?.limit || 10);
    const skip = (page - 1) * limit;
    const query: any = { role: 'user', schoolId: { $ne: null }, type: 'school' };
    if (filterDto?.schoolId) query.schoolId = new Types.ObjectId(filterDto.schoolId);
    if (filterDto?.search?.trim()) {
      const regex = { $regex: filterDto.search.trim(), $options: 'i' };
      query.$or = [{ username: regex }, { email: regex }];
    }
    const [data, total] = await Promise.all([
      this.userModel.find(query).populate('schoolId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.userModel.countDocuments(query),
    ]);
    return { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async update(id: string, dto: UpdateSchoolUserDto) {
    if (dto.schoolId) await this.ensureSchool(dto.schoolId);
    const user = await this.userModel.findByIdAndUpdate(id, {
      ...(dto.name ? { username: dto.name.trim() } : {}),
      ...(dto.email ? { email: dto.email.trim().toLowerCase() } : {}),
      ...(dto.schoolId ? { schoolId: new Types.ObjectId(dto.schoolId) } : {}),
      type: 'school',
      role: 'user',
    }, { new: true }).populate('schoolId');
    if (!user) throw new NotFoundException('School user not found');
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('School user not found');
    return { success: true, message: 'School user deleted successfully' };
  }

  private async ensureSchool(schoolId: string) {
    const school = await this.schoolModel.findById(schoolId);
    if (!school) throw new NotFoundException('School not found');
  }
}
