import { camelToSnakeCase, convertObjectKeysCamelToSnakeCase } from '@etimo-achievements/common';
import Objection, { Model, OrderByDirection } from 'objection';
import { RepositoryOptions } from '../repositories/base-repository';

export function queryBuilder<M extends Model>(query: Objection.QueryBuilderType<M>, options: RepositoryOptions<M>) {
  const { orderBy, skip, take, where } = options;
  skip && query.offset(skip);
  take && query.limit(take);
  if (where) {
    const w = convertObjectKeysCamelToSnakeCase(where);
    query.where(w);
  }

  orderBy &&
    orderBy!.forEach(([key, order]) => query.orderBy(camelToSnakeCase(key as string), order as OrderByDirection));

  return query;
}
