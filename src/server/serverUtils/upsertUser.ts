import clientPromise from "~server/db/db";
import { defaultExercises } from "~server/db/defaultModelExercises";

export const defaultUserModelExercises = Object.entries(defaultExercises).flatMap(
	([categoryName, exercises]) =>
		exercises.map((exercise) => ({
			...exercise,
			categoryName,
			enabledFields: exercise.enabledFields,
		}))
);

type Props = {
	email: string;
};

export async function upsertUser({ email }: Props) {
	const mongo = await clientPromise;

	const mongoUser = await mongo.users.findOneAndUpdate(
		{ email },
		{
			$setOnInsert: {
				email,
				isAdmin: false,
				createdAt: new Date(),
			},
		},
		{ upsert: true, returnDocument: "after" }
	);

	if (!mongoUser.value) throw new Error("MongoDB error");

	await mongo.modelExercises.insertMany(
		defaultUserModelExercises.map((d) => ({
			...d,
			enabledFields: d.enabledFields,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			userId: mongoUser.value!._id.toString(),
		}))
	);

	return mongoUser.value;
}
