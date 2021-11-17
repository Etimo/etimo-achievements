export function createOnUpdateTrigger(table: string) {
  return `CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();`;
}

export function dropOnUpdateTrigger(table: string) {
  return `DROP TRIGGER ${table}_updated_at ON ${table};`;
}
