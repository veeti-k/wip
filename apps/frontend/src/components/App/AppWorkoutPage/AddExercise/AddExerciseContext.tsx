import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { createExercise } from "@gym/validation";

import { useModal } from "~components/_ui/Modal";
import { createCtx } from "~utils/context";

import { AddExerciseSlide } from "./Slides/AddExerciseSlide/AddExerciseSlide";
import { CreateCategorySlide } from "./Slides/CreateCategorySlide/CreateCategorySlide";
import { CreateExerciseSlide } from "./Slides/CreateExerciseSlide";

const slideIndexes = {
	addExercise: 0,
	createExercise: 1,
	createCategory: 2,
};

type Slide = {
	component: ReactNode;
	modalTitle: string;
};

type ContextType = {
	addExerciseSearchQuery: string;
	setAddExerciseSearchQuery: (query: string) => void;

	createExerciseForm: UseFormReturn<createExercise.FormType>;

	workoutId: string;

	openModal: () => void;
	closeModal: () => void;
	isModalOpen: boolean;
} & UseSlidesReturnType<typeof slideIndexes>;

const [useContextInner, Context] = createCtx<ContextType>();

export function useAddExerciseContext() {
	return useContextInner();
}

export function AddExerciseProvider({
	children,
	workoutId,
}: {
	children: ReactNode;
	workoutId: string;
}) {
	const { closeModal, isModalOpen, openModal } = useModal();
	const useSlidesReturn = useSlides({
		slideIndexes,
		slides: [
			{
				modalTitle: "Add exercise",
				component: <AddExerciseSlide />,
			},
			{
				modalTitle: "Create exercise",
				component: <CreateExerciseSlide />,
			},
			{
				modalTitle: "Create category",
				component: <CreateCategorySlide />,
			},
		],
	});

	const [addExerciseSearchQuery, setAddExerciseSearchQuery] = useState("");

	const createExerciseForm = useForm<createExercise.FormType>({
		resolver: zodResolver(createExercise.form),
	});

	return (
		<Context.Provider
			value={{
				...useSlidesReturn,

				addExerciseSearchQuery,
				setAddExerciseSearchQuery,

				createExerciseForm,
				workoutId,

				openModal,
				closeModal,
				isModalOpen,
			}}
		>
			{children}
		</Context.Provider>
	);
}

const useSlides = <Slides extends Record<string, number>>({
	slideIndexes,
	slides: incSlides,
}: {
	slideIndexes: Exclude<Slides, Record<string, never>>;
	slides: Slide[];
}) => {
	const [openSlideIndex, setOpenSlideIndex] = useState(0);
	const slideCount = Object.keys(slideIndexes).length;
	const [slides] = useState(incSlides);

	const nextSlide = () => {
		if (openSlideIndex + 1 > slideCount - 1) {
			setOpenSlideIndex(0);
		} else {
			setOpenSlideIndex(openSlideIndex + 1);
		}
	};

	const prevSlide = () => {
		if (openSlideIndex - 1 < 0) {
			setOpenSlideIndex(slideCount - 1);
		} else {
			setOpenSlideIndex(openSlideIndex - 1);
		}
	};

	const setSlide = (slide: keyof Slides) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		setOpenSlideIndex(slideIndexes[slide]!);
	};

	const getOpenSlide = () => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return slides[openSlideIndex!];
	};

	return { openSlideIndex, nextSlide, prevSlide, setSlide, getOpenSlide };
};

type UseSlidesReturnType<Slides extends Record<string, number>> = {
	openSlideIndex: number;
	nextSlide: () => void;
	prevSlide: () => void;
	setSlide: (slide: keyof Slides) => void;
	getOpenSlide: () => Slide | undefined;
};
