import { PartialType } from '@nestjs/mapped-types';
import { CreateBookTypeDto } from './create-book-type.dto';

export class UpdateBookTypeDto extends PartialType(CreateBookTypeDto) {}
