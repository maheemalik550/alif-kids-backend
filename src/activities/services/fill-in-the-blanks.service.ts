import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FillInTheBlanks, FillInTheBlanksDocument } from '../schemas';
import { CreateFillInTheBlanksDto, UpdateFillInTheBlanksDto } from '../dto';

@Injectable()
export class FillInTheBlanksService {
  constructor(
    @InjectModel('FillInTheBlanks')
    private model: Model<FillInTheBlanksDocument>,
    @InjectModel('UserActivityProgress') private userActivityProgressModel: Model<any>,
  ) {}

  /**
   * Extract hidden words from bracketed text and generate display text
   * @param paragraphText Text with words in brackets like [word] or [multiple words]
   * @returns Object with hiddenWords array and displayText
   */
  private extractHiddenWords(paragraphText: string): {
    hiddenWords: Array<{ originalWord: string; position: number }>;
    displayText: string;
  } {
    const hiddenWords: Array<{ originalWord: string; position: number }> = [];
    let displayText = paragraphText;
    let position = 0;

    // Regex to find all bracketed words
    const bracketRegex = /\[([^\]]+)\]/g;
    let match;

    while ((match = bracketRegex.exec(paragraphText)) !== null) {
      const originalWord = match[1].trim();
      position++;
      hiddenWords.push({
        originalWord,
        position,
      });
    }

    // Replace all bracketed content with underscores (keeping bracket count)
    displayText = paragraphText.replace(/\[[^\]]+\]/g, '_____');

    return { hiddenWords, displayText };
  }

  async create(
    dto: CreateFillInTheBlanksDto,
  ): Promise<FillInTheBlanksDocument> {
    const { hiddenWords, displayText } = this.extractHiddenWords(
      dto.paragraphText || '',
    );

    const enrichedDto = {
      ...dto,
      hiddenWords: hiddenWords.length > 0 ? hiddenWords : dto.hiddenWords,
      displayText,
    };

    return this.model.create(enrichedDto);
  }

  async findAll(): Promise<FillInTheBlanksDocument[]> {
    return this.model
      .find({ isActive: true })
      .populate('episodeId typeId createdBy');
  }

  async findByEpisodeId(episodeId: string): Promise<FillInTheBlanksDocument[]> {
    return this.model
      .find({ episodeId, isActive: true })
      .sort({ order: 1 })
      .populate('typeId createdBy');
  }

  async findById(id: string): Promise<FillInTheBlanksDocument> {
    return this.model.findById(id).populate('episodeId typeId createdBy');
  }

  async update(
    id: string,
    dto: UpdateFillInTheBlanksDto,
  ): Promise<FillInTheBlanksDocument> {
    const updateData = { ...dto };

    // If paragraphText is provided, extract hidden words and generate displayText
    if (dto.paragraphText) {
      const { hiddenWords, displayText } = this.extractHiddenWords(
        dto.paragraphText,
      );
      updateData.hiddenWords = hiddenWords.length > 0 ? hiddenWords : dto.hiddenWords;
      updateData.displayText = displayText;
    }

    return this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('episodeId typeId createdBy');
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
    // Cascade delete user activity progress for this activity
    await this.userActivityProgressModel.deleteMany({ activityId: id });
  }
}

