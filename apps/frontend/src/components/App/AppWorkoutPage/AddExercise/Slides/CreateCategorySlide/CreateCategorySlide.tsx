import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { createCategory } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Input } from "~components/_ui/Input";

import { useAddExerciseContext } from "../../AddExerciseContext";
import { useCreateCategoryMutation } from "./useCreateCategoryMutation";

export const CreateCategorySlide = () => {
	const { createExerciseForm, setSlide } = useAddExerciseContext();

	const mutation = useCreateCategoryMutation();

	const form = useForm<createCategory.FormType>({
		resolver: zodResolver(createCategory.form),
	});

	const onSubmit = (values: createCategory.FormType) =>
		mutation
			.mutateAsync(values)
			.then((createdCategory) => {
				createExerciseForm.setValue("categoryId", createdCategory.id);
				setSlide("createExercise");
			})
			.catch((err) => toast.error(`Failed to create category ${err?.message}`));

	return (
		<form className="flex flex-col gap-3 p-4" onSubmit={form.handleSubmit(onSubmit)}>
			<Input label="Name" {...form.register("name")} />

			<div className="flex gap-3">
				<Button className="w-full" onClick={() => setSlide("createExercise")}>
					Cancel
				</Button>

				<Button
					className="w-full"
					intent="submit"
					type="submit"
					disabled={mutation.isLoading}
				>
					{mutation.isLoading ? "Creating..." : "Create"}
				</Button>
			</div>
		</form>
	);
};
