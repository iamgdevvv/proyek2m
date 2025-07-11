'use client'
import { Badge, Group, Skeleton, Title } from '@mantine/core'
import { ArrowUpRight } from 'lucide-react'
import { useId, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import type { Template } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import stylesTemplateTile from '$styles/layouts/template-tile.module.css'

export type TemplateTileProps = {
	data: Pick<Template, 'title' | 'link' | 'services' | 'featuredImage'>
} & HTMLAttributes<HTMLDivElement>

export function TemplateTile({ data, ...props }: TemplateTileProps) {
	const compId = useId()

	return (
		<div
			{...props}
			className={cx(stylesTemplateTile.tile, props.className)}
		>
			<Link
				href={collectionLink(data.link)}
				className={stylesTemplateTile.inner}
			>
				<Image
					src={data.featuredImage}
					width={565}
					height={354}
					className={stylesTemplateTile.thumbnail}
				/>
				{data.services && data.services.length > 0 ? (
					<Group
						gap="xs"
						className={stylesTemplateTile.services}
					>
						{data.services.map((service) => {
							if (typeof service !== 'object') {
								return null
							}

							return (
								<Badge key={`${compId}-service-${service.id}`}>
									{service.title}
								</Badge>
							)
						})}
					</Group>
				) : null}
				<Title
					order={5}
					mb="sm"
					className={stylesTemplateTile.title}
				>
					{data.title}
				</Title>

				<div className={stylesTemplateTile.icon}>
					<ArrowUpRight />
				</div>
			</Link>
		</div>
	)
}

export function SkeletonTemplateTile(props: Partial<TemplateTileProps>) {
	return (
		<Skeleton
			{...props}
			className={cx(stylesTemplateTile.tile, props.className)}
		>
			<div className={stylesTemplateTile.inner} />
		</Skeleton>
	)
}
