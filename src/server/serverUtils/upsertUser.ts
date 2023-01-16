import clientPromise from "~server/db/db";
import { defaultExercises } from "~server/db/defaultModelExercises";

import { uuid } from "./uuid";

export const defaultUserModelExercises = Object.entries(defaultExercises).flatMap(
	([categoryName, exercises]) =>
		exercises.map((exercise) => ({
			...exercise,
			categoryName,
		}))
);

type Props = {
	email: string;
};

export async function upsertUser({ email }: Props) {
	const mongo = await clientPromise;

	const existingUser = await mongo.users.findOne({
		email,
	});

	if (existingUser) return existingUser;

	const newUserId = uuid();

	await mongo.users.insertOne({
		id: newUserId,
		email,
		isAdmin: false,
		createdAt: new Date(),
	});

	await mongo.modelExercises.insertMany(
		defaultUserModelExercises.map((d) => ({
			id: uuid(),
			...d,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			userId: newUserId,
		}))
	);

	const mongoUser = await mongo.users.findOne({
		id: newUserId,
	});

	return mongoUser;
}
