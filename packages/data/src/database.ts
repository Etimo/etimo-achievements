import { getEnvironment, isLocal } from '@etimo-achievements/common';
import Knex, { Config } from 'knex';
import { Model } from 'objection';
const knexfile = require('./config/knexfile');

export class Database {
  private knex!: Knex;
  private static instance: Database | undefined;

  public static getOptions() {
    return this.getInstance().getOptions();
  }

  public static connect(): void {
    this.getInstance();
  }

  public static get knex(): Knex {
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
    const env = getEnvironment();
    const settings = knexfile[env];
    this.knex = Knex(settings);

    if (isLocal()) {
      console.log(`Database connection (${env}): ${JSON.stringify(settings.connection, null, 2)}`);
    }

    Model.knex(this.knex);
  }
}
