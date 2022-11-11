import { Model, ModelProps, OrderByDirection, PartialModelObject } from 'objection';

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
  whereIn?: { [key in ModelProps<M>]?: string[] };
  whereNotIn?: { [key in ModelProps<M>]?: string[] };
};
