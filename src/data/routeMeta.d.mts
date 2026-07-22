export interface RouteMetaEntry {
  title: string
  description: string
  canonical: string
  jsonLd?: object
}

export declare const routeMeta: Record<string, RouteMetaEntry>
