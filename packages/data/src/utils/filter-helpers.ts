import { camelToSnakeCase } from '@etimo-achievements/common';

// Convert an object filters to an object of where and whereNot objects
// { "achievementId": "x", "userId": "~y" } => { where: { "achievement_id": "x" }, whereNot: { "user_id": "y" } }
export const toWhereObject = (obj: Record<string, Record<string, any>>) => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (value.startsWith('~')) {
      return {
        ...result,
        ['whereNot']: {
          ...result['whereNot'],
          [camelToSnakeCase(key)]: value.substring(1), // remove "~" from beginning of string
        },
      };
    } else {
      return {
        ...result,
        ['where']: {
          ...result['where'],
          [camelToSnakeCase(key)]: value,
        },
      };
    }
  }, {} as { where: Record<string, Record<string, any>>; whereNot: Record<string, Record<string, any>> });
};
