import { DeleteResult, FindConditions, FindOneOptions, Repository, getRepository } from 'typeorm';

// The functions in this class are proxied directly to the type-orm repository
export default abstract class TypeOrmRepository<T> {
  public entityName: string;
  public repository: Repository<T>;

  constructor(entityName: string) {
    this.entityName = entityName;
    this.repository = getRepository(this.entityName);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  public async findOne(
    conditions?: FindConditions<T> | undefined,
    options?: FindOneOptions<T> | undefined
  ): Promise<T | undefined> {
    return await this.repository.findOne(conditions, options);
  }
}
