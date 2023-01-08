export const modelExerciseFields = {
	weight: BigInt(1),
	assistWeight: BigInt(2),
	reps: BigInt(8),
	time: BigInt(16),
	distance: BigInt(32),
	kcal: BigInt(64),
};

export function hasExerciseField(exerciseFields: bigint, field: keyof typeof modelExerciseFields) {
	const fieldAsBigInt = modelExerciseFields[field];

	return (exerciseFields & fieldAsBigInt) === fieldAsBigInt;
}
