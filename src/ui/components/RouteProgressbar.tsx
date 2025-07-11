'use client'
import { useShallowEffect } from '@mantine/hooks'
import { NavigationProgress, nprogress } from '@mantine/nprogress'
import { usePathname, useSearchParams } from 'next/navigation'

import '@mantine/nprogress/styles.css'

export default function RouteProgressbar() {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useShallowEffect(() => {
		nprogress.complete()
	}, [pathname, searchParams])

	return <NavigationProgress />
}
