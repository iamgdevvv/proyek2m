import type { Metadata } from 'next'

import type { Client, Page, Post, PostCategory, Site, Team, Template } from '$payload-types'
import { assetUrl } from '$utils/common'

export async function generateMeta(
	doc: Pick<
		Post | PostCategory | Page | Team | Client | Template,
		'meta' | 'excerpt' | 'featuredImage' | 'title' | 'link'
	>,
	site: Site | null,
): Promise<Metadata> {
	const siteTitle = site?.title || 'Proyek2M'

	let ogImage = undefined
	let title = siteTitle
	const description = doc?.meta?.description || doc?.excerpt || undefined
	let favicon = '/favicon.png'

	if (doc?.meta?.image) {
		ogImage = assetUrl(doc.meta.image)
	}

	if (doc?.featuredImage) {
		ogImage = assetUrl(doc.featuredImage)
	}

	if (site?.favicon) {
		ogImage = assetUrl(site.favicon)
		favicon = assetUrl(site.favicon)!
	}

	if (doc?.meta?.title) {
		title = doc.meta.title
	} else if (doc?.title) {
		title = `${doc.title} | ${siteTitle}`
	}

	return {
		title,
		description,
		robots: !site?.sitePublicly ? 'noindex, nofollow' : doc.meta?.robots || 'index, follow',
		keywords: doc.meta?.keywords,
		icons: favicon,
		openGraph: {
			description,
			images: ogImage,
			title,
			url: doc?.link || '/',
		},
		twitter: {
			site: siteTitle,
			description,
			title,
			images: ogImage,
		},
		pinterest: {
			richPin: true,
		},
		applicationName: siteTitle,
	}
}
