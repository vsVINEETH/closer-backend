import { SortOrder } from "mongoose";

export interface IBaseRepository<T, U> {
  findById(id: string): Promise<T | null>;
  findAll<K>(
    query?: Record<string, K>,
    sort?: { [key: string]: SortOrder },
    skip?: number,
    limit?: number
  ): Promise<T[] | null>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<U>): Promise<T | null>;
  deleteById(id: string): Promise<boolean | null>;
  countDocs<K>(query?: Record<string, K>): Promise<number>;
}
