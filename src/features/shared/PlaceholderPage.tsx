import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { SectionEyebrow } from '../../components/ui/SectionEyebrow'

type PlaceholderPageKey =
  | 'news'
  | 'entities'
  | 'entity-detail'
  | 'research'
  | 'briefs'
  | 'brief-edit'
  | 'brief-read'
  | 'settings'

const pageCopy: Record<
  PlaceholderPageKey,
  { eyebrow: string; title: string; body: string }
> = {
  news: {
    eyebrow: '01 / Signal feed',
    title: '行业动态',
    body: '这里将承载来源、发布时间、摘要、标签和收藏状态。',
  },
  entities: {
    eyebrow: '02 / Entity intelligence',
    title: '主体档案',
    body: '市场、客户与竞对会在这里形成结构化、可追溯的档案。',
  },
  'entity-detail': {
    eyebrow: 'Entity profile',
    title: '主体详情',
    body: '主体事实、来源和人工确认入口将在这里展开。',
  },
  research: {
    eyebrow: '03 / Research prompts',
    title: '研究方向',
    body: '你的研究主题、推荐依据和保存状态会集中在这里。',
  },
  briefs: {
    eyebrow: '04 / Brief studio',
    title: '简报工作区',
    body: '从一个明确的问题开始，逐步组织资料、判断和来源。',
  },
  'brief-edit': {
    eyebrow: 'Brief studio',
    title: '编辑简报',
    body: '标题、正文、内容块和文末来源将共享一个清晰的编辑空间。',
  },
  'brief-read': {
    eyebrow: 'Reading mode',
    title: '简报阅读模式',
    body: '最终简报会以适合阅读和分享的网页形式呈现。',
  },
  settings: {
    eyebrow: 'Workspace settings',
    title: '信息源设置',
    body: '在这里维护可信来源和关键词，控制工作台接收什么信息。',
  },
}

export function PlaceholderPage({ page }: { page: PlaceholderPageKey }) {
  const copy = pageCopy[page]

  return (
    <div className="placeholder-page">
      <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
      <div className="placeholder-heading-row">
        <div>
          <h1 className="page-title">{copy.title}</h1>
          <p className="page-lede">{copy.body}</p>
        </div>
        {page === 'briefs' && (
          <Link to="/briefs/new" className="button button-primary">
            新建简报 <span>+</span>
          </Link>
        )}
      </div>
      <div className="placeholder-panel">
        <EmptyState
          eyebrow="Step 1 / App shell"
          title="这个页面已经准备好接入下一阶段。"
          description="当前阶段先搭建可访问、可扩展的页面骨架。数据与真实业务流程会在后续 Build Step 中逐步接入。"
        />
      </div>
    </div>
  )
}
