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

type DefaultExercise = {
	name: string;
	enabledFields: (keyof typeof modelExerciseFields)[];
};

type DefaultExercises = Record<string, DefaultExercise[]>;

const defaultExercises: DefaultExercises = {
	Abs: [
		{
			name: "Crunches",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Leg raises",
			enabledFields: ["weight", "reps"],
		},
	],
	Back: [
		{
			name: "Assisted chin up",
			enabledFields: ["assistWeight", "reps"],
		},
		{
			name: "Assisted pull up",
			enabledFields: ["assistWeight", "reps"],
		},
		{
			name: "Barbell row",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Cable row",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Chin up",
			enabledFields: ["reps"],
		},
		{
			name: "Deadlift",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Dumbbell row",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Hyperextensions",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Pull up",
			enabledFields: ["reps"],
		},
		{
			name: "Pulldowns",
			enabledFields: ["weight", "reps"],
		},
	],
	Biceps: [
		{
			name: "Barbell bicep curl",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Concentration curl",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Dumbbell bicep curl",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Hammer curl",
			enabledFields: ["weight", "reps"],
		},
	],
	Cardio: [
		{
			name: "Cycling",
			enabledFields: ["distance", "time", "kcal"],
		},
		{
			name: "Eliptical trainer",
			enabledFields: ["distance", "time", "kcal"],
		},
		{
			name: "Rowing machine",
			enabledFields: ["distance", "time", "kcal"],
		},
		{
			name: "Running",
			enabledFields: ["distance", "time", "kcal"],
		},
		{
			name: "Treadmill",
			enabledFields: ["distance", "time", "kcal"],
		},
		{
			name: "Walking",
			enabledFields: ["distance", "time", "kcal"],
		},
	],
	Chest: [
		{
			name: "Bench press",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Cable crossovers",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Dumbbell flies",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Dumbbell press",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Incline bench press",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Incline dumbbell press",
			enabledFields: ["weight", "reps"],
		},
	],
	Legs: [
		{
			name: "Calf raises",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Front squat",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Leg curls",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Leg extensions",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Leg press",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Lunges",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Seated calf raises",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Squat",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Straight leg deadlifts",
			enabledFields: ["weight", "reps"],
		},
	],
	Shoulders: [
		{
			name: "Dumbbell lateral raises",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Military press",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Shoulder dumbbell press",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Upright rows",
			enabledFields: ["weight", "reps"],
		},
	],
	Triceps: [
		{
			name: "Assisted dips",
			enabledFields: ["assistWeight", "reps"],
		},
		{
			name: "Close grip bench press",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Dips",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Pushdowns",
			enabledFields: ["weight", "reps"],
		},
		{
			name: "Triceps extensions",
			enabledFields: ["weight", "reps"],
		},
	],
};

export const defaultUserCategories = Object.entries(defaultExercises).map(([name]) => name);
export const defaultUserModelExercises = Object.entries(defaultExercises).flatMap(
	([categoryName, exercises]) =>
		exercises.map((exercise) => ({
			...exercise,
			categoryName,
			enabledFields: exercise.enabledFields.reduce(
				(acc, curr) => acc | modelExerciseFields[curr],
				BigInt(0)
			),
		}))
);
