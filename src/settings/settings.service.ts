import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { CreateSettingDto, UpdateSettingDto, BulkCreateSettingDto, BulkUpdateSettingDto, SaveUpdateSettingsDto } from './dto';
import { FieldType, ModuleEnum } from './enums';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    // Validate fieldKey is unique
    const existingSetting = await this.settingModel.findOne({
      fieldKey: createSettingDto.fieldKey,
    });
    if (existingSetting) {
      throw new BadRequestException(
        `Field key "${createSettingDto.fieldKey}" already exists`,
      );
    }

    // Validate modules values
    this.validateModules(createSettingDto.modules);

    const setting = new this.settingModel({
      ...createSettingDto,
      isActive: createSettingDto.isActive ?? true,
      isRequired: createSettingDto.isRequired ?? false,
      order: createSettingDto.order ?? 0,
    });

    try {
      return await setting.save();
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(
          `Duplicate key error on field "${field}". This value already exists.`,
        );
      }
      throw error;
    }
  }

  async bulkCreate(bulkCreateSettingDto: BulkCreateSettingDto): Promise<Setting[]> {
    const results: Setting[] = [];
    const fieldKeys = new Set<string>();

    // Validate for duplicate fieldKeys in the request
    for (const dto of bulkCreateSettingDto.settings) {
      if (fieldKeys.has(dto.fieldKey)) {
        throw new BadRequestException(
          `Duplicate fieldKey "${dto.fieldKey}" in bulk create request`,
        );
      }
      fieldKeys.add(dto.fieldKey);
    }

    // Check which fieldKeys already exist in database
    const existingSettings = await this.settingModel.find({
      fieldKey: { $in: Array.from(fieldKeys) },
    });

    const existingFieldKeys = new Set(
      existingSettings.map((s) => s.fieldKey),
    );

    // Add existing settings to results
    results.push(...existingSettings);

    // Create only new settings
    try {
      for (const dto of bulkCreateSettingDto.settings) {
        // Skip if it already exists
        if (existingFieldKeys.has(dto.fieldKey)) {
          continue;
        }

        // Validate modules values
        this.validateModules(dto.modules);

        const setting = new this.settingModel({
          ...dto,
          isActive: dto.isActive ?? true,
          isRequired: dto.isRequired ?? false,
          order: dto.order ?? 0,
        });

        const savedSetting = await setting.save();
        results.push(savedSetting);
      }
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(
          `Duplicate key error on field "${field}". Please ensure all fieldKeys are unique.`,
        );
      }
      throw error;
    }

    return results;
  }

  async bulkUpdate(bulkUpdateSettingDto: BulkUpdateSettingDto): Promise<Setting[]> {
    const results: Setting[] = [];
    const errors: string[] = [];

    for (const update of bulkUpdateSettingDto.updates) {
      try {
        // Validate ID
        if (!Types.ObjectId.isValid(update.id)) {
          errors.push(`Invalid ID format: ${update.id}`);
          continue;
        }

        // Find the setting
        const setting = await this.settingModel.findById(update.id).exec();
        if (!setting) {
          errors.push(`Setting with ID "${update.id}" not found`);
          continue;
        }

        // If fieldKey is being updated, check uniqueness (excluding current document)
        if (
          update.data.fieldKey &&
          update.data.fieldKey !== setting.fieldKey
        ) {
          const existingSetting = await this.settingModel.findOne({
            fieldKey: update.data.fieldKey,
          });
          if (existingSetting) {
            errors.push(
              `Field key "${update.data.fieldKey}" already exists (ID: ${update.id})`,
            );
            continue;
          }
        }

        // Validate modules if provided
        if (update.data.modules) {
          this.validateModules(update.data.modules);
        }

        // Update the setting
        const updatedSetting = await this.settingModel
          .findByIdAndUpdate(update.id, update.data, { new: true })
          .exec();

        results.push(updatedSetting);
      } catch (error) {
        errors.push(
          `Error updating ID ${update.id}: ${error.message}`,
        );
      }
    }

    // Return results with error summary
    return {
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      successCount: results.length,
      errorCount: errors.length,
    } as any;
  }

  async saveOrUpdateSettings(saveUpdateSettingsDto: SaveUpdateSettingsDto): Promise<any> {
    const results: Array<{
      fieldKey: string;
      action: 'created' | 'updated';
      data: Setting;
      error?: string;
    }> = [];

    const fieldKeys = new Set<string>();

    // Validate for duplicate fieldKeys in the request
    for (const dto of saveUpdateSettingsDto.settings) {
      if (fieldKeys.has(dto.fieldKey)) {
        throw new BadRequestException(
          `Duplicate fieldKey "${dto.fieldKey}" in settings request`,
        );
      }
      fieldKeys.add(dto.fieldKey);
    }

    try {
      for (const dto of saveUpdateSettingsDto.settings) {
        try {
          // Validate modules values
          this.validateModules(dto.modules);

          // Check if setting with this fieldKey already exists
          const existingSetting = await this.settingModel.findOne({
            fieldKey: dto.fieldKey,
          });

          let savedSetting: Setting;
          let action: 'created' | 'updated';

          if (existingSetting) {
            // Update existing setting
            savedSetting = await this.settingModel
              .findByIdAndUpdate(
                existingSetting._id,
                {
                  label: dto.label,
                  fieldType: dto.fieldType,
                  modules: dto.modules,
                  isRequired: dto.isRequired ?? false,
                  isActive: dto.isActive ?? true,
                  order: dto.order ?? existingSetting.order,
                  placeholder: dto.placeholder,
                  defaultValue: dto.defaultValue,
                  validationRules: dto.validationRules,
                },
                { new: true }
              )
              .exec();
            action = 'updated';
          } else {
            // Create new setting
            const setting = new this.settingModel({
              ...dto,
              isActive: dto.isActive ?? true,
              isRequired: dto.isRequired ?? false,
              order: dto.order ?? 0,
            });
            savedSetting = await setting.save();
            action = 'created';
          }

          results.push({
            fieldKey: dto.fieldKey,
            action,
            data: savedSetting,
          });
        } catch (error) {
          results.push({
            fieldKey: dto.fieldKey,
            action: 'created', // default action for error response
            data: null,
            error: error.message,
          } as any);
        }
      }
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(
          `Duplicate key error on field "${field}".`,
        );
      }
      throw error;
    }

    // Summary
    const successResults = results.filter((r) => !r.error);
    const errorResults = results.filter((r) => r.error);
    const createdCount = results.filter((r) => r.action === 'created' && !r.error).length;
    const updatedCount = results.filter((r) => r.action === 'updated' && !r.error).length;

    return {
      success: errorResults.length === 0,
      data: successResults,
      errors: errorResults.length > 0 ? errorResults : undefined,
      summary: {
        total: results.length,
        created: createdCount,
        updated: updatedCount,
        failed: errorResults.length,
      },
    };
  }

  async findAll(): Promise<Setting[]> {
    return this.settingModel.find().sort({ order: 1 }).exec();
  }

  async findByModule(moduleName: string): Promise<Setting[]> {
    // Validate module name
    if (!Object.values(ModuleEnum).includes(moduleName as ModuleEnum)) {
      throw new BadRequestException(
        `Invalid module name. Must be one of: ${Object.values(ModuleEnum).join(', ')}`,
      );
    }

    return this.settingModel
      .find({
        modules: moduleName,
        isActive: true,
      })
      .select('-validationRules -__v')
      .sort({ order: 1 })
      .exec();
  }

  async findById(id: string): Promise<Setting> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid setting ID');
    }

    const setting = await this.settingModel.findById(id).exec();
    if (!setting) {
      throw new NotFoundException(`Setting with ID "${id}" not found`);
    }

    return setting;
  }

  async update(id: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid setting ID');
    }

    const setting = await this.settingModel.findById(id).exec();
    if (!setting) {
      throw new NotFoundException(`Setting with ID "${id}" not found`);
    }

    // If fieldKey is being updated, check uniqueness (excluding current document)
    if (
      updateSettingDto.fieldKey &&
      updateSettingDto.fieldKey !== setting.fieldKey
    ) {
      const existingSetting = await this.settingModel.findOne({
        fieldKey: updateSettingDto.fieldKey,
      });
      if (existingSetting) {
        throw new BadRequestException(
          `Field key "${updateSettingDto.fieldKey}" already exists`,
        );
      }
    }

    // Validate modules if provided
    if (updateSettingDto.modules) {
      this.validateModules(updateSettingDto.modules);
    }

    const updatedSetting = await this.settingModel
      .findByIdAndUpdate(id, updateSettingDto, { new: true })
      .exec();

    return updatedSetting;
  }

  async deactivate(id: string): Promise<Setting> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid setting ID');
    }

    const setting = await this.settingModel.findById(id).exec();
    if (!setting) {
      throw new NotFoundException(`Setting with ID "${id}" not found`);
    }

    return this.settingModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Setting> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid setting ID');
    }

    const setting = await this.settingModel.findByIdAndDelete(id).exec();
    if (!setting) {
      throw new NotFoundException(`Setting with ID "${id}" not found`);
    }

    return setting;
  }

  /**
   * Get all active settings for given modules and validate dynamic fields
   */
  async getSettingsForModule(moduleName: string): Promise<Setting[]> {
    return this.findByModule(moduleName);
  }

  /**
   * Validate dynamic fields against settings for a specific module
   */
  async validateDynamicFields(
    moduleName: string,
    dynamicFields: Record<string, any>,
  ): Promise<{ valid: boolean; errors: string[] }> {
    if (!Object.values(ModuleEnum).includes(moduleName as ModuleEnum)) {
      throw new BadRequestException('Invalid module name');
    }

    const settings = await this.getSettingsForModule(moduleName);
    const errors: string[] = [];

    // Check required fields
    for (const setting of settings) {
      if (setting.isRequired && !dynamicFields[setting.fieldKey]) {
        errors.push(`Field "${setting.label}" (${setting.fieldKey}) is required`);
      }

      // Validate field type if present
      if (dynamicFields[setting.fieldKey] !== undefined) {
        const validationError = this.validateFieldType(
          setting.fieldKey,
          dynamicFields[setting.fieldKey],
          setting.fieldType,
        );
        if (validationError) {
          errors.push(validationError);
        }
      }

      // Apply custom validation rules if defined
      if (setting.validationRules && dynamicFields[setting.fieldKey]) {
        const customValidationError = this.validateCustomRules(
          setting.fieldKey,
          dynamicFields[setting.fieldKey],
          setting.validationRules,
        );
        if (customValidationError) {
          errors.push(customValidationError);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate field type
   */
  private validateFieldType(
    fieldKey: string,
    value: any,
    fieldType: FieldType,
  ): string | null {
    switch (fieldType) {
      case FieldType.TEXT:
      case FieldType.TEXTAREA:
      case FieldType.RICHTEXT:
        if (typeof value !== 'string') {
          return `Field "${fieldKey}" must be a string`;
        }
        break;

      case FieldType.NUMBER:
        if (typeof value !== 'number') {
          return `Field "${fieldKey}" must be a number`;
        }
        break;

      case FieldType.BOOLEAN:
        if (typeof value !== 'boolean') {
          return `Field "${fieldKey}" must be a boolean`;
        }
        break;

      case FieldType.SELECT:
        if (typeof value !== 'string') {
          return `Field "${fieldKey}" must be a string`;
        }
        break;

      case FieldType.MULTISELECT:
        if (!Array.isArray(value)) {
          return `Field "${fieldKey}" must be an array`;
        }
        if (!value.every((item) => typeof item === 'string')) {
          return `Field "${fieldKey}" must be an array of strings`;
        }
        break;

      case FieldType.IMAGE:
      case FieldType.FILE:
        if (typeof value !== 'string') {
          return `Field "${fieldKey}" must be a string (URL or file path)`;
        }
        break;

      case FieldType.JSON:
        if (typeof value !== 'object') {
          return `Field "${fieldKey}" must be a JSON object`;
        }
        break;
    }

    return null;
  }

  /**
   * Validate custom validation rules
   */
  private validateCustomRules(
    fieldKey: string,
    value: any,
    rules: Record<string, any>,
  ): string | null {
    // Min length validation
    if (rules.minLength && typeof value === 'string') {
      if (value.length < rules.minLength) {
        return `Field "${fieldKey}" must be at least ${rules.minLength} characters long`;
      }
    }

    // Max length validation
    if (rules.maxLength && typeof value === 'string') {
      if (value.length > rules.maxLength) {
        return `Field "${fieldKey}" must be at most ${rules.maxLength} characters long`;
      }
    }

    // Min value validation
    if (rules.min !== undefined && typeof value === 'number') {
      if (value < rules.min) {
        return `Field "${fieldKey}" must be at least ${rules.min}`;
      }
    }

    // Max value validation
    if (rules.max !== undefined && typeof value === 'number') {
      if (value > rules.max) {
        return `Field "${fieldKey}" must be at most ${rules.max}`;
      }
    }

    // Pattern validation (regex)
    if (rules.pattern && typeof value === 'string') {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        return `Field "${fieldKey}" does not match required pattern`;
      }
    }

    // Enum validation
    if (rules.enum && Array.isArray(rules.enum)) {
      if (!rules.enum.includes(value)) {
        return `Field "${fieldKey}" must be one of: ${rules.enum.join(', ')}`;
      }
    }

    return null;
  }

  /**
   * Validate module names
   */
  private validateModules(modules: string[]): void {
    const validModules = Object.values(ModuleEnum);
    for (const module of modules) {
      if (!validModules.includes(module as ModuleEnum)) {
        throw new BadRequestException(
          `Invalid module name: "${module}". Must be one of: ${validModules.join(', ')}`,
        );
      }
    }
  }

  /**
   * Reset indexes - drops stale indexes and rebuilds
   * Only available in development mode
   */
  async resetIndexes(): Promise<any> {
    try {
      const collection = this.settingModel.collection;
      const indexes = await collection.listIndexes().toArray();

      // Drop all indexes except _id_
      for (const index of indexes) {
        if (index.name !== '_id_') {
          try {
            await collection.dropIndex(index.name);
          } catch (error) {
            // Index might not exist, continue
          }
        }
      }

      // Rebuild indexes from schema
      await this.settingModel.syncIndexes();

      return {
        success: true,
        message: 'Indexes reset successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to reset indexes: ${error.message}`,
      );
    }
  }
}
