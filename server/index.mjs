import http from 'node:http'

const port = Number(process.env.PORT ?? 8787)
const tavilyKey = process.env.TAVILY_API_KEY
const tuziKey = process.env.TUZI_API_KEY
const tuziModel = process.env.TUZI_MODEL ?? 'gpt-4o-mini'

const companies = {
  'retail-company-01': { name: 'Costco', queries: ['Costco latest annual report revenue employees warehouses strategy digital ecommerce', 'Costco operating model merchandise categories membership warehouses geographic coverage', 'Costco digital transformation ecommerce omnichannel technology', 'Costco history strategic shifts expansion'], domains: ['costco.com', 'investor.costco.com', 'sec.gov'] },
  'retail-company-02': { name: 'Walmart', queries: ['Walmart latest annual report revenue employees stores strategy digital ecommerce', 'Walmart operating model formats categories geographic coverage', 'Walmart digital transformation omnichannel technology', 'Walmart history strategic shifts expansion'], domains: ['walmart.com', 'stock.walmart.com', 'sec.gov'] },
  'retail-company-03': { name: '盒马', queries: ['盒马 最新 财报 营收 门店 员工 战略 数字化', '盒马 经营模式 业态 品类 门店 分布', '盒马 数字化 全渠道 即时零售 科技', '盒马 发展历程 战略变化 CCFA'], domains: ['freshhema.com', 'alibabagroup.com', 'ccfa.org.cn'] },
}

const cache = new Map()
const cacheTtl = 1000 * 60 * 60 * 6

function sendJson(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' })
  response.end(JSON.stringify(body))
}

async function searchCompany(company) {
  if (!tavilyKey) throw new Error('缺少 TAVILY_API_KEY，请在后端环境变量中配置。')
  const cached = cache.get(company.name)
  if (cached && Date.now() - cached.createdAt < cacheTtl) return cached.value

  let result
  try {
    result = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${tavilyKey}` },
    body: JSON.stringify({
      api_key: tavilyKey,
      query: company.queries.join('\n'),
      search_depth: 'advanced',
      topic: 'general',
      max_results: 10,
      include_domains: company.domains,
      include_answer: true,
      include_raw_content: false,
    }),
    })
  } catch (error) {
    throw new Error(`Tavily 网络请求失败：${error instanceof Error ? error.message : String(error)}`)
  }
  if (!result.ok) throw new Error(`Tavily 请求失败：${result.status}`)
  const data = await result.json()
  const sources = (data.results ?? []).map((item) => ({ title: item.title, url: item.url, content: item.content }))
  const profile = await structureProfile(company.name, data.answer ?? '', sources)
  const value = {
    id: Object.entries(companies).find(([, item]) => item.name === company.name)?.[0],
    name: company.name,
    answer: data.answer ?? 'Tavily 未返回综合摘要，请查看下方来源。',
    profile,
    sources,
    searchedAt: new Date().toISOString(),
  }
  cache.set(company.name, { createdAt: Date.now(), value })
  return value
}

async function structureProfile(companyName, answer, sources) {
  if (!tuziKey) throw new Error('缺少 TUZI_API_KEY，请在后端环境变量中配置兔子 API Key。')
  const sourceText = sources.map((source, index) => `[来源${index + 1}] ${source.title}\n${source.content}\nURL: ${source.url}`).join('\n\n')
  let response
  try {
    response = await fetch('https://api.tu-zi.com/v1/chat/completions', {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${tuziKey}` },
      body: JSON.stringify({ model: tuziModel, temperature: 0.1, messages: [{ role: 'user', content: `你是企业研究资料整理员。请根据以下多来源搜索资料，为“${companyName}”整理完整企业档案。所有输出必须使用简体中文。只能使用资料中明确出现的事实；无法确认填“暂无公开数据”；根据多个来源合理推算的数值必须在字段值后标注“（估算）”。不要编造。development最多4条，每条不超过60字；formats、categories、operations、coverage各输出3-6条。digitalScore必须是0-100的整数或“暂无公开数据”。\n\nTavily摘要：${answer}\n\n搜索来源：\n${sourceText}` }], response_format: { type: 'json_schema', json_schema: { name: 'retail_company_profile', strict: true, schema: { type: 'object', additionalProperties: false, properties: { summary: { type: 'string' }, founded: { type: 'string' }, headquarters: { type: 'string' }, position: { type: 'string' }, revenue: { type: 'string' }, growth: { type: 'string' }, stores: { type: 'string' }, employees: { type: 'string' }, valuation: { type: 'string' }, formats: { type: 'array', items: { type: 'string' } }, categories: { type: 'array', items: { type: 'string' } }, operations: { type: 'array', items: { type: 'string' } }, coverage: { type: 'array', items: { type: 'string' } }, digitalSales: { type: 'string' }, digitalLevel: { type: 'string' }, digitalTools: { type: 'array', items: { type: 'string' } }, digitalScore: { type: 'string' }, development: { type: 'array', items: { type: 'string' } }, strategy: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'founded', 'headquarters', 'position', 'revenue', 'growth', 'stores', 'employees', 'valuation', 'formats', 'categories', 'operations', 'coverage', 'digitalSales', 'digitalLevel', 'digitalTools', 'digitalScore', 'development', 'strategy'] } } } }),
    })
  } catch (error) {
    throw new Error(`兔子 API 网络请求失败：${error instanceof Error ? error.message : String(error)}`)
  }
  if (!response.ok) throw new Error(`兔子 API 请求失败：${response.status}`)
  const payload = await response.json()
  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error('兔子 API 未返回结构化结果')
  try {
    return parseModelJson(content)
  } catch (error) {
    return parseModelMarkdown(content)
  }
}

