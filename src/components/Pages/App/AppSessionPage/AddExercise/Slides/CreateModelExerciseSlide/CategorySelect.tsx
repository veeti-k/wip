import { Select } from "~components/Ui/Select";
import type { RouterOutputs } from "~utils/trpc";

import { useAddExerciseContext } from "../../AddExerciseContext";

type Props = {
	exerciseCategories: RouterOutputs["modelExercise"]["getAll"];
};
export function CategorySelect({ exerciseCategories }: Props) {
	const { createExerciseForm: form } = useAddExerciseContext();

	return (
		<Select
			label="Category"
			required
			error={form.formState.errors.categoryName?.message}
			{...form.register("categoryName")}
		>
			<option value="">Select category</option>

			{exerciseCategories.map((category) => (
				<option key={category.categoryName} value={category.categoryName}>
					{category.categoryName}
				</option>
			))}
		</Select>
	);
}
