import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  demoInspiration,
  demoNews,
  retailCompanies,
  retailRegions,
  saasCompanies,
  saasTracks,
} from '../../data/demoData'
import { useDemoStore } from '../../lib/demoStore'
import { SectionEyebrow } from '../../components/ui/SectionEyebrow'
import type { Brief, BriefBlock } from '../../types'

const materialCatalog = [
  ...demoNews.map((item) => ({
    id: item.id,
    label: item.title,
    type: item.industry === 'retail' ? '行业动态 · 零售' : '行业动态 · SaaS',
  })),
  ...retailRegions.map((item) => ({
    id: item.id,
    label: `${item.name}市场 · ${item.marketSize}`,
    type: '市场扫描 · 零售',
  })),
  ...retailCompanies.map((item) => ({
    id: item.id,
    label: item.name,
    type: '企业档案 · 零售',
  })),
  ...saasTracks.map((item) => ({
    id: item.id,
    label: item.name,
    type: '赛道资料 · SaaS',
  })),
  ...saasCompanies.map((item) => ({
    id: item.id,
    label: item.name,
    type: '企业档案 · SaaS',
  })),
]

export function ResearchWorkspacePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'studio'
  const {
    briefs,
    inspirationStatuses,
    createBriefFromInspiration,
    setInspirationStatus,
    setBriefStatus,
  } = useDemoStore()
  const navigate = useNavigate()
  const inspirationStatus = inspirationStatuses[demoInspiration.id] ?? 'unread'
  const createBrief = async () => {
    const id = await createBriefFromInspiration()
    navigate(`/research/briefs/${id}/edit`)
  }

  return (
    <div className="research-page">
      <section className="page-intro">
        <SectionEyebrow>Research workspace</SectionEyebrow>
        <h1 className="page-title">研究工作台</h1>
        <p className="page-lede">
          把一个值得追问的问题，变成一份有证据、有结构、可以继续编辑的研究简报。当前版本只使用图谱中的演示资料。
        </p>
      </section>
      <div className="workspace-tabs">
        {[
          ['studio', '简报工作区'],
          ['inspiration', '研究灵感库'],
          ['briefs', '我的简报'],
        ].map(([id, label]) => (
          <button
            key={id}
            className={activeTab === id ? 'workspace-tab-active' : ''}
            onClick={() => setSearchParams({ tab: id })}
          >
            {label}
          </button>
        ))}
      </div>
      {activeTab === 'studio' && (
        <StudioTab
          briefs={briefs}
          onCreate={createBrief}
          onGoInspiration={() => setSearchParams({ tab: 'inspiration' })}
        />
      )}
      {activeTab === 'inspiration' && (
        <InspirationTab
          status={inspirationStatus}
          onCreate={createBrief}
          onStatus={(status) => setInspirationStatus(demoInspiration.id, status)}
        />
      )}
      {activeTab === 'briefs' && (
        <BriefsTab
          briefs={briefs}
          onOpen={(id) => navigate(`/research/briefs/${id}/edit`)}
          onRead={(id) => navigate(`/research/briefs/${id}/read`)}
          onStatus={setBriefStatus}
        />
      )}
    </div>
  )
}

