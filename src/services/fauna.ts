import { Client } from 'faunadb'

export const fauna = new Client({
    secret: process.env.REACT_APP_FAUNADB_KEY as string,
    domain: 'db.us.fauna.com',
  });