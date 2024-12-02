import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

type SelectProps = {
	form: any
	name: string
	formLabel?: any
	placeholder?: string
	selectGroup: any
}

const SelectFORM = ({ form, name, formLabel, placeholder, selectGroup }: SelectProps) => {
	return (
		<FormField
			control={form?.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{formLabel?.text ?? ''}</FormLabel>

					<Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
						<FormControl>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder={placeholder ?? ''} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{selectGroup?.groups.map(({ selectLabelText, values }: any, indexSelectGroup: number) => (
								<SelectGroup key={`SelectGroupKey-${indexSelectGroup}`}>
									<SelectLabel>{selectLabelText ?? ''}</SelectLabel>

									{values?.map(({ value, text }: any, indexItem: number) => (
										<SelectItem value={value} key={`SelectGroupKey-${indexItem}`}>
											{text}
										</SelectItem>
									))}
								</SelectGroup>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default SelectFORM
