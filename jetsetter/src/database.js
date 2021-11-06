import 'sqlite3';
import knex from 'knex';
import * as path from 'path';

export const database = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(
      process.argv.find(arg => arg.includes('--user-data-dir')).split('--user-data-dir=')[1],
      'jetsetter-items.sqlite'
    ),
  },
  useNullAsDefault: true,
});

database.schema.hasTable('items').then(exists => {
  if (!exists) {
    return database.schema.createTable('items', t => {
      t.increments('id').primary();
      t.string('value', 100);
      t.boolean('packed');
    });
  }
});
