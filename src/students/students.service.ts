import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { Student, StudentDocument } from './schemas/student.schema';
import { School, SchoolDocument } from '../schools/schemas/school.schema';
import { User } from '../auth/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<any> {
    await this.ensureSchoolExists(createStudentDto.schoolId);
    const student = await new this.studentModel({
      ...createStudentDto,
      name: createStudentDto.name?.trim(),
      schoolId: new Types.ObjectId(createStudentDto.schoolId),
    }).save();

    if (createStudentDto.email?.trim()) {
      const hashedPassword = await bcrypt.hash('Assd@123', 10);
      const existingUser = await this.userModel.findOne({ email: createStudentDto.email.trim().toLowerCase() });
      if (!existingUser) {
        await new this.userModel({
          username: createStudentDto.name?.trim(),
          email: createStudentDto.email.trim().toLowerCase(),
          schoolId: new Types.ObjectId(createStudentDto.schoolId),
          studentId: student._id,
          role: 'user',
          type: 'student',
          password: hashedPassword,
          refreshToken: '',
          isRegistered: false,
          premiumSubscription: false,
        }).save();
      }
    }

    return student;
  }

  async findAll(filterStudentDto?: FilterStudentDto): Promise<any> {
    const page = Number(filterStudentDto?.page || 1);
    const limit = Number(filterStudentDto?.limit || 10);
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filterStudentDto?.search?.trim()) {
      const regex = { $regex: filterStudentDto.search.trim(), $options: 'i' };
      query.$or = [{ name: regex }, { rollNumber: regex }, { grade: regex }, { email: regex }];
    }
    if (filterStudentDto?.schoolId) query.schoolId = new Types.ObjectId(filterStudentDto.schoolId);
    if (filterStudentDto?.status) query.status = filterStudentDto.status;

    const [data, total] = await Promise.all([
      this.studentModel.find(query).populate('schoolId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.studentModel.countDocuments(query),
    ]);

    const studentIds = data.map((item: any) => item._id);
    const linkedUsers = await this.userModel.find({ studentId: { $in: studentIds } }).select('_id studentId');
    const userMap = new Map(linkedUsers.map((item: any) => [String(item.studentId), String(item._id)]));

    return {
      data: data.map((item: any) => ({ ...item.toObject(), userId: userMap.get(String(item._id)) || null })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<any> {
    const student = await this.studentModel.findById(id).populate('schoolId');
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<any> {
    if (updateStudentDto.schoolId) await this.ensureSchoolExists(updateStudentDto.schoolId);

    const student = await this.studentModel.findByIdAndUpdate(
      id,
      {
        ...updateStudentDto,
        ...(updateStudentDto.name ? { name: updateStudentDto.name.trim() } : {}),
        ...(updateStudentDto.schoolId ? { schoolId: new Types.ObjectId(updateStudentDto.schoolId) } : {}),
      },
      { new: true },
    ).populate('schoolId');
    if (!student) throw new NotFoundException('Student not found');

    if (student.email?.trim()) {
      const existingUser = await this.userModel.findOne({ studentId: student._id });
      const payload: any = {
        username: student.name,
        email: student.email.trim().toLowerCase(),
        schoolId: student.schoolId,
        studentId: student._id,
        role: 'user',
        type: 'student',
      };
      if (existingUser) {
        await this.userModel.findByIdAndUpdate(existingUser._id, payload, { new: true });
      } else {
        const hashedPassword = await bcrypt.hash('Assd@123', 10);
        await new this.userModel({ ...payload, password: hashedPassword, refreshToken: '', isRegistered: false, premiumSubscription: false }).save();
      }
    }

    return student;
  }

  async remove(id: string): Promise<any> {
    const student = await this.studentModel.findByIdAndDelete(id);
    if (!student) throw new NotFoundException('Student not found');
    await this.userModel.deleteMany({ studentId: new Types.ObjectId(id) });
    return { success: true, message: 'Student deleted successfully' };
  }

  private async ensureSchoolExists(schoolId: string) {
    const school = await this.schoolModel.findById(schoolId);
    if (!school) throw new NotFoundException('School not found');
  }
}
