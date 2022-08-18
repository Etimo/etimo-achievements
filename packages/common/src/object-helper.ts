import { camelToSnakeCase } from '.';

// { userId: "0756286c-198c-4b89-93a3-7e374bb7dccb" } => { user_id: "0756286c-198c-4b89-93a3-7e374bb7dccb" }
export function convertObjectKeysCamelToSnakeCase(obj: Record<string, any>): Record<string, any> {
  return Object.entries(obj).reduce((acc, [key, value]) => ({ ...acc, [camelToSnakeCase(key)]: value }), {});
}
