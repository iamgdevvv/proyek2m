'use client'
import { Button, Text, Title } from '@mantine/core'
import { ArrowUpRight } from 'lucide-react'
import { type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import { useRouter } from '$hooks/use-router'
import type { Service } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import stylesServiceGrid from '$styles/layouts/service-grid.module.css'

export type ServiceGridProps = {
	data: Pick<Service, 'title' | 'link' | 'excerpt' | 'featuredImage'>
} & HTMLAttributes<HTMLDivElement>

export function ServiceGrid({ data, ...props }: ServiceGridProps) {
	const router = useRouter()

	return (
		<div
			{...props}
			className={cx(stylesServiceGrid.grid, props.className)}
			onClick={(e) => {
				if (props.onClick) {
					props.onClick(e)
				} else {
					router.push(collectionLink(data.link))
				}
			}}
		>
			<Title
				order={5}
				mb="sm"
				className={stylesServiceGrid.title}
			>
				{data.title}
			</Title>
			<Image
				src={data.featuredImage}
				width={364}
				height={244}
				className={stylesServiceGrid.thumbnail}
			/>

			{data.excerpt ? (
				<Text
					size="sm"
					c="dimmed"
					mt="md"
					lineClamp={6}
				>
					{data.excerpt}
				</Text>
			) : null}

			<Button
				component={Link}
				href={collectionLink(data.link)}
				variant="subtle"
				rightSection={<ArrowUpRight />}
				mt="lg"
				ml="auto"
			>
				Baca selengkapnya
			</Button>
		</div>
	)
}

export function SkeletonServiceGrid(props: Partial<ServiceGridProps>) {
	return (
		<div
			{...props}
			className={cx(stylesServiceGrid.grid, props.className)}
		></div>
	)
}
