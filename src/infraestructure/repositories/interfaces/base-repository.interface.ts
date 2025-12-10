import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
} from 'typeorm';

export interface IBaseRepository<T> {
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  findByIds(ids: any[]): Promise<T[]>;
  save(data: DeepPartial<T> | DeepPartial<T>[]): Promise<T>;
  update(id: number | string, data: DeepPartial<T>): Promise<UpdateResult>;
  delete(id: number | string): Promise<DeleteResult>;
  softDelete(id: number | string): Promise<UpdateResult>;
  create(entity: Partial<T>): T;
}
