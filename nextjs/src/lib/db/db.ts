import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { env } from '../env';
import * as schema from './schema';

const connection = connect({
	url: env.DB_URL,
	fetch: (url: string, init) => {
		delete init?.['cache'];
		return fetch(url, init);
	},
});
export const db = drizzle(connection, { schema });
