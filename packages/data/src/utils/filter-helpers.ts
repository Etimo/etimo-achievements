import { convertObjectKeysCamelToSnakeCase } from '@etimo-achievements/common';
import { isEmpty, pick } from 'lodash';
import Objection, { Model } from 'objection';

const applyWhereFilters = <M extends Model>(
  query: Objection.QueryBuilder<M, M[]>,
  filters: Partial<Record<string, any>> | undefined,
  params: string[]
) => {
  const sanitizedObj = pick(filters ?? {}, params);
  const where = convertObjectKeysCamelToSnakeCase(sanitizedObj);

  if (!isEmpty(where)) query.where(where);
};

export const applyWhereFiltersFnCreator =
  <M extends Model>(params: string[]) =>
  (query: Objection.QueryBuilder<M, M[]>, filters: Partial<Record<string, any>> | undefined) =>
    applyWhereFilters(query, filters, params);