function parseModelMarkdown(content) {
  const tableValue = (labels) => {
    for (const label of labels) {
      const match = content.match(new RegExp(`\\|\\s*[^|]*${label}[^|]*\\|\\s*([^|\\n]+)\\|`, 'i'))
      if (match?.[1]) return match[1].replace(/\*\*/g, '').trim()
    }
    return ''
  }
  const valueAfter = (labels) => {
    const pattern = new RegExp(`(?:${labels.join('|')})[^\\n：:]*[：:]\\s*([^\\n]+)`, 'i')
    return content.match(pattern)?.[1]?.replace(/\*\*/g, '').trim() || '待核实'
  }
  const intro = content.match(/## 企业简介\s*\n([\s\S]*?)(?=\n##|$)/)?.[1]?.replace(/\s+/g, ' ').trim()
  const development = [...content.matchAll(/(?:发展|战略|扩张|业务变化)[^\n]*[：:]?\s*([^\n]+)/gi)].map((match) => match[1].replace(/[*#]/g, '').trim()).filter(Boolean).slice(0, 4)
  return {
    summary: intro || content.replace(/[#*]/g, '').replace(/\s+/g, ' ').trim().slice(0, 300),
    founded: valueAfter(['成立时间', '成立于']),
    headquarters: valueAfter(['总部所在地', '总部']),
    position: '暂无公开数据',
    scale: valueAfter(['门店数量', '门店规模', '仓库数量', '员工规模']),
    revenue: tableValue(['总收入', '营收']) || valueAfter(['营收', '收入', '年度收入']),
    growth: tableValue(['增长率', '同比增长']) || valueAfter(['增长率', '同比增长']),
    stores: tableValue(['门店数量', '门店规模', '仓库数量']) || valueAfter(['门店数量', '门店规模', '仓库数量']),
    employees: tableValue(['员工数量', '员工规模', '全球员工数', '雇员']) || valueAfter(['员工数量', '员工规模', '雇员']),
    valuation: tableValue(['市值', '估值']) || valueAfter(['市值', '估值']),
    formats: ['暂无公开数据'], categories: ['暂无公开数据'], operations: ['暂无公开数据'], coverage: ['暂无公开数据'],
    digitalSales: '暂无公开数据', digitalLevel: '暂无公开数据', digitalTools: ['暂无公开数据'], digitalScore: '暂无公开数据',
    development: development.length ? development : ['已完成中文资料整理，详细发展数据请查看来源。'],
    strategy: development.length ? development : ['暂无公开数据'],
  }
}

function parseModelJson(content) {
  const unfenced = content.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim()
  try {
    return JSON.parse(unfenced)
  } catch {
    const start = unfenced.indexOf('{')
    const end = unfenced.lastIndexOf('}')
    if (start >= 0 && end > start) return JSON.parse(unfenced.slice(start, end + 1))
    throw new Error('兔子 API 返回内容不是有效 JSON')
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, OPTIONS' })
    return response.end()
  }
  const match = request.url?.match(/^\/api\/retail-companies\/([^/]+)$/)
  if (request.method !== 'GET' || !match) return sendJson(response, 404, { error: '接口不存在' })
  const company = companies[match[1]]
  if (!company) return sendJson(response, 404, { error: '暂不支持该企业' })
  try {
    return sendJson(response, 200, await searchCompany(company))
  } catch (error) {
    return sendJson(response, 500, { error: error instanceof Error ? error.message : '搜索失败' })
  }
})

server.listen(port, () => console.log(`Retail API listening on http://localhost:${port}`))
