import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolUsersService } from './school-users.service';
import { SchoolUsersController } from './school-users.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { School, SchoolSchema } from '../schools/schemas/school.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: School.name, schema: SchoolSchema }])],
  providers: [SchoolUsersService],
  controllers: [SchoolUsersController],
})
export class SchoolUsersModule {}
