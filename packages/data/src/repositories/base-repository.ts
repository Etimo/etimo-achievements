import Knex, { Transaction } from 'knex';
import { Model, ModelClass } from 'objection';
import { CountOptions, CreateData, DeleteOptions, FindByIdOptions, FindOptions, UpdateOptions } from '../types';
import { catchErrors, queryBuilder } from '../utils';

export function getIdFromModel<M extends Model>(modelClass: ModelClass<M>, model: any): string | string[] {
  if (Array.isArray(modelClass.idColumn)) return modelClass.idColumn.map((key) => model[key]);
  return model[modelClass.idColumn];
}

export abstract class BaseRepository<M extends Model> {
  protected model: ModelClass<M>;
  protected getId = (model: Partial<M>) => getIdFromModel(this.model, model);
  protected trx?: Transaction;

  constructor(model: M, knex: Knex, transaction?: Knex.Transaction) {
    this.model = model.$modelClass.bindKnex(knex);
    this.trx = transaction;
  }

  protected $get(options?: FindOptions<M>): Promise<M[]> {
    return catchErrors(() => {
      return queryBuilder(this.model.query(), options ?? {}) as any;
    });
  }

  protected $getBy(filter: Partial<M>, options?: FindOptions<M>): Promise<M[]> {
    return catchErrors(() => {
      return queryBuilder(this.model.query().where(filter), options ?? {}) as any;
    });
  }

  protected $getByIds(ids: (string | string[])[], options?: FindByIdOptions<M>): Promise<M[]> {
    return catchErrors(() => {
      return queryBuilder(this.model.query(), options ?? {}).findByIds(ids) as any;
    });
  }

  protected $findById(id: string | string[]): Promise<M> {
    return catchErrors(() => {
      return queryBuilder(this.model.query(), {}).findById(id) as any;
    });
  }

  protected $findOneBy(filter: Partial<M>, options?: FindOptions<M>): Promise<M> {
    return catchErrors(() => {
      return queryBuilder(this.model.query().where(filter), options ?? {}).first() as any;
    });
  }

  protected $create(data: CreateData<M>): Promise<M> {
    return catchErrors(() => {
      return this.model.query(this.trx).insert(data) as any;
    });
  }

  public count(options: CountOptions<M>): Promise<number> {
    return catchErrors(async () => {
      const result = await queryBuilder(this.model.query(), { where: options.where }).count();
      return (result[0] as any)['count'];
    });
  }

  public countBy(filter: Partial<M>, options: CountOptions<M>): Promise<number> {
    return catchErrors(async () => {
      const result = await queryBuilder(this.model.query().where(filter), { where: options.where }).count();
      return (result[0] as any)['count'];
    });
  }

  public exists(options: CountOptions<M>): Promise<boolean> {
    return catchErrors(async () => {
      const result = await queryBuilder(this.model.query(), { where: options.where }).count();
      return (result[0] as any)['count'] > 0;
    });
  }

  public existsBy(filter: Partial<M>, options: CountOptions<M>): Promise<boolean> {
    return catchErrors(async () => {
      const result = await queryBuilder(this.model.query().where(filter), { where: options.where }).count();
      return (result[0] as any)['count'] > 0;
    });
  }

  public update(partialModel: Partial<M>, options?: UpdateOptions<M>): Promise<number> {
    return catchErrors(() => {
      const id = this.getId(partialModel);
      if (!options && !id) throw new Error('Cannot update object without id or options');
      if (id) return this.model.query(this.trx).findById(id).patch(partialModel);

      return queryBuilder(this.model.query(this.trx), options ?? {}).patch(partialModel);
    });
  }

  public updateById(id: string | string[], partialModel: Partial<M>): Promise<number> {
    return catchErrors(() => {
      return this.model.query(this.trx).findById(id).patch(partialModel);
    });
  }

  public updateBy(filter: Partial<M>, partialModel: Partial<M>): Promise<number> {
    return catchErrors(() => {
      return this.model.query(this.trx).where(filter).patch(partialModel);
    });
  }

  public delete(options: DeleteOptions<M>): Promise<number> {
    return catchErrors(() => {
      return queryBuilder(this.model.query(this.trx), options as any).delete();
    });
  }

  public deleteById(id: string | string[]): Promise<number> {
    return catchErrors(() => {
      return this.model.query(this.trx).deleteById(id);
    });
  }

  public deleteBy(filter: Partial<M>): Promise<number> {
    return catchErrors(() => {
      return this.model.query(this.trx).where(filter).delete();
    });
  }
}
