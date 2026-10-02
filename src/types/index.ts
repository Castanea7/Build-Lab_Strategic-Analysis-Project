export type Industry = 'retail' | 'saas'

export type InspirationStatus = 'unread' | 'researched' | 'snoozed'

export type BriefStatus = 'draft' | 'completed' | 'archived'

export type NewsItem = {
  id: string
  industry: Industry
  theme: string
  title: string
  summary: string
  source: string
  publishedAt: string
  url: string
  tags: string[]
  analysis: {
    change: string
    impact: string
    related: string[]
  }
}

export type ResearchInspiration = {
  id: string
  title: string
  summary: string
  rationale: string
  question: string
  signals: string[]
  entities: string[]
  value: string[]
}

export type MarketRegion = {
  id: string
  name: string
  scope: 'global' | 'china'
  marketSize: string
  growth: string
  year: string
  color: string
  description: string
  segments: string[]
  participants: string[]
  opportunity: string
  structure: string
}

export type TimelineEvent = {
  year: string
  title: string
  description: string
}

export type CompanyMetric = {
  label: string
  value: string
  note: string
  trend?: string[]
}

export type RetailCompany = {
  id: string
  name: string
  shortName: string
  description: string
  founded: string
  headquarters: string
  position: string
  logoText: string
  metrics: CompanyMetric[]
  formats: string[]
  categories: string[]
  operations: string[]
  coverage: string[]
  timeline: TimelineEvent[]
  strategy: string[]
  sources: string[]
}

export type SaasTrack = {
  id: string
  name: string
  group: '通用赛道' | '垂直赛道'
  summary: string
  marketSize: string
  growth: string
  drivers: string[]
  leaders: string[]
  products: string[]
  businessModel: string
}

export type SaasCompany = {
  id: string
  name: string
  shortName: string
  description: string
  founded: string
  headquarters: string
  position: string
  logoText: string
  metrics: CompanyMetric[]
  products: string[]
  customers: string[]
  businessModel: string[]
  competition: string[]
  timeline: TimelineEvent[]
  sources: string[]
}

export type BriefBlock = {
  id: string
  title: string
  body: string
}

export type Brief = {
  id: string
  title: string
  objective: string
  status: BriefStatus
  updatedAt: string
  inspirationId?: string
  materials: string[]
  blocks: BriefBlock[]
}

export type DemoStoreState = {
  bookmarks: string[]
  inspirationStatuses: Record<string, InspirationStatus>
  briefs: Brief[]
}
