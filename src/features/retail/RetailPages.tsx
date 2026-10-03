import { Link, useParams } from 'react-router-dom'
import { retailCompanies, retailRegions } from '../../data/demoData'
import { SectionEyebrow } from '../../components/ui/SectionEyebrow'
import type { MarketRegion, RetailCompany } from '../../types'
import { useState } from 'react'
import { fetchRetailResearch, type RetailResearch } from '../../lib/retailApi'

const demoRegions: MarketRegion[] = [
  ...retailRegions,
  ...[
    ['china-north', '华北', 'china', '¥ 3.2 万亿', '+6.8%', '#d8c7e5'],
    ['china-central', '华中', 'china', '¥ 2.1 万亿', '+7.2%', '#c9dcbf'],
    ['china-southwest', '西南', 'china', '¥ 2.4 万亿', '+8.9%', '#f1d4b8'],
    ['china-northwest', '西北', 'china', '¥ 1.1 万亿', '+6.1%', '#cbd4ee'],
    ['china-northeast', '东北', 'china', '¥ 1.3 万亿', '+5.4%', '#e7c5d4'],
    ['china-hkmt', '港澳台', 'china', '¥ 1.6 万亿', '+5.8%', '#b9d7e9'],
    ['global-north-america', '北美', 'global', '¥ 13.6 万亿', '+4.8%', '#b9d7e9'],
    ['global-europe', '欧洲', 'global', '¥ 11.4 万亿', '+3.9%', '#d8c7e5'],
    ['global-apac', '亚太', 'global', '¥ 17.8 万亿', '+5.6%', '#e7b3c2'],
    ['global-latam', '拉丁美洲', 'global', '¥ 4.6 万亿', '+6.4%', '#c9dcbf'],
    ['global-mea', '中东与非洲', 'global', '¥ 3.8 万亿', '+6.9%', '#f1d4b8'],
  ].map(([id, name, scope, marketSize, growth, color]) => ({
    id,
    name,
    scope: scope as 'global' | 'china',
    marketSize,
    growth,
    year: '2025',
    color,
    description: `${name}市场的实体零售规模、业态组合与主要参与者概览。`,
    segments: ['综合零售', '便利零售', '专业业态'],
    participants: ['全国连锁', '区域零售集团', '平台型零售商'],
    opportunity: '门店密度、全渠道经营和精选品类仍是值得关注的增长抓手。',
    structure: '头部企业与区域企业共同竞争，供应链和本地化运营决定扩张质量。',
  })),
]

function regionFor(id: string) {
  return demoRegions.find((region) => region.id === id) ?? demoRegions[0]
}

