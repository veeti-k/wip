export const modelExerciseFields = {
	weight: BigInt(1),
	reps: BigInt(2),
	time: BigInt(4),
	distance: BigInt(8),
	kcal: BigInt(16),
};

export function hasExerciseField(exerciseFields: bigint, field: keyof typeof modelExerciseFields) {
	const fieldAsBigInt = modelExerciseFields[field];

	return (exerciseFields & fieldAsBigInt) === fieldAsBigInt;
}
