import { relations, type InferSelectModel } from 'drizzle-orm';
import {
	bigint,
	boolean,
	datetime,
	float,
	index,
	int,
	mysqlTable,
	text,
	varchar,
} from 'drizzle-orm/mysql-core';

const idLength = 26;

export const dbUser = mysqlTable('users', {
	id: varchar('id', { length: idLength }).primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	createdAt: datetime('created_at').notNull(),
});
export type DbUser = InferSelectModel<typeof dbUser>;

export const dbUserRelations = relations(dbUser, ({ many }) => ({
	authSessions: many(dbAuthSession),
	modelExercises: many(dbModelExercise),
	exercises: many(dbExercise),
	exerciseSets: many(dbExerciseSet),
	workouts: many(dbWorkout),
	workoutExercises: many(dbWorkoutExercise),
	workoutExerciseSets: many(dbWorkoutExerciseSet),
}));

export const dbAuthSession = mysqlTable('auth_sessions', {
	id: varchar('id', { length: idLength }).primaryKey(),
	userId: varchar('user_id', { length: idLength }).notNull(),
	createdAt: datetime('created_at').notNull(),
});

export const dbAuthSessionRelations = relations(dbAuthSession, ({ one }) => ({
	user: one(dbUser, {
		fields: [dbAuthSession.userId],
		references: [dbUser.id],
	}),
}));

export const dbModelExercise = mysqlTable(
	'model_exercises',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		categoryName: varchar('category_name', { length: 255 }).notNull(),
		enabledFields: bigint('enabled_fields', { mode: 'number' }).notNull(),
	},
	(table) => ({
		userIdIdx: index('model_exercises_user_id_idx').on(table.userId),
	}),
);

export const dbModelExerciseRelations = relations(
	dbModelExercise,
	({ one }) => ({
		user: one(dbUser, {
			fields: [dbModelExercise.userId],
			references: [dbUser.id],
		}),
	}),
);

export const dbSession = mysqlTable(
	'sessions',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		createdAt: datetime('created_at').notNull(),
		startedAt: datetime('started_at').notNull(),
		stoppedAt: datetime('stopped_at'),
	},
	(table) => ({
		userIdIdx: index('sessions_user_id_idx').on(table.userId),
	}),
);
export type DbSession = InferSelectModel<typeof dbSession>;

export const dbSessionsRelations = relations(dbSession, ({ one, many }) => ({
	user: one(dbUser, {
		fields: [dbSession.userId],
		references: [dbUser.id],
	}),
	exercises: many(dbExercise),
}));

export const dbExercise = mysqlTable(
	'exercises',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		sessionId: varchar('session_id', { length: idLength }).notNull(),
		createdAt: datetime('created_at').notNull(),
		notes: text('notes'),
		name: varchar('name', { length: 255 }).notNull(),
		categoryName: varchar('category_name', { length: 255 }).notNull(),
		enabledFields: bigint('enabled_fields', { mode: 'number' }).notNull(),
	},
	(table) => ({
		userIdIdx: index('exercises_user_id_idx').on(table.userId),
	}),
);

export const dbExerciseRelations = relations(dbExercise, ({ many, one }) => ({
	exerciseSets: many(dbExerciseSet),
	session: one(dbSession, {
		fields: [dbExercise.sessionId],
		references: [dbSession.id],
	}),
	user: one(dbUser, {
		fields: [dbExercise.userId],
		references: [dbUser.id],
	}),
}));

export const dbExerciseSet = mysqlTable(
	'exercise_sets',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		exerciseId: varchar('exercise_id', { length: idLength }).notNull(),
		createdAt: datetime('created_at').notNull(),
		type: int('type').notNull(),
		count: float('count').notNull(),
		weight: float('weight'),
		assistedWeight: float('assisted_weight'),
		reps: float('reps'),
		time: float('time'),
		distance: float('distance'),
		kcal: float('kcal'),
		oneRepMax: float('one_rep_max'),
	},
	(table) => ({
		userIdIdx: index('exercise_sets_user_id_idx').on(table.userId),
	}),
);

export const dbExerciseSetRelations = relations(dbExerciseSet, ({ one }) => ({
	exercise: one(dbExercise, {
		fields: [dbExerciseSet.exerciseId],
		references: [dbExercise.id],
	}),
	user: one(dbUser, {
		fields: [dbExerciseSet.userId],
		references: [dbUser.id],
	}),
}));

export const dbWorkout = mysqlTable(
	'workouts',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		createdAt: datetime('created_at').notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		isPublic: boolean('is_public').notNull(),
	},
	(table) => ({
		userIdIdx: index('workouts_user_id_idx').on(table.userId),
	}),
);

export const dbWorkoutRelations = relations(dbWorkout, ({ many, one }) => ({
	workoutExercises: many(dbWorkoutExercise),
	user: one(dbUser, {
		fields: [dbWorkout.userId],
		references: [dbUser.id],
	}),
}));

export const dbWorkoutExercise = mysqlTable(
	'workout_exercises',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		workoutId: varchar('workout_id', { length: idLength }).notNull(),
		createdAt: datetime('created_at').notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		categoryName: varchar('category_name', { length: 255 }).notNull(),
		enabledFields: bigint('enabled_fields', { mode: 'number' }).notNull(),
	},
	(table) => ({
		userIdIdx: index('workout_exercises_user_id_idx').on(table.userId),
	}),
);

export const dbWorkoutExerciseRelations = relations(
	dbWorkoutExercise,
	({ one, many }) => ({
		workout: one(dbWorkout, {
			fields: [dbWorkoutExercise.workoutId],
			references: [dbWorkout.id],
		}),
		workoutExerciseSets: many(dbWorkoutExerciseSet),
		user: one(dbUser, {
			fields: [dbWorkoutExercise.userId],
			references: [dbUser.id],
		}),
	}),
);

export const dbWorkoutExerciseSet = mysqlTable(
	'workout_exercise_sets',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		workoutExerciseId: varchar('workout_exercise_id', {
			length: idLength,
		}).notNull(),
		createdAt: datetime('created_at').notNull(),
		type: int('type').notNull(),
		count: float('count').notNull(),
		weight: float('weight'),
		assistedWeight: float('assisted_weight'),
		reps: float('reps'),
		time: float('time'),
		distance: float('distance'),
		kcal: float('kcal'),
		oneRepMax: float('one_rep_max'),
	},
	(table) => ({
		userIdIdx: index('workout_exercise_sets_user_id_idx').on(table.userId),
	}),
);

export const dbWorkoutExerciseSetRelations = relations(
	dbWorkoutExerciseSet,
	({ one }) => ({
		workoutExercise: one(dbWorkoutExercise, {
			fields: [dbWorkoutExerciseSet.workoutExerciseId],
			references: [dbWorkoutExercise.id],
		}),
		user: one(dbUser, {
			fields: [dbWorkoutExerciseSet.userId],
			references: [dbUser.id],
		}),
	}),
);
