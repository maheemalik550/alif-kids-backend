import { Test, TestingModule } from '@nestjs/testing';
import { SeriesService } from './series.service';
import { getModelToken } from '@nestjs/mongoose';
import { Series } from './schemas/series.schema';

describe('SeriesService', () => {
  let service: SeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeriesService,
        {
          provide: getModelToken(Series.name),
          useValue: {}, // Mock the model
        },
      ],
    }).compile();

    service = module.get<SeriesService>(SeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
