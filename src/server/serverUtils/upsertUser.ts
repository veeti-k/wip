import { prisma } from "~server/db";
import { defaultUserCategories, defaultUserModelExercises } from "~utils/modelExerciseFields";

type Props = {
	email: string;
};

export async function upsertUser({ email }: Props) {
	return prisma.$transaction(async () => {
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			return existingUser;
		}

		const createdUser = await prisma.user.create({
			data: { email },
		});

		await prisma.category.createMany({
			data: defaultUserCategories.map((categoryName) => ({
				name: categoryName,
				ownerId: createdUser.id,
			})),
		});

		const createdCategories = await prisma.category.findMany({
			where: { ownerId: createdUser.id },
		});

		await prisma.modelExercise.createMany({
			data: defaultUserModelExercises.reduce<
				{
					name: string;
					enabledFields: bigint;
					categoryId: string;
					ownerId: string;
				}[]
			>((acc, modelExercise) => {
				const category = createdCategories.find(
					(category) => category.name === modelExercise.categoryName
				);

				if (!category) {
					return acc;
				}

				return [
					...acc,
					{
						name: modelExercise.name,
						enabledFields: modelExercise.enabledFields,
						categoryId: category.id,
						ownerId: createdUser.id,
					},
				];
			}, []),
		});

		return createdUser;
	});
}
