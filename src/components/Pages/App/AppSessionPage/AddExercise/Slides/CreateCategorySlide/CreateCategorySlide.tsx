import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~components/Ui/Button";
import { Input } from "~components/Ui/Input";
import { errorMsg } from "~utils/errorMsg";
import {
	CreateCategoryFormType,
	createCategoryFormSchema,
} from "~validation/exercise/createCategory";

import { useAddExerciseContext } from "../../AddExerciseContext";
import { useCreateCategoryMutation } from "./useCreateCategoryMutation";

export function CreateCategorySlide() {
	const { createExerciseForm, setSlide } = useAddExerciseContext();

	const mutation = useCreateCategoryMutation();

	const form = useForm<CreateCategoryFormType>({
		resolver: zodResolver(createCategoryFormSchema),
	});

	function onSubmit(values: CreateCategoryFormType) {
		return mutation
			.mutateAsync(values)
			.then((createdCategory) => {
				createExerciseForm.setValue("categoryId", createdCategory.id);
				setSlide("createExercise");
			})
			.catch(errorMsg("Failed to create category"));
	}

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
}
