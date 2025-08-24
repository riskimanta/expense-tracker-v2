import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['id', 'en'],

  // Used when no locale matches
  defaultLocale: 'id',

  // Always use the default locale for the root path
  localePrefix: 'as-needed'
})

export const config = {
  // Temporarily disabled to avoid root 404 conflicts
  matcher: []
}