export function RetailGraphPage() {
  const [scope, setScope] = useState<'china' | 'global'>('china')
  const [selectedRegion, setSelectedRegion] = useState('china-overview')
  const [format, setFormat] = useState('全部业态')
  const [trendOpen, setTrendOpen] = useState<string | null>(null)
  const regions = demoRegions.filter((region) => region.scope === scope)
  const isChina = scope === 'china'
  const selectedName = selectedRegion === 'china-overview' ? '中国整体' : selectedRegion === 'global-overview' ? '全球整体' : regionFor(selectedRegion).name
  const market = isChina ? '¥ 15.8 万亿' : '¥ 54.6 万亿'
  return (
    <div className="graph-page">
      <PageIntro
        eyebrow="Retail intelligence graph"
        title="零售行业图谱"
        description="先看市场，再进入区域和企业档案。第一版用结构化演示数据验证研究路径，不接真实网络或数据库。"
      />
      <div className="retail-nav-tabs">
        <Link className="retail-nav-tab retail-nav-tab-active" to="/retail">市场扫描</Link>
        <span className="retail-nav-tab">企业档案</span>
      </div>
      <div className="scope-tabs">
        <button
          className={scope === 'global' ? 'scope-tab-active' : ''}
          onClick={() => { setScope('global'); setSelectedRegion('global-overview') }}
        >
          全球市场
        </button>
        <button
          className={scope === 'china' ? 'scope-tab-active' : ''}
          onClick={() => { setScope('china'); setSelectedRegion('china-overview') }}
        >
          中国市场
        </button>
      </div>
      <section className="retail-dashboard">
        <div className="retail-map-panel">
          <div className="panel-heading"><div><SectionEyebrow>{isChina ? 'China map' : 'Global map'}</SectionEyebrow><h2>{selectedName}</h2></div><span className="map-hint">悬停查看 · 点击下钻</span></div>
          {isChina ? <ChinaMap regions={regions} selected={selectedRegion} onSelect={setSelectedRegion} /> : <GlobeMap regions={regions} selected={selectedRegion} onSelect={setSelectedRegion} />}
          <div className="map-legend"><span><i className="legend-dot legend-dot-light" />规模较小</span><span><i className="legend-dot legend-dot-deep" />规模较大</span><span>2025 · 演示数据</span></div>
        </div>
        <div className="market-scan-panel">
          <div className="scan-heading"><div><SectionEyebrow>Market scan / {isChina ? 'China' : 'Global'}</SectionEyebrow><h2>{selectedName}市场扫描</h2><p>从市场规模、业态组合与竞争结构判断进入机会。</p></div><select value={format} onChange={(event) => setFormat(event.target.value)}>{['全部业态', '商超', '便利店', '百货', '仓储会员店', '硬折扣店', '社区生鲜店'].map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="scan-section"><div className="scan-section-label">01 / 核心指标 <span>2025 年 · {format}</span></div><div className="metric-strip"><ScanMetric label="市场规模" value={market} trend={['11.8', '12.6', '13.5', '14.7', isChina ? '15.8' : '54.6']} open={trendOpen === '规模'} onTrend={() => setTrendOpen(trendOpen === '规模' ? null : '规模')} /><ScanMetric label="零售企业数量" value={isChina ? '18,640 家' : '126,500 家'} trend={['14.2', '15.1', '16.3', '17.5', isChina ? '18.6' : '126']} open={trendOpen === '企业'} onTrend={() => setTrendOpen(trendOpen === '企业' ? null : '企业')} /><ScanMetric label="门店数量" value={isChina ? '1,286,000 家' : '8,420,000 家'} trend={['9.8', '10.5', '11.3', '12.1', isChina ? '12.8' : '84']} open={trendOpen === '门店'} onTrend={() => setTrendOpen(trendOpen === '门店' ? null : '门店')} /></div>{trendOpen && <MiniTrend title={`${trendOpen}近 5 年趋势`} values={trendOpen === '规模' ? ['11.8', '12.6', '13.5', '14.7', isChina ? '15.8' : '54.6'] : ['9.8', '10.5', '11.3', '12.1', '12.8']} />}</div>
          <div className="scan-section"><div className="scan-section-label">02 / 市场结构 <span>业态分布与主要参与者</span></div><div className="scan-columns"><div className="format-bars">{['商超 34%', '便利店 22%', '百货 14%', '仓储会员店 12%', '硬折扣店 8%', '社区生鲜店 10%'].map((item, index) => <div className="format-bar-row" key={item}><span>{item.split(' ')[0]}</span><div><i style={{ width: `${[82, 66, 48, 42, 31, 38][index]}%` }} /></div><em>{item.split(' ')[1]}</em></div>)}</div><div className="participant-list scan-participants">{['沃尔玛', '盒马', '山姆会员店'].map((name, index) => <Link to={`/retail/companies/${['retail-company-02', 'retail-company-01', 'retail-company-03'][index] ?? 'retail-company-01'}`} key={name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><em>{['12.8%', '8.6%', '6.4%'][index]}</em> ↗</Link>)}</div></div></div>
          <div className="scan-section"><div className="scan-section-label">03 / 分析判断 <span>区域特点、竞争格局与机会</span></div><div className="analysis-cards"><article><small>区域特点</small><strong>高密度城市群与成熟供应链</strong><p>门店网络、即时履约和专业品类共同影响消费半径。</p></article><article><small>竞争格局</small><strong>头部规模与区域密度并存</strong><p>全国连锁提供效率，区域企业依靠本地化运营建立壁垒。</p></article><article className="analysis-opportunity"><small>机会判断</small><strong>精选业态仍有结构性空间</strong><p>围绕便利性、服务和全渠道效率寻找进入切口。</p></article></div></div>
        </div>
      </section>
      <section className="section-block">
        <SectionEyebrow>02 / Company archive</SectionEyebrow>
        <div className="section-title-row">
          <div>
            <h2>零售企业档案</h2>
            <p>企业整体信息先于区域表现，重点看规模、经营方式和战略变化。</p>
          </div>
          <span className="data-note">3 个示例企业</span>
        </div>
        <div className="company-card-grid">
          {retailCompanies.map((company) => (
            <CompanyPreview company={company} key={company.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

function GlobeMap({ regions, selected, onSelect }: { regions: MarketRegion[]; selected: string; onSelect: (id: string) => void }) {
  return <div className="globe-map"><div className="globe-sphere"><span className="globe-longitude one" /><span className="globe-longitude two" /><span className="globe-latitude one" /><span className="globe-latitude two" />{regions.map((region, index) => <button key={region.id} className={`map-region-dot globe-dot dot-${index + 1} ${selected === region.id ? 'map-region-selected' : ''}`} style={{ background: region.color }} title={region.name} onClick={() => onSelect(region.id)} />)}</div><div className="globe-rotate">↻ 拖动地球查看区域</div></div>
}

function ChinaMap({ regions, selected, onSelect }: { regions: MarketRegion[]; selected: string; onSelect: (id: string) => void }) {
  return <div className="china-map"><div className="china-silhouette"><span className="china-river" />{regions.map((region, index) => <button key={region.id} className={`map-region-dot china-dot china-dot-${index + 1} ${selected === region.id ? 'map-region-selected' : ''}`} style={{ background: region.color }} title={region.name} onClick={() => onSelect(region.id)} />)}</div><div className="china-map-label">中国整体 · 点击区域查看市场扫描</div></div>
}

function ScanMetric({ label, value, trend, open, onTrend }: { label: string; value: string; trend: string[]; open: boolean; onTrend: () => void }) {
  return <article className="scan-metric"><div className="scan-metric-label"><span>{label}</span><button className="metric-info" title="查看来源、口径、置信度和日期">i</button><button className="metric-trend-button" onClick={onTrend} title="查看近五年趋势">↗</button></div><strong>{value}</strong><small>来源：权威行业报告 · 统计至 2025</small>{open && <div className="metric-popover"><b>数据说明</b><span>来源：行业报告（演示）</span><span>口径：实体门店零售</span><span>置信度：中高</span><span>日期：2025 年</span></div>}</article>
}

function MiniTrend({ title, values }: { title: string; values: string[] }) {
  const max = Math.max(...values.map(Number))
  return <div className="mini-trend"><div><strong>{title}</strong><span>2021 — 2025</span></div><div className="trend-bars">{values.map((value, index) => <div key={`${value}-${index}`}><i style={{ height: `${Math.max(18, (Number(value) / max) * 72)}px` }} /><small>{value}</small></div>)}</div></div>
}

export function RetailRegionPage() {
  const { regionId } = useParams()
  const region = regionFor(regionId ?? '')
  return (
    <div className="detail-page">
      <BackLink to="/retail" label="返回零售市场扫描" />
      <PageIntro
        eyebrow={`Retail region / ${region.name}`}
        title={`${region.name}市场`}
        description={region.description}
      />
      <div className="detail-stat-grid">
        <Stat label="市场规模" value={region.marketSize} note={`${region.year} 年`} />
        <Stat label="增长率" value={region.growth} note="年度变化" />
        <Stat
          label="重点赛道"
          value={`${region.segments.length} 个`}
          note={region.segments.join(' · ')}
        />
        <Stat
          label="参与者"
          value={`${region.participants.length} 类`}
          note="区域结构"
        />
      </div>
      <div className="two-column-section">
        <InfoPanel eyebrow="Opportunity judgment" title="机会判断">
          <p className="large-copy">{region.opportunity}</p>
          <div className="highlight-list">
            {region.segments.map((segment, index) => (
              <div key={segment}>
                <span>0{index + 1}</span>
                <strong>{segment}</strong>
                <p>值得继续观察其规模、增长空间与头部参与者变化。</p>
              </div>
            ))}
          </div>
        </InfoPanel>
        <InfoPanel eyebrow="Market structure" title="市场结构">
          <p className="large-copy">{region.structure}</p>
          <div className="participant-list">
            <SectionEyebrow>主要参与者</SectionEyebrow>
            {region.participants.map((participant) => (
              <div key={participant}>
                <span className="list-dot" />
                {participant}
              </div>
            ))}
          </div>
        </InfoPanel>
      </div>
      <section className="section-block compact-block">
        <SectionEyebrow>Related company archive</SectionEyebrow>
        <h2>可继续查看的企业档案</h2>
        <div className="company-card-grid">
          {retailCompanies.map((company) => (
            <CompanyPreview company={company} key={company.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

export function RetailCompanyPage() {
  const { companyId } = useParams()
  const company =
    retailCompanies.find((item) => item.id === companyId) ?? retailCompanies[0]
  const [research, setResearch] = useState<RetailResearch | null>(null)
  const [researchError, setResearchError] = useState('')
  const [researchLoading, setResearchLoading] = useState(false)

  const loadResearch = async () => {
    setResearchLoading(true)
    setResearchError('')
    try {
      setResearch(await fetchRetailResearch(company.id))
    } catch (error) {
      setResearchError(error instanceof Error ? error.message : '无法获取真实资料')
    } finally {
      setResearchLoading(false)
    }
  }
  const displayedCompany = research ? mergeResearchCompany(company, research) : company
  return (
    <div className="detail-page">
      <BackLink to="/retail" label="返回零售行业图谱" />
      <CompanyHeader company={displayedCompany} onResearch={loadResearch} researchLoading={researchLoading} hasResearch={Boolean(research)} />
      {researchError && <p className="research-error">{researchError}</p>}
      <section className="profile-section">
        <SectionEyebrow>01 / Scale & development</SectionEyebrow>
        <h2>公司规模与发展</h2>
        <MetricGrid metrics={displayedCompany.metrics} />
        <TrendHint />
      </section>
      <section className="profile-section">
        <SectionEyebrow>02 / Operating model</SectionEyebrow>
        <h2>经营方式与市场布局</h2>
        <div className="profile-three-columns">
          <InfoPanel eyebrow="基础信息" title="业态与品类">
            <TagList title="主 / 次业态" items={displayedCompany.formats} />
            <TagList title="核心品类" items={displayedCompany.categories} />
          </InfoPanel>
          <InfoPanel eyebrow="经营模式" title="如何创造效率">
            <BulletList items={displayedCompany.operations} />
          </InfoPanel>
          <InfoPanel eyebrow="区域覆盖" title="门店分布">
            <BulletList items={displayedCompany.coverage} />
          </InfoPanel>
        </div>
      </section>
      <section className="profile-section">
        <SectionEyebrow>03 / Digital maturity</SectionEyebrow>
        <h2>企业数字化程度</h2>
        <div className="digital-grid">
          <InfoPanel eyebrow="线上销售" title="线上销售占比"><strong className="digital-score">{research?.profile.digitalSales ?? '暂无公开数据'}</strong><p>来源：Tavily 与兔子 API 整理。</p></InfoPanel>
          <InfoPanel eyebrow="全渠道能力" title="线上线下协同"><strong className="digital-level">{research?.profile.digitalLevel ?? '暂无公开数据'}</strong><p>来源：Tavily 与兔子 API 整理。</p></InfoPanel>
          <InfoPanel eyebrow="工具矩阵" title="已使用的数字化工具"><TagList title="数字化工具" items={research?.profile.digitalTools ?? ['暂无公开数据']} /></InfoPanel>
        </div>
        <div className="digital-meter"><div><span>综合数字化成熟度</span><strong>{research?.profile.digitalScore ?? '暂无公开数据'}</strong></div><div className="meter-track"><i style={{ width: research?.profile.digitalScore && /^\d+$/.test(research.profile.digitalScore) ? `${research.profile.digitalScore}%` : '0%' }} /></div><small>基于公开资料整理；估算值会明确标注。</small></div>
      </section>
      <section className="profile-section">
        <SectionEyebrow>04 / Strategic shifts</SectionEyebrow>
        <h2>发展历程与战略变化</h2>
        <div className="timeline">
          {displayedCompany.timeline.map((event) => (
            <div className="timeline-item" key={event.year}>
              <div className="timeline-year">{event.year}</div>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
        <InfoPanel eyebrow="Still relevant" title="仍影响当前业务的变化">
          <BulletList items={displayedCompany.strategy} />
        </InfoPanel>
      </section>
      <Sources sources={research ? research.sources.map((source) => source.url) : company.sources} />
    </div>
  )
}

function liveMetrics(company: RetailCompany, research: RetailResearch) {
  const values = [research.profile.revenue, research.profile.growth, research.profile.stores, research.profile.employees, research.profile.valuation]
  return company.metrics.map((metric, index) => ({
    ...metric,
    value: values[index] || '待核实',
    note: 'Tavily + 兔子 API 整理',
  }))
}

function liveTimeline(research: RetailResearch, fallback: RetailCompany['timeline']) {
  const items = research.profile.development.slice(0, 4).map((description, index) => ({
    year: `资料 ${index + 1}`,
    title: '最新发展与战略线索',
    description,
  }))
  return items.length ? items : fallback
}

function mergeResearchCompany(company: RetailCompany, research: RetailResearch): RetailCompany {
  const p = research.profile
  return {
    ...company,
    description: p.summary,
    founded: p.founded,
    headquarters: p.headquarters,
    position: p.position,
    metrics: liveMetrics(company, research),
    formats: p.formats,
    categories: p.categories,
    operations: p.operations,
    coverage: p.coverage,
    timeline: liveTimeline(research, company.timeline),
    strategy: p.strategy,
  }
}

function CompanyPreview({ company }: { company: RetailCompany }) {
  return (
    <Link className="company-preview" to={`/retail/companies/${company.id}`}>
      <div className="company-logo">{company.logoText}</div>
      <div className="company-preview-copy">
        <div className="company-preview-meta">
          <span>{company.position}</span>
          <span>{company.headquarters}</span>
        </div>
        <h3>{company.name}</h3>
        <p>{company.description}</p>
        <div className="company-preview-bottom">
          <strong>{company.metrics[0].value}</strong>
          <span>营收 · 查看档案 ↗</span>
        </div>
      </div>
    </Link>
  )
}
function CompanyHeader({ company, onResearch, researchLoading, hasResearch }: { company: RetailCompany; onResearch: () => void; researchLoading: boolean; hasResearch: boolean }) {
  return (
    <section className="company-header">
      <div className="company-logo company-logo-large">{company.logoText}</div>
      <div>
        <SectionEyebrow>Retail company profile</SectionEyebrow>
        <div className="company-title-row"><h1 className="page-title">{company.name}</h1><button className="research-button" onClick={onResearch} disabled={researchLoading}>{researchLoading ? '检索中…' : hasResearch ? '重新获取' : '获取真实资料'}</button></div>
        <p className="company-description">{company.description}</p>
        <div className="company-header-meta">
          <span>成立于 {company.founded}</span>
          <span>{company.headquarters}</span>
          <span className="position-pill">{company.position}</span>
        </div>
      </div>
    </section>
  )
}
function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="page-intro">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h1 className="page-title">{title}</h1>
      <p className="page-lede">{description}</p>
    </section>
  )
}
function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link className="back-link" to={to}>
      ← {label}
    </Link>
  )
}
function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  )
}
function InfoPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="info-panel">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h3>{title}</h3>
      {children}
    </div>
  )
}
function MetricGrid({ metrics }: { metrics: RetailCompany['metrics'] }) {
  const [openMetric, setOpenMetric] = useState<string | null>(null)
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <div className="metric-card" key={metric.label}>
          <div className="metric-card-label"><span>{metric.label}</span><button className="metric-info" title="查看数据说明" onClick={() => setOpenMetric(openMetric === metric.label ? null : metric.label)}>i</button>{metric.trend && <button className="metric-trend-button" title="查看近五年趋势" onClick={() => setOpenMetric(openMetric === metric.label ? null : metric.label)}>↗</button>}</div>
          <strong>{metric.value}</strong>
          <small>{metric.note}</small>
          {openMetric === metric.label && <div className="metric-popover profile-popover"><b>数据说明</b><span>来源：企业公开资料（演示）</span><span>口径：集团整体零售业务</span><span>置信度：中高</span><span>日期：2025 年</span>{metric.trend && <MiniTrend title="近 5 年趋势" values={metric.trend} />}</div>}
        </div>
      ))}
    </div>
  )
}
function TrendHint() {
  return (
    <div className="trend-hint">
      <span>↗</span>
      <div>
        <strong>趋势数据可展开</strong>
        <p>演示版保留近 5 年快照，后续可替换为可切换的真实趋势图。</p>
      </div>
    </div>
  )
}
function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="tag-list">
      <span>{title}</span>
      <div>
        {items.map((item) => (
          <em key={item}>{item}</em>
        ))}
      </div>
    </div>
  )
}
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="bullet-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
function Sources({ sources }: { sources: string[] }) {
  return (
    <section className="sources-block">
      <SectionEyebrow>Sources</SectionEyebrow>
      <h2>资料来源</h2>
      {sources.map((source) => (
        <div className="source-row" key={source}>
          <span>↗</span>
          {source}
          <small>演示数据 · 待接入来源等级</small>
        </div>
      ))}
    </section>
  )
}
