import Knex, { Config } from 'knex';
import { Model } from 'objection';
const knexfile = require('./config/knexfile');

export class Database {
  private knex!: Knex;
  private static instance: Database | undefined;

  public static getOptions() {
    return this.getInstance().getOptions();
  }

  public static getKnexInstance(): Knex {
    return this.getInstance().knex;
  }

  public static async shutdown(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.instance = undefined;
    }
  }

  private static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.init();
    }
    return Database.instance;
  }

  public getOptions(): Config {
    const env = process.env.NODE_ENV || 'development';

    return knexfile[env];
  }

  public async close() {
    await this.knex.destroy();
  }

  private init(): void {
    const env = process.env.NODE_ENV || 'development';

    this.knex = Knex(knexfile[env]);

    Model.knex(this.knex);
  }
}
