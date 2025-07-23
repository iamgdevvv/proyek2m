import { Badge, Group, Stack, Text, Timeline, TimelineItem, Title } from '@mantine/core'
import { CircleUser, LayoutPanelLeft, Rss } from 'lucide-react'

import FeaturedListingClient from '$blocks/featured-listing-client/server'
import ListingPost from '$blocks/listing-post/server'
import ListingTemplate from '$blocks/listing-template/server'
import ShowBlocks from '$blocks/show-blocks'
import Image from '$components/Image'
import Link from '$components/Link'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import type { SiteTemplateProps } from '$templates/site'
import { assetUrl, collectionLink } from '$utils/common'

import styles from '$styles/templates/team.module.css'

type Props = SiteTemplateProps & {
	collection: 'teams'
}

export default function TeamTemplate({ data, site }: Props) {
	const positions = data.positions?.filter((position) => typeof position === 'object') || []

	return (
		<div className="site">
			<Header site={site} />
			<main className="site-main">
				<div className="container mb-16 md:mb-24">
					<div
						className={styles.heading}
						data-gender={data.gender}
					>
						<figure className={styles.avatar}>
							<Image
								src={assetUrl(data.avatar)}
								width={120}
								height={120}
							/>
						</figure>
						<Stack
							gap={0}
							className={styles.profile}
						>
							<Badge
								variant="light"
								tt="capitalize"
								color={
									data.level === 'rookie'
										? 'lime'
										: data.level === 'builder'
											? 'orange'
											: data.level === 'leader'
												? 'blue'
												: data.level === 'mentor'
													? 'indigo'
													: 'gray'
								}
							>
								{data.level}
							</Badge>
							<Title
								size="h5"
								mt={4}
								mb={8}
							>
								{data.title}
							</Title>
							{positions.length ? (
								<Group
									component="ul"
									gap={0}
									mt={0}
									className={styles.positions}
								>
									{positions.map((position, index) => {
										if (typeof position !== 'object') return null

										return (
											<li key={`position-${position.id}`}>
												{index !== 0 ? ', ' : ''}
												<Link href={collectionLink(position.link)}>
													{position.title}
												</Link>
											</li>
										)
									})}
								</Group>
							) : null}
						</Stack>
					</div>
					{data.motivation ? (
						<Stack
							gap={0}
							mt="xl"
						>
							<Text
								component="span"
								fw={700}
							>
								Motivasi
							</Text>
							<Text>{data.motivation}</Text>
						</Stack>
					) : null}
					<Timeline
						active={2}
						bulletSize={40}
						lineWidth={2}
						mt={60}
					>
						<TimelineItem
							bullet={<CircleUser />}
							title="Klien2M"
						>
							<Text
								c="dimmed"
								size="sm"
							>
								Kontribusi dengan membangun website klien2m gratis
							</Text>
							<FeaturedListingClient
								block={{
									type: 'selectedTeams',
									selectedTeams: [data.id],
									total: 9999999,
								}}
								className="mt-6 mb-10"
							/>
						</TimelineItem>

						<TimelineItem
							bullet={<LayoutPanelLeft />}
							title="Templates"
						>
							<Text
								c="dimmed"
								size="sm"
							>
								Kontribusi dengan membangun template gratis
							</Text>
							<ListingTemplate
								block={{
									type: 'selectedTeams',
									selectedTeams: [data.id],
									total: 3,
									pagination: 'load-more',
								}}
								className="mt-6 mb-10"
							/>
						</TimelineItem>

						<TimelineItem
							bullet={<Rss />}
							lineVariant="dashed"
							title="Blog"
						>
							<Text
								c="dimmed"
								size="sm"
							>
								Kontribusi dengan menulis artikel berkualitas
							</Text>
							<ListingPost
								block={{
									type: 'createdBy',
									createdBy: [data.id],
									total: 3,
									pagination: 'load-more',
								}}
								className="mt-6 mb-10"
							/>
						</TimelineItem>
					</Timeline>
				</div>
				<ShowBlocks block={data.content} />
			</main>
			<Footer site={site} />
		</div>
	)
}
