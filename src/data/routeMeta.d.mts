export interface RouteMetaEntry {
  title: string
  description: string
  canonical: string
  jsonLd?: object
  staticContent?: string
}

export declare const routeMeta: Record<string, RouteMetaEntry>