export function BriefEditorPage() {
  const { briefId } = useParams()
  const navigate = useNavigate()
  const { briefs, updateBrief, setBriefStatus } = useDemoStore()
  const storedBrief = briefs.find((item) => item.id === briefId)
  const [draft, setDraft] = useState<Brief | null>(storedBrief ?? null)
  const [saveState, setSaveState] = useState('已保存')
  const [materialPickerOpen, setMaterialPickerOpen] = useState(false)

  useEffect(() => {
    if (!draft) return
    setSaveState('正在保存…')
    const timer = window.setTimeout(() => {
      void updateBrief({
        ...draft,
        updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      })
      setSaveState('已自动保存')
    }, 450)
    return () => window.clearTimeout(timer)
  }, [draft, updateBrief])

  if (!storedBrief || !draft) return <Navigate to="/research?tab=briefs" replace />
  const updateBlock = (blockId: string, field: keyof BriefBlock, value: string) =>
    setDraft({
      ...draft,
      blocks: draft.blocks.map((block) =>
        block.id === blockId ? { ...block, [field]: value } : block,
      ),
    })
  const addBlock = () =>
    setDraft({
      ...draft,
      blocks: [
        ...draft.blocks,
        {
          id: `${draft.id}-${Date.now()}`,
          title: '新模块',
          body: '在这里写下你的判断、证据和需要继续验证的内容。',
        },
      ],
    })
  const addMaterial = (id: string) =>
    setDraft({ ...draft, materials: [...draft.materials, id] })
  const removeMaterial = (id: string) =>
    setDraft({ ...draft, materials: draft.materials.filter((item) => item !== id) })
  const completeBrief = () => {
    void setBriefStatus(draft.id, 'completed')
    setDraft({ ...draft, status: 'completed' })
    navigate(`/research/briefs/${draft.id}/read`)
  }
  const availableMaterials = materialCatalog
    .filter((item) => !draft.materials.includes(item.id))
    .slice(0, 8)

  return (
    <div className="brief-editor-page">
      <div className="editor-topline">
        <Link className="back-link" to="/research?tab=briefs">
          ← 返回研究工作台
        </Link>
        <div className="editor-actions">
          <span className="save-status">
            <span className="save-status-dot" />
            {saveState}
          </span>
          <Link
            className="button button-secondary"
            to={`/research/briefs/${draft.id}/read`}
          >
            阅读模式 ↗
          </Link>
          <button className="button button-primary" onClick={completeBrief}>
            完成简报
          </button>
        </div>
      </div>
      <div className="editor-layout">
        <main className="editor-main">
          <SectionEyebrow>
            Brief draft · {draft.status === 'completed' ? '已完成' : '草稿'}
          </SectionEyebrow>
          <input
            className="editor-title-input"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
          <label className="editor-label" htmlFor="objective">
            研究目标
          </label>
          <textarea
            id="objective"
            className="editor-objective"
            value={draft.objective}
            onChange={(event) => setDraft({ ...draft, objective: event.target.value })}
          />
          <div className="editor-divider" />
          <div className="editor-section-heading">
            <div>
              <SectionEyebrow>Body modules</SectionEyebrow>
              <h2>正文模块</h2>
            </div>
            <button className="button button-quiet" onClick={addBlock}>
              + 添加模块
            </button>
          </div>
          <div className="editor-blocks">
            {draft.blocks.map((block, index) => (
              <div className="editor-block" key={block.id}>
                <div className="editor-block-number">0{index + 1}</div>
                <div className="editor-block-fields">
                  <input
                    value={block.title}
                    onChange={(event) =>
                      updateBlock(block.id, 'title', event.target.value)
                    }
                    aria-label={`模块 ${index + 1} 标题`}
                  />
                  <textarea
                    value={block.body}
                    onChange={(event) =>
                      updateBlock(block.id, 'body', event.target.value)
                    }
                    aria-label={`模块 ${index + 1} 正文`}
                  />
                  <button
                    className="remove-block-button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        blocks: draft.blocks.filter((item) => item.id !== block.id),
                      })
                    }
                  >
                    删除模块
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
        <aside className="editor-aside">
          <div className="editor-aside-panel">
            <SectionEyebrow>Material cards</SectionEyebrow>
            <div className="editor-aside-heading">
              <h3>已加入资料</h3>
              <span>{draft.materials.length}</span>
            </div>
            <p>资料卡片只在编辑区可见，最终阅读页只保留正文与文末来源。</p>
            <div className="material-list">
              {draft.materials.map((id) => (
                <MaterialCard key={id} id={id} onRemove={() => removeMaterial(id)} />
              ))}
            </div>
            <button
              className="button button-secondary button-wide"
              onClick={() => setMaterialPickerOpen(!materialPickerOpen)}
            >
              + 添加一条资料
            </button>
            {materialPickerOpen && (
              <div className="material-picker">
                {availableMaterials.length ? (
                  availableMaterials.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        addMaterial(item.id)
                        setMaterialPickerOpen(false)
                      }}
                    >
                      <span>{item.type}</span>
                      <strong>{item.label}</strong>
                    </button>
                  ))
                ) : (
                  <span>已加入当前演示资料。</span>
                )}
              </div>
            )}
          </div>
          <div className="editor-aside-panel editor-source-panel">
            <SectionEyebrow>Sources</SectionEyebrow>
            <h3>文末来源</h3>
            <p>完成简报后，来源会在阅读页底部集中展示。</p>
            <Link className="text-link" to={`/research/briefs/${draft.id}/read`}>
              预览来源列表 ↗
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export function BriefReadPage() {
  const { briefId } = useParams()
  const { briefs } = useDemoStore()
  const brief = briefs.find((item) => item.id === briefId)
  if (!brief) return <Navigate to="/research?tab=briefs" replace />
  return (
    <div className="read-page">
      <div className="read-topline">
        <Link className="back-link" to={`/research/briefs/${brief.id}/edit`}>
          ← 返回编辑
        </Link>
        <span className="read-mode-label">Reading mode · 演示版</span>
      </div>
      <article className="brief-reading">
        <SectionEyebrow>
          Strategy brief · {brief.status === 'completed' ? '已完成' : '草稿'}
        </SectionEyebrow>
        <h1>{brief.title}</h1>
        <p className="read-objective">{brief.objective}</p>
        <div className="read-rule" />
        {brief.blocks.map((block, index) => (
          <section className="read-section" key={block.id}>
            <div className="read-section-index">0{index + 1}</div>
            <div>
              <SectionEyebrow>Module {index + 1}</SectionEyebrow>
              <h2>{block.title}</h2>
              <p>{block.body}</p>
            </div>
          </section>
        ))}
        <section className="read-sources">
          <SectionEyebrow>Sources / 文末来源</SectionEyebrow>
          <h2>资料依据</h2>
          {brief.materials.map((id) => (
            <MaterialCard key={id} id={id} readOnly />
          ))}
        </section>
      </article>
    </div>
  )
}

