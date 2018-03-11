import keys from '../../config/keys';

const { Client } = require('pg');

export async function queryOne(q, vals) {
  const client = new Client({ connectionString: keys.databaseUrl });
  await client.connect();
  const res = await client.query(q, vals);
  await client.end();
  return res.rows[0];
}

export async function queryNone(q, vals) {
  const client = new Client({ connectionString: keys.databaseUrl });
  await client.connect();
  await client.query(q, vals);
  await client.end();
}

export async function queryAll(q, vals) {
  const client = new Client({ connectionString: keys.databaseUrl });
  await client.connect();
  const res = await client.query(q, vals);
  await client.end();
  return res.rows;
}
