import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Can be imported from a shared config
const locales = ['id', 'en'] as const
type Locale = typeof locales[number]

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) notFound()

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  }
})
