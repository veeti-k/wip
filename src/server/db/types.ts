export const dbName = "health";

export const dbCollections = {
	users: "users",
	modelExercises: "model-exercises",
	sessions: "sessions",
};

export type DbUser = {
	id: string;
	email: string;
	isAdmin: boolean;
	createdAt: Date;
};

export const dbModelExerciseEnabledFields = [
	"weight",
	"assistWeight",
	"reps",
	"time",
	"distance",
	"kcal",
] as const;

export type DbModelExerciseEnabledField = (typeof dbModelExerciseEnabledFields)[number];

export type DbModelExercise = {
	id: string;
	name: string;
	categoryName: string;
	enabledFields: DbModelExerciseEnabledField[];
	userId: string;
};

export const DbExerciseSetType = {
	Normal: 1,
	Warmup: 2,
	Superset: 3,
	Dropset: 4,
};

export type DbExerciseSet = {
	id: string;
	/**
	 * One of `DbExerciseSetType`
	 */
	type: number;
	duplicates: number;
	weight: number | null;
	assistedWeight: number | null;
	reps: number | null;
	time: number | null;
	distance: number | null;
	kcal: number | null;
};

export type DbExercise = {
	id: string;
	notes: string | null;
	modelExercise: DbModelExercise;
	userId: string;
	sets: DbExerciseSet[];
};

export type DbSession = {
	id: string;
	userId: string;
	name: string;
	notes: string | null;
	bodyWeight: number | null;
	startedAt: Date;
	stoppedAt: Date | null;
	exercises: DbExercise[];
};
