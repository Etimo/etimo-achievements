import { camelToSnakeCase } from '@etimo-achievements/common';
import Knex, { Transaction } from 'knex';
import Objection, { Model, ModelClass, ModelProps, OrderByDirection, PartialModelObject } from 'objection';
import { catchErrors } from '../utils';

export function getIdFromModel<M extends Model>(modelClass: ModelClass<M>, model: any): string | string[] {
  if (Array.isArray(modelClass.idColumn)) return modelClass.idColumn.map((key) => model[key]);
  return model[modelClass.idColumn];
}

export type PartialModel<M extends Model> = Omit<PartialModelObject<M>, 'QueryBuilderType'>;
export type CreateData<M extends Model> = Omit<PartialModel<M>, 'id' | 'createdAt' | 'updatedAt'>;
export type FindOptions<M extends Model> = Pick<RepositoryOptions<M>, 'where' | 'skip' | 'take' | 'orderBy'>;
export type CountOptions<M extends Model> = Pick<FindOptions<M>, 'where'>;
export type FindByIdOptions<M extends Model> = Omit<FindOptions<M>, 'where'>;
export type UpdateOptions<M extends Model> = Pick<RepositoryOptions<M>, 'where'>;
export type DeleteOptions<M extends Model> = UpdateOptions<M>;

export type RepositoryOptions<M extends Model> = {
  skip?: number;
  take?: number;
  orderBy?: [ModelProps<M>, OrderByDirection][] | [string, OrderByDirection][];
  where?: PartialModel<M>;
};

export function queryBuilder<M extends Model>(query: Objection.QueryBuilderType<M>, options: RepositoryOptions<M>) {
  const { orderBy, skip, take, where } = options;
  skip && query.offset(skip);
  take && query.limit(take);
  if (where) {
    const w = Object.entries(where).reduce((res, [key, value]) => ({ ...res, [camelToSnakeCase(key)]: value }), {});
    query.where(w);
  }

  orderBy &&
    orderBy!.forEach(([key, order]) => query.orderBy(camelToSnakeCase(key as string), order as OrderByDirection));

  return query;
}

export abstract class BaseRepository<M extends Model> {
  protected model: ModelClass<M>;
  protected getId = (model: Partial<M>) => getIdFromModel(this.model, model);
  private trx?: Transaction;

  constructor(model: M, knex: Knex, transaction?: Knex.Transaction) {
    this.model = model.$modelClass.bindKnex(knex);
    this.trx = transaction;
  }

  protected async $count(options: CountOptions<M>): Promise<number> {
    return catchErrors(async () => {
      const result = await queryBuilder(this.model.query(), { where: options.where }).count();
      return (result[0] as any)['count'];
    });
  }

  protected async $getAll() {
    return catchErrors(async () => {
      return queryBuilder(this.model.query(), {}).where({}) as any;
    });
  }

  protected async $findById(id: string): Promise<M> {
    return catchErrors(async () => {
      return queryBuilder(this.model.query(), {}).findById(id) as any;
    });
  }

  protected async $findByIds(ids: string[], options: FindByIdOptions<M>) {
    return catchErrors(async () => {
      return queryBuilder(this.model.query(), options).findByIds(ids) as any;
    });
  }

  protected async $find(options: FindOptions<M>) {
    return catchErrors(async () => {
      return queryBuilder(this.model.query(), options) as any;
    });
  }

  protected async $create(data: CreateData<M>) {
    return catchErrors(async () => {
      return this.model.query().insert(data) as any;
    });
  }

  protected async $update(data: Partial<M>, options?: UpdateOptions<M>): Promise<number> {
    return catchErrors(async () => {
      const id = this.getId(data);
      if (!options && !id) throw new Error('Cannot update without id or options');
      if (id && !options) return this.model.query(this.trx).findById(id).patch(data);
      return queryBuilder(this.model.query(this.trx), options!).patch(data) as any;
    });
  }

  protected async $delete(options: DeleteOptions<M>): Promise<number> {
    return catchErrors(async () => {
      return queryBuilder(this.model.query(this.trx), options).delete() as any;
    });
  }
}

// class UserRepository extends BaseRepository<UserModel> {
//   constructor(transaction?: Knex.Transaction) {
//     super(new UserModel(), Database.knex, transaction);
//   }

//   public $findById(id: string) {
//     return super.$findById(id);
//   }

//   public $findByIds(ids: string[], options: FindByIdOptions<UserModel>) {
//     return super.$findByIds(ids, options);
//   }

//   public $find(options: FindOptions<UserModel>): Promise<Objection.Model[]> {
//     return super.$find(options);
//   }

//   public $update(data: Partial<UserModel>, options?: UpdateOptions<UserModel>) {
//     return super.$update(data, options);
//   }

//   public $delete(options: DeleteOptions<UserModel>) {
//     return super.$delete(options);
//   }

//   public $create(data: CreateData<UserModel>) {
//     return super.$create(data);
//   }
// }

// const a = new UserRepository();
// a.$find({ where: { id: '1' } });
// a.$update({}, { where: {} });
