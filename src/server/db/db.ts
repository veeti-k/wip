import { MongoClient, MongoClientOptions } from "mongodb";

import { env } from "~env/server.mjs";

import { DbModelExercise, DbSession, DbUser, DbWorkout, dbCollections, dbName } from "./types";

const uri = env.MONGODB_URI;
const options: MongoClientOptions = {};

declare global {
	// eslint-disable-next-line no-var
	var _mongoClientPromise: Promise<Db> | undefined;
	// eslint-disable-next-line no-var
	var mongoInitialized: boolean;
}

let client;
let clientPromise: Promise<Db>;

if (env.ENV === "development") {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri, options);
		global._mongoClientPromise = client.connect().then((client) => initializeMongo(db(client)));
	}
	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri, options);
	clientPromise = client.connect().then((client) => initializeMongo(db(client)));
}

function initializeMongo(mongo: ReturnType<typeof db>) {
	if (global.mongoInitialized) return mongo;

	console.log("Initializing MongoDB");

	mongo.users.createIndex({ id: 1 }, { unique: true });
	mongo.users.createIndex({ email: 1 }, { unique: true });

	mongo.modelExercises.createIndex({ id: 1 }, { unique: true });

	mongo.sessions.createIndex({ id: 1 }, { unique: true });

	mongo.workouts.createIndex({ id: 1 }, { unique: true });

	global.mongoInitialized = true;
	console.log("MongoDB initialized");

	return mongo;
}

function db(mongo: MongoClient) {
	const db = mongo.db(dbName);

	return {
		users: db.collection<DbUser>(dbCollections.users),
		modelExercises: db.collection<DbModelExercise>(dbCollections.modelExercises),
		sessions: db.collection<DbSession>(dbCollections.sessions),
		workouts: db.collection<DbWorkout>(dbCollections.workouts),
	};
}

type Db = ReturnType<typeof db>;

export default clientPromise;
