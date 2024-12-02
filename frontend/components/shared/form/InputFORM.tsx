import React from 'react'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type SelectProps = {
	form: any
	name: string
	formLabel?: any
	placeholder?: string
	isTextArea?: boolean
	// All other props
	[x: string]: any
}

const InputFORM = ({ form, name, formLabel, placeholder, isTextArea = false, ...rest }: SelectProps) => {
	return (
		<FormField
			control={form?.control}
			name={name}
			render={({ field, fieldState, formState }) => (
				<FormItem>
					<FormLabel>{formLabel?.text ?? ''}</FormLabel>
					<FormControl>
						{isTextArea ? (
							<Textarea placeholder={placeholder ?? ''} {...field} {...rest} value={field.value ?? ''} />
						) : (
							<Input placeholder={placeholder ?? ''} {...field} {...rest} value={field.value ?? ''} />
						)}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default InputFORM
