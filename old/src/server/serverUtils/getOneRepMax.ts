import type { DbExerciseSet, DbOneRepMax } from "~server/db/types";

export const getOneRepMax = (set: Omit<DbExerciseSet, "oneRepMax">): DbOneRepMax | null => {
	if (set.weight === null || set.reps === null) {
		return null;
	}

	return {
		epley: set.weight * (1 + set.reps / 30),
		brzycki: (set.weight * 36) / (37 - set.reps),
		mayhew: (100 * set.weight) / (52.2 + 41.9 * Math.exp(-0.055 * set.reps)),
		oconner: set.weight * (1 + set.reps / 40),
		wathen: (100 * set.weight) / (48.8 + 53.8 * Math.exp(-0.075 * set.reps)),
		lander: (100 * set.weight) / (101.3 - 2.67123 * set.reps),
		lombardi: set.weight * set.reps ** 0.1,
	};
};
