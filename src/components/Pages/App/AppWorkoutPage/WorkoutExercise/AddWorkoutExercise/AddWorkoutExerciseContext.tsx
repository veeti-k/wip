import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode, RefObject } from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { useModal } from "~components/Ui/Modal";
import { createCtx } from "~utils/context";
import {
	CreateExerciseFormType,
	createExerciseFormSchema,
} from "~validation/exercise/createExercise";

import { AddWorkoutExerciseSlide } from "./Slides/AddWorkoutExerciseSlide/AddWorkoutExerciseSlide";
import { CreateModelExerciseSlide } from "./Slides/CreateModelExerciseSlide/CreateModelExerciseSlide";

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
	addWorkoutExerciseSearchQuery: string;
	setAddWorkoutExerciseSearchQuery: (query: string) => void;

	createExerciseForm: UseFormReturn<CreateExerciseFormType>;

	workoutId: string;

	scrollToLastExercise: () => void;

	openModal: () => void;
	closeModal: () => void;
	isModalOpen: boolean;
} & UseSlidesReturnType<typeof slideIndexes>;

const [useContextInner, Context] = createCtx<ContextType>();

export function useAddWorkoutExerciseContext() {
	return useContextInner();
}

export function AddWorkoutExerciseProvider({
	children,
	workoutId,
	lastExerciseRef,
}: {
	children: ReactNode;
	workoutId: string;
	lastExerciseRef: RefObject<HTMLDivElement>;
}) {
	const { closeModal, isModalOpen, openModal } = useModal();
	const useSlidesReturn = useSlides({
		slideIndexes,
		slides: [
			{
				modalTitle: "Add exercise",
				component: <AddWorkoutExerciseSlide />,
			},
			{
				modalTitle: "Create exercise",
				component: <CreateModelExerciseSlide />,
			},
		],
	});

	const [addWorkoutExerciseSearchQuery, setAddWorkoutExerciseSearchQuery] = useState("");

	const createExerciseForm = useForm<CreateExerciseFormType>({
		resolver: zodResolver(createExerciseFormSchema),
	});

	const scrollToLastExercise = () => {
		console.log(lastExerciseRef.current, "scroll");

		setTimeout(
			() => lastExerciseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
			250
		);
	};

	return (
		<Context.Provider
			value={{
				...useSlidesReturn,

				addWorkoutExerciseSearchQuery,
				setAddWorkoutExerciseSearchQuery,

				createExerciseForm,
				workoutId,

				scrollToLastExercise,

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
		return slides[openSlideIndex];
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
