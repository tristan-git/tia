import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
	'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px]  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
				secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
				outline: 'text-foreground',

				// CUSTOM VARIANT
				blue: 'border-transparent bg-blue-500 text-white',
				green: 'border-transparent bg-green-500 text-white',
				greenOutlined: 'text-green-500 border-green-500',
				yellow: 'border-transparent bg-yellow-500 text-black',
				purple: 'border-transparent bg-purple-500 text-white',
				red: 'border-transparent bg-red-500 text-white',
				gray: 'border-transparent bg-gray-500 text-white',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
