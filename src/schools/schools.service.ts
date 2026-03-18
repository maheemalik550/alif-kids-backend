import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { FilterSchoolDto } from './dto/filter-school.dto';
import { School, SchoolDocument } from './schemas/school.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<any> {
    const school = new this.schoolModel({
      ...createSchoolDto,
      name: createSchoolDto.name?.trim(),
    });
    return school.save();
  }

  async findAll(filterSchoolDto?: FilterSchoolDto): Promise<any> {
    const page = Number(filterSchoolDto?.page || 1);
    const limit = Number(filterSchoolDto?.limit || 10);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filterSchoolDto?.search?.trim()) {
      const regex = { $regex: filterSchoolDto.search.trim(), $options: 'i' };
      query.$or = [{ name: regex }, { code: regex }, { email: regex }, { contactPerson: regex }];
    }
    if (filterSchoolDto?.status) {
      query.status = filterSchoolDto.status;
    }

    const [data, total] = await Promise.all([
      this.schoolModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.schoolModel.countDocuments(query),
    ]);

    const schoolIds = data.map((item) => item._id);
    const studentCounts = await this.studentModel.aggregate([
      { $match: { schoolId: { $in: schoolIds } } },
      { $group: { _id: '$schoolId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(studentCounts.map((item) => [String(item._id), item.count]));
    const userCounts = await this.userModel.aggregate([
      { $match: { schoolId: { $in: schoolIds }, type: 'school' } },
      { $group: { _id: '$schoolId', count: { $sum: 1 } } },
    ]);
    const userCountMap = new Map(userCounts.map((item) => [String(item._id), item.count]));

    return {
      data: data.map((item: any) => ({ ...item, students: countMap.get(String(item._id)) || 0, users: userCountMap.get(String(item._id)) || 0 })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<any> {
    const school = await this.schoolModel.findById(id).lean();
    if (!school) throw new NotFoundException('School not found');
    const students = await this.studentModel.countDocuments({ schoolId: id });
    const users = await this.userModel.countDocuments({ schoolId: id, type: 'school' });
    return { ...school, students, users };
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<any> {
    const school = await this.schoolModel.findByIdAndUpdate(
      id,
      {
        ...updateSchoolDto,
        ...(updateSchoolDto.name ? { name: updateSchoolDto.name.trim() } : {}),
      },
      { new: true },
    );
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async remove(id: string): Promise<any> {
    const school = await this.schoolModel.findById(id);
    if (!school) throw new NotFoundException('School not found');
    await this.studentModel.deleteMany({ schoolId: id });
    await this.userModel.deleteMany({ schoolId: id });
    await this.schoolModel.findByIdAndDelete(id);
    return { success: true, message: 'School and related students deleted successfully' };
  }
}
