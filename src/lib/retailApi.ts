export type RetailResearch = {
  id: string
  name: string
  answer: string
  profile: { summary: string; founded: string; headquarters: string; position: string; revenue: string; growth: string; stores: string; employees: string; valuation: string; formats: string[]; categories: string[]; operations: string[]; coverage: string[]; digitalSales: string; digitalLevel: string; digitalTools: string[]; digitalScore: string; development: string[]; strategy: string[] }
  searchedAt: string
  sources: { title: string; url: string; content: string }[]
}

export async function fetchRetailResearch(id: string): Promise<RetailResearch> {
  const response = await fetch(`/api/retail-companies/${id}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? '无法获取企业资料')
  return data
}
