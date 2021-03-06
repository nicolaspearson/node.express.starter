import Boom from 'boom';
import { ValidationError, validate } from 'class-validator';
import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions } from 'typeorm';

import BaseRepository from '@/db/repositories/base.repository';

export default abstract class BaseService<T extends DeepPartial<T>> {
  constructor(private repository: BaseRepository<T>) {
    // Empty constructor
  }

  public preSaveHook(_: T): void {
    // Executed before the save repository call
  }

  public preUpdateHook(_: T): void {
    // Executed before the update repository call
  }

  public preDeleteHook(_: T): void {
    // Executed before the delete repository call
  }

  public preResultHook(_: T): void {
    // Executed before the result is returned
  }

  public validId(id: number): boolean {
    return id !== undefined && id > 0;
  }

  public async isValid(entity: T): Promise<boolean> {
    try {
      const errors: ValidationError[] = await validate(entity, {
        validationError: { target: false, value: false },
      });
      if (errors.length > 0) {
        throw Boom.badRequest('Validation failed on the provided request', errors);
      }
      return true;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.badRequest('Unable to validate request: ' + error);
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      const entities: T[] = await this.repository.getAll();
      entities.map((item) => this.preResultHook(item));
      return entities;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async findAllByFilter(filter: FindManyOptions<T>): Promise<T[]> {
    try {
      const entities: T[] = await this.repository.findManyByFilter(filter);
      entities.map((item) => this.preResultHook(item));
      return entities;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async findOneById(id: number): Promise<T> {
    try {
      if (!this.validId(id) || isNaN(id)) {
        throw Boom.badRequest('Incorrect / invalid parameters supplied');
      }
      const entity: T = await this.repository.findOneById(id);
      this.preResultHook(entity);
      return entity;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async findOneByFilter(filter: FindOneOptions<T>): Promise<T> {
    try {
      const entityResult = await this.repository.findOneByFilter(filter);
      this.preResultHook(entityResult);
      return entityResult;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async save(entity: T): Promise<T> {
    try {
      // Check if the entity is valid
      const entityIsValid = await this.isValid(entity);
      if (!entityIsValid) {
        throw Boom.badRequest('Incorrect / invalid parameters supplied');
      }
      // Execute the hook
      this.preSaveHook(entity);
      // Save the entity to the database
      const savedEntity: T = await this.repository.saveRecord(entity);
      this.preResultHook(savedEntity);
      return savedEntity;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async saveAll(entities: T[]): Promise<T[]> {
    try {
      for (const entity of entities) {
        // Check if the entity is valid
        const entityIsValid = await this.isValid(entity);
        if (!entityIsValid) {
          throw Boom.badRequest('Incorrect / invalid parameters supplied');
        }
        // Execute the hook
        this.preSaveHook(entity);
      }
      // Save the entities to the database
      const savedEntities: T[] = await this.repository.saveAll(entities);
      savedEntities.map((item) => this.preResultHook(item));
      return savedEntities;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async update(id: number, entity: T): Promise<T> {
    try {
      // Check if the entity is valid
      const entityIsValid = await this.isValid(entity);
      if (!entityIsValid || !this.validId(id)) {
        throw Boom.badRequest('Incorrect / invalid parameters supplied');
      }
      // Execute the hook
      this.preUpdateHook(entity);
      // Update the entity on the database
      const updatedEntity: T = await this.repository.updateOneById(id, entity);
      this.preResultHook(updatedEntity);
      return updatedEntity;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async updateAll(entities: T[]): Promise<T[]> {
    try {
      for (const entity of entities) {
        // Check if the entity is valid
        const entityIsValid = await this.isValid(entity);
        if (!entityIsValid) {
          throw Boom.badRequest('Incorrect / invalid parameters supplied');
        }
        // Execute the hook
        this.preUpdateHook(entity);
      }
      // Update the entities on the database
      const updatedEntities: T[] = await this.repository.updateAll(entities);
      updatedEntities.map((item) => this.preResultHook(item));
      return updatedEntities;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async delete(id: number): Promise<DeleteResult> {
    try {
      if (!this.validId(id)) {
        throw Boom.badRequest('Incorrect / invalid parameters supplied');
      }
      return await this.repository.delete(id);
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async deleteRecord(id: number): Promise<T> {
    try {
      if (!this.validId(id)) {
        throw Boom.badRequest('Incorrect / invalid parameters supplied');
      }
      const entityResult: T = await this.repository.findOneById(id);
      // Execute the hook
      this.preDeleteHook(entityResult);
      // Delete the record
      const deletedEntity: T = await this.repository.deleteRecord(entityResult);
      this.preResultHook(deletedEntity);
      return deletedEntity;
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public async softDelete(id: number): Promise<T> {
    try {
      if (!this.validId(id)) {
        throw Boom.badRequest('Incorrect / invalid parameters supplied');
      }
      const entityResult: T = await this.repository.findOneById(id);
      // Execute the hook - In this scenario your hook should set the deleted_at field
      this.preDeleteHook(entityResult);
      // Save the record to apply the soft delete
      const deletedEntity: T = await this.repository.saveRecord(entityResult);
      this.preResultHook(deletedEntity);
      return deletedEntity;
    } catch (error) {
      if (Boom.isBoom(error)) {
        throw Boom.boomify(error);
      }
      throw Boom.internal(error);
    }
  }
}