function StudioTab({
  briefs,
  onCreate,
  onGoInspiration,
}: {
  briefs: Brief[]
  onCreate: () => void
  onGoInspiration: () => void
}) {
  return (
    <div className="studio-tab">
      <section className="studio-hero">
        <div>
          <SectionEyebrow>Start with a question</SectionEyebrow>
          <h2>从一个值得追问的问题，开始一份简报。</h2>
          <p>
            你可以从研究灵感进入，也可以直接打开已有草稿继续编辑。演示版资料只来自零售与
            SaaS 图谱。
          </p>
        </div>
        <button className="button button-primary" onClick={onGoInspiration}>
          查看今日灵感 ↗
        </button>
      </section>
      <div className="studio-columns">
        <div className="studio-card">
          <SectionEyebrow>Quick start</SectionEyebrow>
          <h3>今日研究灵感</h3>
          <p>{demoInspiration.summary}</p>
          <button className="button button-secondary" onClick={onCreate}>
            用这条灵感创建简报
          </button>
        </div>
        <div className="studio-card">
          <SectionEyebrow>Continue</SectionEyebrow>
          <h3>最近的简报</h3>
          {briefs.slice(0, 2).map((brief) => (
            <Link
              className="recent-brief-row"
              to={`/research/briefs/${brief.id}/edit`}
              key={brief.id}
            >
              <span>
                {brief.status === 'archived'
                  ? '已归档'
                  : brief.status === 'completed'
                    ? '已完成'
                    : '草稿'}
              </span>
              <strong>{brief.title}</strong>
              <small>{brief.updatedAt} ↗</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
function InspirationTab({
  status,
  onCreate,
  onStatus,
}: {
  status: string
  onCreate: () => void
  onStatus: (status: 'researched' | 'snoozed') => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="inspiration-library">
      <div className="library-heading">
        <div>
          <SectionEyebrow>One prompt / Today</SectionEyebrow>
          <h2>研究灵感库</h2>
          <p>灵感负责提出研究主题，不直接作为简报正文资料。</p>
        </div>
        <span className="status-pill">
          {status === 'unread'
            ? '未研究'
            : status === 'snoozed'
              ? '暂不研究'
              : '已研究'}
        </span>
      </div>
      <div className={`library-inspiration ${open ? 'library-inspiration-open' : ''}`}>
        <button className="library-inspiration-top" onClick={() => setOpen(!open)}>
          <span className="inspiration-orbit">✦</span>
          <span>
            <strong>{demoInspiration.title}</strong>
            <small>{demoInspiration.summary}</small>
          </span>
          <span className="expand-mark">{open ? '−' : '+'}</span>
        </button>
        {open && (
          <div className="library-detail">
            <div className="detail-grid">
              <DetailItem title="推荐理由" body={demoInspiration.rationale} />
              <DetailItem title="建议研究问题" body={demoInspiration.question} />
              <DetailItem
                title="相关动态与企业"
                body={[...demoInspiration.signals, ...demoInspiration.entities].join(
                  ' · ',
                )}
              />
            </div>
            <div className="inspiration-actions">
              <button className="button button-primary" onClick={onCreate}>
                创建简报 ↗
              </button>
              <button
                className="button button-quiet"
                onClick={() => onStatus('researched')}
              >
                标记已研究
              </button>
              <button
                className="button button-quiet"
                onClick={() => onStatus('snoozed')}
              >
                暂不研究
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
function BriefsTab({
  briefs,
  onOpen,
  onRead,
  onStatus,
}: {
  briefs: Brief[]
  onOpen: (id: string) => void
  onRead: (id: string) => void
  onStatus: (id: string, status: 'archived' | 'draft' | 'completed') => void
}) {
  return (
    <div className="briefs-library">
      <div className="library-heading">
        <div>
          <SectionEyebrow>Saved research</SectionEyebrow>
          <h2>我的简报</h2>
          <p>按最近更新时间排列。演示版支持草稿、已完成和已归档状态。</p>
        </div>
        <button
          className="button button-primary"
          onClick={() => onOpen(briefs[0]?.id ?? '')}
        >
          继续编辑 ↗
        </button>
      </div>
      <div className="brief-list">
        {briefs.map((brief) => (
          <div className="brief-list-row" key={brief.id}>
            <div className="brief-list-status">
              <span className={`brief-status-dot status-${brief.status}`} />
              {brief.status === 'draft'
                ? '草稿'
                : brief.status === 'completed'
                  ? '已完成'
                  : '已归档'}
            </div>
            <div className="brief-list-main">
              <h3>{brief.title}</h3>
              <p>{brief.objective}</p>
              <small>
                最近更新 {brief.updatedAt} · {brief.materials.length} 条资料
              </small>
            </div>
            <div className="brief-list-actions">
              <button onClick={() => onOpen(brief.id)}>编辑</button>
              <button onClick={() => onRead(brief.id)}>阅读</button>
              {brief.status !== 'archived' && (
                <button onClick={() => onStatus(brief.id, 'archived')}>归档</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function MaterialCard({
  id,
  onRemove,
  readOnly = false,
}: {
  id: string
  onRemove?: () => void
  readOnly?: boolean
}) {
  const item = materialCatalog.find((entry) => entry.id === id)
  return (
    <div className="material-card">
      <span className="material-card-type">{item?.type ?? '演示资料'}</span>
      <strong>{item?.label ?? id}</strong>
      <small>来源与数据日期将在数据库阶段接入</small>
      {!readOnly && (
        <button onClick={onRemove} aria-label="移除资料">
          ×
        </button>
      )}
    </div>
  )
}
function DetailItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="detail-item">
      <SectionEyebrow>{title}</SectionEyebrow>
      <p>{body}</p>
    </div>
  )
}
