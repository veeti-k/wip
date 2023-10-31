export default {
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	driver: 'mysql2',
	dbCredentials: {
		connectionString: process.env.DB_URL,
	},
};
