import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Version } from './schemas/version.schema';
import { CreateVersionDto, UpdateVersionDto } from './dto/version.dto';

@Injectable()
export class VersionService {
  constructor(
    @InjectModel(Version.name)
    private versionModel: Model<Version>,
  ) {}

  async create(createVersionDto: CreateVersionDto, adminId: string) {
    const payload = {
      adminId: new Types.ObjectId(adminId),
      ...createVersionDto,
    };

    const version = new this.versionModel(payload);
    return await version.save();
  }

  async findAll() {
    return await this.versionModel.find().sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string) {
    return await this.versionModel.findById(id).exec();
  }

  async update(
    id: string,
    updateVersionDto: UpdateVersionDto,
    adminId: string,
  ) {
    const updatedData = {
      ...updateVersionDto,
      adminId: new Types.ObjectId(adminId),
      updatedAt: new Date(),
    };

    return await this.versionModel
      .findByIdAndUpdate(id, { $set: updatedData }, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.versionModel.findByIdAndDelete(id).exec();
  }

  async getCurrentVersion() {
    const versions = await this.versionModel
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();

    return versions?.length ? versions[0] : null;
  }
}
