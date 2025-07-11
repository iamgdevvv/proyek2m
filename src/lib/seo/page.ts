import type {
	AboutPage,
	ContactPage,
	FAQPage,
	ProfilePage,
	SearchResultsPage,
	WebPage,
} from 'schema-dts'

import type { Client, Page, Team, Template } from '$payload-types'
import { assetUrl } from '$utils/common'

export const pageSchema = (
	data: Page | Client | Team | Template,
): WebPage | AboutPage | ContactPage | FAQPage | ProfilePage | SearchResultsPage => {
	return {
		'@type': data.meta?.schemaType || 'WebPage',
		name: data.meta?.title || data.title || 'Untitled',
		headline: data.meta?.title || data.title || 'Untitled',
		description: data.meta?.description || data.excerpt || undefined,
		url: data.link || undefined,
		image: assetUrl(data.meta?.image || data.featuredImage),
		dateCreated: data.createdAt || undefined,
		dateModified: data.updatedAt || undefined,
		datePublished: data.publishedAt || undefined,
	}
}
