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

export const user = mysqlTable('users', {
	id: varchar('id', { length: idLength }).primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	createdAt: datetime('created_at').notNull(),
});
export type User = InferSelectModel<typeof user>;

export const usersRelations = relations(user, ({ many }) => ({
	modelExercises: many(modelExercise),
	exercises: many(exercise),
	exerciseSets: many(exerciseSet),
	workouts: many(workout),
	workoutExercises: many(workoutExercise),
	workoutExerciseSets: many(workoutExerciseSet),
}));

export const modelExercise = mysqlTable(
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

export const session = mysqlTable(
	'sessions',
	{
		id: varchar('id', { length: idLength }).primaryKey(),
		userId: varchar('user_id', { length: idLength }).notNull(),
		createdAt: datetime('created_at').notNull(),
		startedAt: datetime('started_at').notNull(),
		stoppedAt: datetime('stopped_at'),
	},
	(table) => ({
		userIdIdx: index('sessions_user_id_idx').on(table.userId),
	}),
);

export const sessionRelations = relations(session, ({ one, many }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
	exercises: many(exercise),
}));

export const exercise = mysqlTable(
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

export const exerciseRelations = relations(exercise, ({ many, one }) => ({
	exerciseSets: many(exerciseSet),
	session: one(session, {
		fields: [exercise.sessionId],
		references: [session.id],
	}),
}));

export const exerciseSet = mysqlTable(
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

export const exerciseSetRelations = relations(exerciseSet, ({ one }) => ({
	exercise: one(exercise, {
		fields: [exerciseSet.exerciseId],
		references: [exercise.id],
	}),
}));

export const workout = mysqlTable(
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

export const workoutRelations = relations(workout, ({ many }) => ({
	workoutExercises: many(workoutExercise),
}));

export const workoutExercise = mysqlTable(
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

export const workoutExerciseRelations = relations(
	workoutExercise,
	({ one, many }) => ({
		workout: one(workout, {
			fields: [workoutExercise.workoutId],
			references: [workout.id],
		}),
		workoutExerciseSets: many(workoutExerciseSet),
	}),
);

export const workoutExerciseSet = mysqlTable(
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

export const workoutExerciseSetRelations = relations(
	workoutExerciseSet,
	({ one }) => ({
		workoutExercise: one(workoutExercise, {
			fields: [workoutExerciseSet.workoutExerciseId],
			references: [workoutExercise.id],
		}),
	}),
);
