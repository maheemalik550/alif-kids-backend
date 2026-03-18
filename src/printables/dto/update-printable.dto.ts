import { PartialType } from '@nestjs/mapped-types';
import { CreatePrintableDto } from './create-printable.dto';

export class UpdatePrintableDto extends PartialType(CreatePrintableDto) {}
