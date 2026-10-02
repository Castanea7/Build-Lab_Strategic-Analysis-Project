import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { demoInspiration, demoNews } from '../../data/demoData'
import { useDemoStore } from '../../lib/demoStore'
import { SectionEyebrow } from '../../components/ui/SectionEyebrow'

export function DashboardPage() {
  const [expandedNews, setExpandedNews] = useState<string | null>(null)
  const [inspirationOpen, setInspirationOpen] = useState(false)
  const navigate = useNavigate()
  const {
    bookmarks,
    toggleBookmark,
    createBriefFromInspiration,
    setInspirationStatus,
  } = useDemoStore()

  const createBrief = () =>
    navigate(`/research/briefs/${createBriefFromInspiration()}/edit`)

  return (
    <div className="dashboard-page">
      <section className="hero-row dashboard-hero">
        <div>
          <SectionEyebrow>2026 年 10 月 2 日 · Morning brief</SectionEyebrow>
          <h1 className="page-title">早上好，Signal。</h1>
          <p className="page-lede">
            先看今天的变化，再决定值得继续追问什么。所有内容都是当前浏览器里的演示数据。
          </p>
        </div>
        <div className="hero-note">
          <span className="hero-note-line" />
          <span>今日情报密度</span>
          <strong>10 条动态 · 1 条灵感</strong>
        </div>
      </section>

      <section className="dashboard-layout">
        <div className="content-panel news-feed-panel">
          <div className="panel-heading">
            <div>
              <SectionEyebrow>01 / Daily signals</SectionEyebrow>
              <h2>行业动态</h2>
            </div>
            <span className="panel-count">10 / 10</span>
          </div>
          <p className="panel-intro">
            零售与 SaaS 混合浏览 · 按原始发布时间排序 · 点击展开分析
          </p>
          <div className="news-feed-list">
            {demoNews.map((item, index) => {
              const expanded = expandedNews === item.id
              return (
                <article
                  className={`news-card ${expanded ? 'news-card-expanded' : ''}`}
                  key={item.id}
                >
                  <div className="news-card-index">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="news-card-body">
                    <div className="news-meta">
                      <span className={`industry-badge industry-${item.industry}`}>
                        {item.industry === 'retail' ? '零售' : 'SaaS'}
                      </span>
                      <span>{item.theme}</span>
                      <span>{item.publishedAt}</span>
                    </div>
                    <button
                      className="news-title-button"
                      onClick={() => setExpandedNews(expanded ? null : item.id)}
                    >
                      <h3>{item.title}</h3>
                      <span className="expand-mark">{expanded ? '−' : '+'}</span>
                    </button>
                    <p className="news-summary">{item.summary}</p>
                    <div className="news-foot">
                      <span>{item.source}</span>
                      <a href={item.url} target="_blank" rel="noreferrer">
                        原文链接 ↗
                      </a>
                      <button
                        className={`bookmark-button ${bookmarks.includes(item.id) ? 'bookmark-active' : ''}`}
                        onClick={() => toggleBookmark(item.id)}
                        aria-label={
                          bookmarks.includes(item.id) ? '取消收藏' : '收藏动态'
                        }
                      >
                        {bookmarks.includes(item.id) ? '★' : '☆'}
                      </button>
                    </div>
                    {expanded && (
                      <div className="news-analysis">
                        <div>
                          <SectionEyebrow>Key change</SectionEyebrow>
                          <p>{item.analysis.change}</p>
                        </div>
                        <div>
                          <SectionEyebrow>Why it matters</SectionEyebrow>
                          <p>{item.analysis.impact}</p>
                        </div>
                        <div>
                          <SectionEyebrow>Related</SectionEyebrow>
                          <div className="tag-row">
                            {item.analysis.related.map((tag) => (
                              <span className="tag" key={tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="dashboard-side-column">
          <div className="content-panel inspiration-panel">
            <div className="panel-heading">
              <div>
                <SectionEyebrow>02 / One prompt</SectionEyebrow>
                <h2>今日研究灵感</h2>
              </div>
              <span className="single-badge">01</span>
            </div>
            <div
              className={`inspiration-card ${inspirationOpen ? 'inspiration-card-open' : ''}`}
            >
              <button
                className="inspiration-toggle"
                onClick={() => setInspirationOpen(!inspirationOpen)}
              >
                <span className="inspiration-orbit">✦</span>
                <span>
                  <strong>{demoInspiration.title}</strong>
                  <small>{demoInspiration.summary}</small>
                </span>
                <span className="expand-mark">{inspirationOpen ? '−' : '+'}</span>
              </button>
              {inspirationOpen && (
                <div className="inspiration-detail">
                  <div className="detail-block">
                    <SectionEyebrow>Why now</SectionEyebrow>
                    <p>{demoInspiration.rationale}</p>
                  </div>
                  <div className="detail-block">
                    <SectionEyebrow>建议研究问题</SectionEyebrow>
                    <p className="question-copy">{demoInspiration.question}</p>
                  </div>
                  <div className="detail-block">
                    <SectionEyebrow>可能价值</SectionEyebrow>
                    <ul>
                      {demoInspiration.value.map((value) => (
                        <li key={value}>{value}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="inspiration-actions">
                    <button className="button button-primary" onClick={createBrief}>
                      创建简报 <span>↗</span>
                    </button>
                    <button
                      className="button button-quiet"
                      onClick={() =>
                        setInspirationStatus(demoInspiration.id, 'snoozed')
                      }
                    >
                      暂不研究
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="panel-footer-note">
              <span className="mini-pulse" />
              每日只推荐 1 条 · 灵感不直接作为简报正文资料
            </div>
          </div>
          <div className="content-panel quick-links-panel">
            <SectionEyebrow>Explore the graph</SectionEyebrow>
            <h2>从资料开始继续</h2>
            <Link className="quick-link" to="/retail">
              <span className="quick-link-icon">◌</span>
              <span>
                <strong>零售行业图谱</strong>
                <small>市场扫描与企业档案</small>
              </span>
              <span>→</span>
            </Link>
            <Link className="quick-link" to="/saas">
              <span className="quick-link-icon">◎</span>
              <span>
                <strong>SaaS 行业图谱</strong>
                <small>行业总览与赛道企业</small>
              </span>
              <span>→</span>
            </Link>
            <Link className="quick-link" to="/research">
              <span className="quick-link-icon">✦</span>
              <span>
                <strong>研究工作台</strong>
                <small>灵感、简报与阅读模式</small>
              </span>
              <span>→</span>
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
