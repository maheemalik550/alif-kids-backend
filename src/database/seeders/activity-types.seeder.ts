import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActivityType,
  ActivityTypeDocument,
} from 'src/activities/schemas/activity-type.schema';

@Injectable()
export class ActivityTypesSeeder {
  private readonly logger = new Logger(ActivityTypesSeeder.name);

  constructor(
    @InjectModel(ActivityType.name)
    private readonly activityTypeModel: Model<ActivityTypeDocument>,
  ) {}

  async seed() {
    const activityTypes = [
      {
        name: 'List match',
        slug: 'list-match',
        description: 'Description for List match',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430082/myquranjourney/Activity%20Assets/List_Match.png',
        color: '#33FF57',
      },
      {
        name: 'Card Match',
        slug: 'pair-match',
        description: 'Description for Card match',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430081/myquranjourney/Activity%20Assets/Card_Match.png',
        color: '#3357FF',
      },
      {
        name: 'Word discovery',
        slug: 'word-discovery',
        description: 'Description for Word discovery',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430082/myquranjourney/Activity%20Assets/Word_Discovery.png',
        color: '#FF33A1',
      },
      {
        name: 'Fill in the blanks',
        slug: 'fill-in-the-blanks',
        description: 'Description for Fill in the blanks',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430082/myquranjourney/Activity%20Assets/Fill_In_The_Blank.png',
        color: '#FFC300',
      },
      {
        name: 'Categorize it',
        slug: 'categorize-it',
        description: 'Description for Categorize it',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430081/myquranjourney/Activity%20Assets/Categorize_It.png',
        color: '#DAF7A6',
      },
      {
        name: 'Multi answer choice',
        slug: 'multi-answer-choice',
        description: 'Description for Multi answer choice',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430084/myquranjourney/Activity%20Assets/Multi_Answer_Choice.png',
        color: '#FF8C00',
      },
      {
        name: 'Crossword puzzle',
        slug: 'crossword-puzzle',
        description: 'Description for Crossword puzzle',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430082/myquranjourney/Activity%20Assets/Crossword_Puzzle.png',
        color: '#BA55D3',
      },
      {
        name: 'Free Drawing',
        slug: 'free-drawing',
        description: 'Description for Free Drawing',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430082/myquranjourney/Activity%20Assets/Keyword_Drawing.png',
        color: '#20B2AA',
      },
      {
        name: 'Maze quest',
        slug: 'maze-game',
        description: 'Description for Maze quest',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430083/myquranjourney/Activity%20Assets/Maze_Quest.png',
        color: '#FF6347',
      },
      {
        name: 'Complete the shape',
        slug: 'complete-the-shape',
        description: 'Description for Complete the shape',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430083/myquranjourney/Activity%20Assets/Mirror_The_Shape.png',
        color: '#4682B4',
      },
      {
        name: 'Fill The Color',
        slug: 'fill-the-color',
        description: 'Description for Fill the kabah',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430082/myquranjourney/Activity%20Assets/Color_The_Scene.png',
        color: '#FFD700',
      },
      {
        name: 'Locate It',
        slug: 'locate-it',
        description: 'Description for Locate It',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430083/myquranjourney/Activity%20Assets/Locate_It.png',
        color: '#ADFF2F',
      },
      {
        name: 'Hands On Activity',
        slug: 'hands-on-activity',
        description: 'Description for Hands-On Activity',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430081/myquranjourney/Activity%20Assets/Hands_On_Activity.png',
        color: '#00CED1',
      },
      {
        name: 'Q&A (Short Answer)',
        slug: 'qa-short-answer',
        description: 'Description for Q&A (Short Answer)',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430084/myquranjourney/Activity%20Assets/Q_A_Short_Answer.png',
        color: '#FF4500',
      },
      {
        name: 'Reflect & Respond',
        slug: 'reflect-and-respond',
        description: 'Description for Reflect & Respond',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430084/myquranjourney/Activity%20Assets/Multi_Answer_Short_QA.png',
        color: '#9370DB',
      },
      {
        name: 'Photo Select',
        slug: 'photo-select',
        description: 'Description for Photo match',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430084/myquranjourney/Activity%20Assets/Photo_Match.png',
        color: '#32CD32',
      },
      {
        name: 'Translation match',
        slug: 'translation-match',
        description: 'Description for Translation match',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430085/myquranjourney/Activity%20Assets/Translation_Match.png',
        color: '#33FF57',
      },
      {
        name: 'MCQ',
        slug: 'multi-choice-questions',
        description: 'Description for Multi Choice Questions Game',
        img: 'https://res.cloudinary.com/dayfv4et9/image/upload/v1765430083/myquranjourney/Activity%20Assets/MCQ_s.png',
        color: '#33FF57',
      },
    ];

    try {
      for (const activityType of activityTypes) {
        const existing = await this.activityTypeModel.findOne({
          slug: activityType.slug,
        });

        if (!existing) {
          await this.activityTypeModel.create(activityType);
          this.logger.log(`✅ Seeded: ${activityType.name}`);
        } else {
          this.logger.warn(`⏭️ Already exists: ${activityType.name}`);
        }
      }

      this.logger.log('✅ Activity Types seeding completed');
    } catch (error) {
      this.logger.error('❌ Error seeding activity types:', error);
      throw error;
    }
  }
}
