import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { logger } from '$modules/logger'
import {
	slugClient,
	slugHomepage,
	slugPost,
	slugReusable,
	slugService,
	slugTeam,
	slugTemplates,
} from '$modules/vars'
import { generateMeta } from '$payload-libs/meta-utils'
import {
	getAuthUser,
	getSiteGlobal,
	pageSitemap,
	serviceSitemap,
	templateSitemap,
} from '$payload-libs/server/repos'
import type { Client, Page, Post, PostCategory, Team, Template } from '$payload-types'
import { seoSchema } from '$seo/index'
import {
	clientLoader,
	pageLoader,
	postCategoryLoader,
	postLoader,
	reusableLoader,
	serviceLoader,
	teamLoader,
	teamPositionLoader,
	templateLoader,
} from '$server-functions/loader'
import SiteTemplate from '$templates/site'
import type { Queried } from '$type'

type Args = {
	params: Promise<{
		slug?: string[]
	}>
}

export const dynamic = 'force-static'
export const revalidate = 3600
export const dynamicParams = true

export default async function Page({ params: paramsPromise }: Args) {
	const { isEnabled: draft } = await draftMode()
	const { slug } = await paramsPromise

	if (slug) {
		// Don't generate metadata for Admin routes, API routes and public files
		if (
			slug[0] === 'admin' ||
			slug[0] === '_next' ||
			slug[0] === 'lib' ||
			slug[0] === '.well-known' ||
			slug[0] === 'api' ||
			slug.join('/').includes('.')
		) {
			return redirect('/404')
		}

		if (slug[slug.length - 1] === slugHomepage) {
			return redirect('/404')
		}

		if (slug[0] === slugHomepage) {
			return redirect('/')
		}
	}

	const slugs = slug || [slugHomepage]

	let loader: Queried | null = null

	if (slugs[0] === slugPost) {
		if (slugs.length === 1) {
			const doc = await pageLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'pages',
				data: doc,
			}
		} else if (slugs.length === 2) {
			const doc = await postCategoryLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'postCategories',
				data: doc,
			}
		} else {
			const doc = await postLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'posts',
				data: doc,
			}
		}
	} else if (slugs[0] === slugTeam) {
		if (slugs.length === 1) {
			const doc = await pageLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'pages',
				data: doc,
			}
		} else if (slugs.length === 2) {
			const doc = await teamPositionLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'teamPositions',
				data: doc,
			}
		} else {
			const doc = await teamLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'teams',
				data: doc,
			}
		}
	} else if (slugs[0] === slugClient && slugs.length === 2) {
		const doc = await clientLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'clients',
			data: doc,
		}
	} else if (slugs[0] === slugService && slugs.length === 2) {
		const doc = await serviceLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'services',
			data: doc,
		}
	} else if (slugs[0] === slugTemplates && slugs.length === 2) {
		const doc = await templateLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'templates',
			data: doc,
		}
	} else if (slugs[0] === slugReusable && slugs.length === 2) {
		const doc = await reusableLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'templates',
			data: doc,
		}
	} else {
		const doc = await pageLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'pages',
			data: doc,
		}
	}

	const [authUser, siteConfig] = await Promise.all([getAuthUser(), getSiteGlobal()])

	return (
		<>
			<script
				id="proyek2m-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						seoSchema({
							...loader,
							site: siteConfig,
						}),
					),
				}}
			/>
			<SiteTemplate
				{...loader}
				authUser={authUser}
				site={siteConfig}
				draft={draft}
			/>
		</>
	)
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
	const { slug = [slugHomepage] } = await paramsPromise

	try {
		// Don't generate metadata for Admin routes, API routes and public files
		if (slug[0] === 'admin' || slug[0] === 'api' || slug.join('/').includes('.')) {
			return {}
		}

		let doc: Page | Post | Team | Client | PostCategory | Template | null = null

		if (slug[0] === slugPost) {
			if (slug.length === 1) {
				doc = await pageLoader(slug)
			} else if (slug.length === 2) {
				doc = await postCategoryLoader(slug)
			} else {
				doc = await postLoader(slug)
			}
		} else if (slug[0] === slugTeam) {
			if (slug.length === 1) {
				doc = await pageLoader(slug)
			} else if (slug.length === 2) {
				doc = await teamPositionLoader(slug)
			} else {
				doc = await teamLoader(slug)
			}
		} else if (slug[0] === slugClient && slug.length === 2) {
			doc = await clientLoader(slug)
		} else if (slug[0] === slugService && slug.length === 2) {
			doc = await serviceLoader(slug)
		} else if (slug[0] === slugTemplates && slug.length === 2) {
			doc = await templateLoader(slug)
		} else if (slug[0] === slugReusable && slug.length === 2) {
			doc = await reusableLoader(slug)
		} else {
			doc = await pageLoader(slug)
		}

		if (!doc) {
			return {}
		}

		const siteConfig = await getSiteGlobal()

		if (!siteConfig) {
			return {}
		}

		return generateMeta(doc, siteConfig)
	} catch (error) {
		console.error('generateMetadata', { slug, error })
		logger.error('generateMetadata', { slug, error })

		return {}
	}
}

export async function generateStaticParams() {
	const [pages, templates, services] = await Promise.all([
		pageSitemap(),
		templateSitemap(),
		serviceSitemap(),
	])

	return [...pages, ...templates, ...services].map((doc) => {
		if (doc.link) {
			const slugs = doc.link.split('/').filter(Boolean)

			return {
				slug: slugs.length ? slugs : [slugHomepage],
			}
		}

		return {
			slug: [doc.slug],
		}
	})
}
