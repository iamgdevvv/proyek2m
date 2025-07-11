'use server'
import { revalidateTag } from 'next/cache'
import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	GlobalAfterChangeHook,
} from 'payload'

import type { Post } from '$payload-types'

export const revalidateChange: CollectionAfterChangeHook<Post> = async ({
	doc,
	req: { context },
}) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection')
		revalidateTag('sitemap')
	}

	return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
	doc,
	req: { context },
}) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection')
		revalidateTag('sitemap')
	}

	return doc
}

export const revalidateChangeStatic: CollectionAfterChangeHook<Post> = async ({
	doc,
	req: { context },
}) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection')
	}

	return doc
}

export const revalidateDeleteStatic: CollectionAfterDeleteHook<Post> = async ({
	doc,
	req: { context },
}) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection')
	}

	return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ context }) => {
	if (!context.disableRevalidate) {
		revalidateTag('global')
	}
}
