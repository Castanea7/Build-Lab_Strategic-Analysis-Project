import { Link, useParams } from 'react-router-dom'
import { retailCompanies, retailRegions } from '../../data/demoData'
import { SectionEyebrow } from '../../components/ui/SectionEyebrow'
import type { RetailCompany } from '../../types'
import { useState } from 'react'

export function RetailGraphPage() {
  const [scope, setScope] = useState<'china' | 'global'>('china')
  const regions = retailRegions.filter((region) => region.scope === scope)
  return (
    <div className="graph-page">
      <PageIntro
        eyebrow="Retail intelligence graph"
        title="零售行业图谱"
        description="先看市场，再进入区域和企业档案。第一版用结构化演示数据验证研究路径，不接真实网络或数据库。"
      />
      <div className="scope-tabs">
        <button
          className={scope === 'global' ? 'scope-tab-active' : ''}
          onClick={() => setScope('global')}
        >
          全球市场
        </button>
        <button
          className={scope === 'china' ? 'scope-tab-active' : ''}
          onClick={() => setScope('china')}
        >
          中国市场
        </button>
      </div>
      <section className="market-hero-card">
        <div className="market-orb-wrap">
          <div className="market-orb">
            <span className="orb-line orb-line-one" />
            <span className="orb-line orb-line-two" />
            <span className="orb-dot orb-dot-one" />
            <span className="orb-dot orb-dot-two" />
            <span className="orb-dot orb-dot-three" />
          </div>
          <div className="orb-caption">
            {scope === 'china' ? '中国市场视角' : '全球商业市场视角'}
            <small>区域规模颜色深浅 · 点击卡片进入详情</small>
          </div>
        </div>
        <div className="market-overview">
          <SectionEyebrow>
            Market scan / {scope === 'china' ? 'China' : 'Global'}
          </SectionEyebrow>
          <h2>{scope === 'china' ? '中国零售市场' : '全球零售市场'}</h2>
          <p>
            {scope === 'china'
              ? '从区域密度、业态组合与履约效率判断中国市场的增长空间。'
              : '按商业市场区域观察规模、增速与主要零售结构。'}
          </p>
          <div className="overview-stats">
            <Stat
              label="市场规模"
              value={scope === 'china' ? '¥ 15.8 万亿' : '¥ 54.6 万亿'}
              note="2025 年演示口径"
            />
            <Stat
              label="市场增长"
              value={scope === 'china' ? '+8.1%' : '+4.2%'}
              note="年度变化"
            />
            <Stat label="重点赛道" value="6 个" note="按研究优先级合并" />
          </div>
        </div>
      </section>
      <section className="section-block">
        <SectionEyebrow>01 / Regional entry</SectionEyebrow>
        <div className="section-title-row">
          <div>
            <h2>选择一个市场区域</h2>
            <p>第一版先专注单个区域的深度分析，不做多区域比较。</p>
          </div>
          <span className="data-note">数据截至 2025 年 · 人民币口径</span>
        </div>
        <div className="region-grid">
          {regions.map((region) => (
            <Link
              className="region-card"
              to={`/retail/regions/${region.id}`}
              key={region.id}
              style={{ '--region-color': region.color } as React.CSSProperties}
            >
              <div className="region-card-top">
                <span className="region-shape" />
                <span>进入区域 ↗</span>
              </div>
              <h3>{region.name}</h3>
              <p>{region.description}</p>
              <div className="region-metrics">
                <span>
                  <small>市场规模</small>
                  <strong>{region.marketSize}</strong>
                </span>
                <span>
                  <small>增长率</small>
                  <strong>{region.growth}</strong>
                </span>
              </div>
              <div className="region-tags">
                {region.segments.map((segment) => (
                  <span key={segment}>{segment}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section-block">
        <SectionEyebrow>02 / Company archive</SectionEyebrow>
        <div className="section-title-row">
          <div>
            <h2>零售企业档案</h2>
            <p>企业整体信息先于区域表现，重点看规模、经营方式和战略变化。</p>
          </div>
          <span className="data-note">2 个示例企业</span>
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

export function RetailRegionPage() {
  const { regionId } = useParams()
  const region = retailRegions.find((item) => item.id === regionId) ?? retailRegions[0]
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
  return (
    <div className="detail-page">
      <BackLink to="/retail" label="返回零售行业图谱" />
      <CompanyHeader company={company} />
      <section className="profile-section">
        <SectionEyebrow>01 / Scale & development</SectionEyebrow>
        <h2>公司规模与发展</h2>
        <MetricGrid metrics={company.metrics} />
        <TrendHint />
      </section>
      <section className="profile-section">
        <SectionEyebrow>02 / Operating model</SectionEyebrow>
        <h2>经营方式与市场布局</h2>
        <div className="profile-three-columns">
          <InfoPanel eyebrow="基础信息" title="业态与品类">
            <TagList title="主 / 次业态" items={company.formats} />
            <TagList title="核心品类" items={company.categories} />
          </InfoPanel>
          <InfoPanel eyebrow="经营模式" title="如何创造效率">
            <BulletList items={company.operations} />
          </InfoPanel>
          <InfoPanel eyebrow="区域覆盖" title="门店分布">
            <BulletList items={company.coverage} />
          </InfoPanel>
        </div>
      </section>
      <section className="profile-section">
        <SectionEyebrow>03 / Strategic shifts</SectionEyebrow>
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
        <InfoPanel eyebrow="Still relevant" title="仍影响当前业务的变化">
          <BulletList items={company.strategy} />
        </InfoPanel>
      </section>
      <Sources sources={company.sources} />
    </div>
  )
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
function CompanyHeader({ company }: { company: RetailCompany }) {
  return (
    <section className="company-header">
      <div className="company-logo company-logo-large">{company.logoText}</div>
      <div>
        <SectionEyebrow>Retail company profile</SectionEyebrow>
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
function MetricGrid({ metrics }: { metrics: RetailCompany['metrics'] }) {
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
