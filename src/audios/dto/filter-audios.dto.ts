export class FilterAudiosDto {
  page?: number;
  limit?: number;
  title?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minAge?: number;
  maxAge?: number;
  series?: string;
  series_list?: string[];
  values?: string[];
  isPremium?: boolean;
  isActive?: boolean;
}
