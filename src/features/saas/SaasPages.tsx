import { Link, useParams } from 'react-router-dom'
import { saasCompanies, saasTracks } from '../../data/demoData'
import { SectionEyebrow } from '../../components/ui/SectionEyebrow'
import type { SaasCompany } from '../../types'

export function SaasGraphPage() {
  const universal = saasTracks.filter((track) => track.group === '通用赛道')
  const vertical = saasTracks.filter((track) => track.group === '垂直赛道')
  return (
    <div className="graph-page">
      <PageIntro
        eyebrow="SaaS intelligence graph"
        title="SaaS 行业图谱"
        description="从全球与中国市场总览进入具体赛道，再进入统一的企业档案。重点关注增长空间、竞争结构与商业模式。"
      />
      <section className="saas-overview-grid">
        <MarketColumn
          title="全球市场"
          eyebrow="Global SaaS"
          size="¥ 21.4 万亿"
          growth="+15.8%"
          description="企业软件正在从工具采购转向业务结果采购，AI 与数据基础设施是主要增长方向。"
        />
        <MarketColumn
          title="中国市场"
          eyebrow="China SaaS"
          size="¥ 1.28 万亿"
          growth="+18.6%"
          description="中国企业软件市场仍处于结构性渗透阶段，垂直场景与本地交付能力更重要。"
        />
      </section>
      <section className="section-block">
        <SectionEyebrow>01 / Track map</SectionEyebrow>
        <div className="section-title-row">
          <div>
            <h2>赛道分类</h2>
            <p>同一家企业可以进入多个赛道，但统一使用一份企业档案。</p>
          </div>
          <span className="data-note">4 个演示赛道</span>
        </div>
        <div className="track-groups">
          <TrackGroup title="通用赛道" tracks={universal} />
          <TrackGroup title="垂直赛道" tracks={vertical} />
        </div>
      </section>
      <section className="section-block">
        <SectionEyebrow>02 / Company archive</SectionEyebrow>
        <div className="section-title-row">
          <div>
            <h2>代表性企业</h2>
            <p>企业档案保留规模、产品、商业模式和竞争判断。</p>
          </div>
        </div>
        <div className="company-card-grid">
          {saasCompanies.map((company) => (
            <SaasCompanyPreview company={company} key={company.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

export function SaasTrackPage() {
  const { trackId } = useParams()
  const track = saasTracks.find((item) => item.id === trackId) ?? saasTracks[0]
  return (
    <div className="detail-page">
      <BackLink to="/saas" label="返回 SaaS 行业总览" />
      <PageIntro
        eyebrow={`${track.group} / ${track.name}`}
        title={track.name}
        description={track.summary}
      />
      <div className="detail-stat-grid">
        <Stat label="市场规模" value={track.marketSize} note="2025 年演示口径" />
        <Stat label="增长率" value={track.growth} note="年度变化" />
        <Stat
          label="主要企业"
          value={`${track.leaders.length} 家`}
          note={track.leaders.join(' · ')}
        />
        <Stat
          label="产品模块"
          value={`${track.products.length} 类`}
          note="按主要使用场景"
        />
      </div>
      <div className="two-column-section">
        <InfoPanel eyebrow="Market opportunity" title="市场机会">
          <p className="large-copy">
            {track.summary} 这一赛道的增长机会主要来自以下驱动因素。
          </p>
          <BulletList items={track.drivers} />
        </InfoPanel>
        <InfoPanel eyebrow="Competition structure" title="竞争结构">
          <p className="large-copy">
            企业竞争同时发生在产品深度、交付效率和数据沉淀三个层面。
          </p>
          <div className="participant-list">
            <SectionEyebrow>代表性企业</SectionEyebrow>
            {track.leaders.map((leader) => (
              <div key={leader}>
                <span className="list-dot" />
                {leader}
              </div>
            ))}
          </div>
        </InfoPanel>
      </div>
      <section className="section-block compact-block">
        <SectionEyebrow>Product & business model</SectionEyebrow>
        <h2>产品与商业模式</h2>
        <div className="profile-three-columns">
          <InfoPanel eyebrow="产品功能" title="主流模块">
            <TagList items={track.products} title="产品" />
          </InfoPanel>
          <InfoPanel eyebrow="Business model" title="收费方式">
            <p className="large-copy">{track.businessModel}</p>
          </InfoPanel>
          <InfoPanel eyebrow="Next question" title="建议追问">
            <p className="large-copy">
              哪些企业能把赛道增长转化为更高的客户留存和更好的单位经济？
            </p>
          </InfoPanel>
        </div>
      </section>
    </div>
  )
}

export function SaasCompanyPage() {
  const { companyId } = useParams()
  const company =
    saasCompanies.find((item) => item.id === companyId) ?? saasCompanies[0]
  return (
    <div className="detail-page">
      <BackLink to="/saas" label="返回 SaaS 行业图谱" />
      <CompanyHeader company={company} />
      <section className="profile-section">
        <SectionEyebrow>01 / Scale & development</SectionEyebrow>
        <h2>公司规模与发展</h2>
        <MetricGrid metrics={company.metrics} />
        <TrendHint />
      </section>
      <section className="profile-section">
        <SectionEyebrow>02 / Business & product</SectionEyebrow>
        <h2>商业模式与产品</h2>
        <div className="profile-three-columns">
          <InfoPanel eyebrow="Product matrix" title="产品矩阵">
            <TagList title="产品" items={company.products} />
          </InfoPanel>
          <InfoPanel eyebrow="Target customers" title="目标客户与场景">
            <BulletList items={company.customers} />
          </InfoPanel>
          <InfoPanel eyebrow="Business model" title="商业模式">
            <BulletList items={company.businessModel} />
          </InfoPanel>
        </div>
      </section>
      <section className="profile-section">
        <SectionEyebrow>03 / Position & competition</SectionEyebrow>
        <h2>市场定位与竞争</h2>
        <div className="competition-callout">
          <span className="company-logo">{company.logoText}</span>
          <div>
            <strong>
              {company.name} · {company.position}
            </strong>
            <p>所属赛道：{company.products.slice(0, 2).join(' / ')}</p>
          </div>
        </div>
        <InfoPanel eyebrow="Competitive reading" title="竞争优劣势">
          <BulletList items={company.competition} />
        </InfoPanel>
      </section>
      <section className="profile-section">
        <SectionEyebrow>04 / Strategic shifts</SectionEyebrow>
        <h2>发展历程与战略变化</h2>
        <div className="timeline">
          {company.timeline.map((event) => (
            <div className="timeline-item" key={event.year}>
              <div className="timeline-year">{event.year}</div>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Sources sources={company.sources} />
    </div>
  )
}

function MarketColumn({
  title,
  eyebrow,
  size,
  growth,
  description,
}: {
  title: string
  eyebrow: string
  size: string
  growth: string
  description: string
}) {
  return (
    <div className="saas-market-column">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="saas-market-stats">
        <Stat label="市场规模" value={size} note="2025 年演示口径" />
        <Stat label="增长率" value={growth} note="年度变化" />
      </div>
      <Link to="/saas/tracks/saas-track-data" className="text-link">
        查看主要赛道 ↗
      </Link>
    </div>
  )
}
function TrackGroup({ title, tracks }: { title: string; tracks: typeof saasTracks }) {
  return (
    <div className="track-group">
      <div className="track-group-heading">
        <h3>{title}</h3>
        <span>{tracks.length} 个赛道</span>
      </div>
      {tracks.map((track) => (
        <Link to={`/saas/tracks/${track.id}`} className="track-card" key={track.id}>
          <div className="track-card-icon">
            {track.group === '通用赛道' ? '◇' : '◈'}
          </div>
          <div>
            <strong>{track.name}</strong>
            <p>{track.summary}</p>
            <div className="track-card-meta">
              <span>{track.marketSize}</span>
              <span>{track.growth}</span>
            </div>
          </div>
          <span className="track-arrow">↗</span>
        </Link>
      ))}
    </div>
  )
}
function SaasCompanyPreview({ company }: { company: SaasCompany }) {
  return (
    <Link className="company-preview" to={`/saas/companies/${company.id}`}>
      <div className="company-logo company-logo-saas">{company.logoText}</div>
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
function CompanyHeader({ company }: { company: SaasCompany }) {
  return (
    <section className="company-header">
      <div className="company-logo company-logo-large company-logo-saas">
        {company.logoText}
      </div>
      <div>
        <SectionEyebrow>SaaS company profile</SectionEyebrow>
        <h1 className="page-title">{company.name}</h1>
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
function MetricGrid({ metrics }: { metrics: SaasCompany['metrics'] }) {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <div className="metric-card" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.note}</small>
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
