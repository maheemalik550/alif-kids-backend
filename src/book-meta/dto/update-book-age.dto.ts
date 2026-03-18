import { PartialType } from '@nestjs/mapped-types';
import { CreateBookAgeDto } from './create-book-age.dto';

export class UpdateBookAgeDto extends PartialType(CreateBookAgeDto) {}
