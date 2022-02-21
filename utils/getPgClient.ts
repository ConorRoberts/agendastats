import { Client } from "pg";

const getPgClient = () => {
  const client = new Client({
    user: process.env.PSQL_USERNAME,
    password:process.env.PSQL_PASSWORD,
    host: process.env.PSQL_HOST,
    port: +process.env.PSQL_PORT,
    database: process.env.PSQL_DB
  });

  return client;
};

export default getPgClient;
