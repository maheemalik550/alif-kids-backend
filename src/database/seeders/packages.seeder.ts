import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from 'src/packages/schemas/package.schema';

const packagesData = [
  {
    id: 'monthly',
    name: 'Monthly',
    image: '/assets/monthly.svg',
    price: '£3.99 / month',
    features: ['All premium content', 'Cancel anytime'],
    ctaLabel: 'Start monthly',
    alreadySubscribed: 'Already Subscribed',
  },
  {
    id: 'annual',
    name: 'Annual',
    image: '/assets/annual.svg',
    price: '£39 / year',
    tagline: 'Best value',
    features: ['All premium content', '2 months free vs monthly'],
    ctaLabel: 'Start annual',
    alreadySubscribed: 'Already Subscribed',
  },
];

@Injectable()
export class PackagesSeeder {
  private readonly logger = new Logger(PackagesSeeder.name);

  constructor(
    @InjectModel(Package.name)
    private packageModel: Model<PackageDocument>,
  ) {}

  async seed() {
    try {
      this.logger.log('🌱 Seeding packages...');

      // Check if packages already exist
      const existingCount = await this.packageModel.countDocuments();
      if (existingCount > 0) {
        this.logger.log('✅ Packages already exist, skipping seeding');
        return;
      }

      // Create packages
      const createdPackages = await this.packageModel.insertMany(
        packagesData.map((pkg) => ({
          ...pkg,
          isActive: true,
        })),
      );

      this.logger.log(
        `✅ Successfully seeded ${createdPackages.length} packages`,
      );
      createdPackages.forEach((pkg) => {
        this.logger.log(`   - ${pkg.name} (${pkg.id}) - ${pkg.price}`);
      });
    } catch (error) {
      this.logger.error('❌ Error seeding packages:', error);
      throw error;
    }
  }
}
