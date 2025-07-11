import { logger } from '$modules/logger'
import { postSitemap } from '$payload-libs/server/repos'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const posts = await postSitemap()

		return NextResponse.json({
			data: posts,
		})
	} catch (error) {
		console.error('Error sitemap', { error })
		logger.error('Error sitemap', { error })

		return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
	}
}
