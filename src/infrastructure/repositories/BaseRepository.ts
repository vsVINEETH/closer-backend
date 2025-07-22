import { Document, Model } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { SortOrder } from "../config/database";

export class BaseRepository<T, U extends Document> implements IBaseRepository<T, U> {

  constructor (protected model: Model<U>, protected toEntity: (doc: U) => T, protected toEntities: (docs: U[]) => T[]) {};

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toEntity(doc) : null;
  };

  async findAll<K>(
    query: Record<string, K> = {},
    sort: { [key: string]: SortOrder } = {},
    skip = 0,
    limit = 0
  ): Promise<T[] | null> {
    const docs = await this.model.find(query).sort(sort).skip(skip).limit(limit);
    return docs ? this.toEntities?.(docs) : null;
  };

  async create(data: T): Promise<T> {
    const newDoc = new this.model(data);
    const savedDoc =  await newDoc.save();
    return this.toEntity(savedDoc);
  };

  async update(id: string, data: Partial<U>): Promise<T | null> {
    const updatedDoc = await this.model.findByIdAndUpdate(id, data, { new: true });
    return updatedDoc ? this.toEntity(updatedDoc) : null
  };

  async deleteById(id: string): Promise<boolean | null> {
    const deleted = await this.model.findByIdAndDelete(id);
    return deleted !== null;
  };

  async countDocs<K>(query: Record<string, K> = {}): Promise<number> {
    return await this.model.countDocuments(query);
  };
};