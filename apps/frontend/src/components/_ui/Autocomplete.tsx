import { Combobox, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useEffect, useState } from "react";

import { classNames } from "~utils/classNames";

import { CheckIcon } from "./Icons/CheckIcon";
import { ChevronDown } from "./Icons/ChevronDown";
import { Input } from "./Input";

type Props<T> = {
	options?: T[];
	transform: (option: T) => { id: string; name: string };
	isLoading?: boolean;
	onSelect?: (newValue: T) => void;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	defaultValue?: string;
};

export type AutocompleteValue = {
	id: string;
	name: string;
};

export const Autocomplete = <T extends object | Array<object>>({
	transform,
	options,
	isLoading,
	onSelect,
	onChange,
	defaultValue,
}: Props<T>) => {
	const [query, setQuery] = useState(defaultValue ?? "");

	const innerGetValue = (option: T) => {
		if (isLoading) return { id: "LOADING", name: "Loading..." };
		return transform(option);
	};

	const innerOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		onChange && onChange(e);
	};

	const innerOnSelect = (newValue: T) => {
		onSelect && onSelect(newValue);
	};

	useEffect(() => {
		setQuery(defaultValue ?? "");
	}, [defaultValue]);

	const filteredOptions =
		options
			?.filter((option) =>
				innerGetValue(option).name.toLowerCase().includes(query.toLowerCase())
			)
			.sort((a, b) => sorter(innerGetValue(a), innerGetValue(b), query)) ?? [];

	return (
		<Combobox<T> onChange={innerOnSelect} disabled={isLoading}>
			<div className="relative">
				<Combobox.Input<typeof Input, T>
					as={Input}
					displayValue={(option) => innerGetValue(option).name}
					onChange={innerOnChange}
				/>

				<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
					<ChevronDown aria-hidden="true" />
				</Combobox.Button>

				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery("")}
				>
					<Combobox.Options
						className={classNames(
							"bg-primary-600 absolute mt-2 max-h-60 w-full overflow-auto rounded-md shadow-lg",
							filteredOptions.length > 0 && "py-1"
						)}
					>
						{isLoading ? (
							<Combobox.Option
								key="loading"
								className="relative cursor-default select-none py-2 pl-10 pr-4"
								value={{ id: "LOADING", name: "Loading..." }}
							>
								<span className="block truncate">Loading...</span>
							</Combobox.Option>
						) : filteredOptions.length === 0 && query !== "" ? (
							<Combobox.Option
								className={({ active }) =>
									`relative cursor-default select-none py-2 pl-10 pr-4 ${
										active ? "bg-primary-500" : ""
									}`
								}
								value={{ id: "CREATE", name: query }}
							>
								Create "{query}"
							</Combobox.Option>
						) : (
							filteredOptions.map((option) => (
								<Combobox.Option
									key={innerGetValue(option).id}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? "bg-primary-500" : ""
										}`
									}
									value={innerGetValue(option)}
								>
									{({ selected }) => (
										<>
											<span className="block truncate">
												{innerGetValue(option).name}
											</span>
											{selected && (
												<span className="absolute inset-y-0 left-0 flex items-center pl-3">
													<CheckIcon aria-hidden="true" />
												</span>
											)}
										</>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
};

const sorter = (a: { name: string }, b: { name: string }, query: string) => {
	const aStartsWithQuery = a.name.toLowerCase().startsWith(query.toLowerCase());
	const bStartsWithQuery = b.name.toLowerCase().startsWith(query.toLowerCase());

	if (aStartsWithQuery && !bStartsWithQuery) return -1;
	if (!aStartsWithQuery && bStartsWithQuery) return 1;

	return 0;
};
