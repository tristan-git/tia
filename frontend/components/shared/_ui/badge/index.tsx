import React from 'react'
import { Badge, BadgeProps } from '@/components/ui/badge'

type CustomBadgeProps = {
	text: string
	variant?: BadgeProps['variant']
}

const CustomBadge = ({ text, variant = 'default' }: CustomBadgeProps) => {
	return <Badge variant={variant} className='text-nowrap'>{text}</Badge>
}

export default CustomBadge
