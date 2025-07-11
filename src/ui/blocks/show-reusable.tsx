'use client'
import { type HTMLAttributes } from 'react'

import type { ShowReusable as ShowReusableBlock } from '$payload-types'
import ShowBlocks from './show-blocks'

export type ShowReusableProps = {
	block: ShowReusableBlock
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ShowReusable({ block, ...props }: ShowReusableProps) {
	if (!block.reusable || typeof block.reusable !== 'object') return null

	return (
		<ShowBlocks
			{...props}
			block={block.reusable.content}
		/>
	)
}
