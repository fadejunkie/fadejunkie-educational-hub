import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description?: string
  canonical?: string
  jsonLd?: object
}

export default function PageMeta({ title, description, canonical, jsonLd }: PageMetaProps) {
  useEffect(() => {
    document.title = title
    const desc = document.querySelector('meta[name="description"]')
    if (desc && description) desc.setAttribute('content', description)
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (link && canonical) link.href = canonical
    if (jsonLd) {
      const existing = document.getElementById('page-jsonld')
      if (existing) existing.remove()
      const script = document.createElement('script')
      script.id = 'page-jsonld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [title, description, canonical, jsonLd])
  return null
}
