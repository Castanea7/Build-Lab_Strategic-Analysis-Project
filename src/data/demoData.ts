import type {
  Brief,
  MarketRegion,
  NewsItem,
  ResearchInspiration,
  RetailCompany,
  SaasCompany,
  SaasTrack,
} from '../types'

const newsSeed = [
  [
    'retail',
    '消费结构',
    '高频刚需与即时零售成为城市消费的新增长组合',
    '即时履约、社区密度和品类精选正在重新定义传统零售的便利性边界。',
    '09:20',
    '零售',
    '即时零售',
  ],
  [
    'saas',
    'AI 应用',
    '企业软件采购从单点工具转向可量化的工作流结果',
    'AI 能力逐渐嵌入销售、客服和财务工作流，采购方更关注结果而非功能数量。',
    '08:45',
    'SaaS',
    'AI 应用',
  ],
  [
    'retail',
    '渠道变化',
    '线下门店重新成为品牌试用、服务和即时交付的综合节点',
    '门店价值不再只由坪效衡量，体验、服务和线上订单承接能力开始被一起评估。',
    '17:10',
    '零售',
    '全渠道',
  ],
  [
    'saas',
    '商业模式',
    '垂直 SaaS 通过行业数据和服务流程提升客户黏性',
    '在通用工具趋于同质化后，行业知识和业务数据成为垂直产品的重要壁垒。',
    '15:35',
    'SaaS',
    '垂直软件',
  ],
  [
    'retail',
    '竞争格局',
    '区域零售企业开始用小业态组合应对消费半径变化',
    '大店、小店和到家业务的组合，让企业可以在同一市场覆盖不同消费频次。',
    '13:00',
    '零售',
    '业态组合',
  ],
  [
    'saas',
    '客户经营',
    '中型企业更重视 SaaS 工具的实施速度和内部使用率',
    '预算审慎的背景下，软件采购从“买什么”进一步转向“多久能用起来”。',
    '11:25',
    'SaaS',
    '客户经营',
  ],
  [
    'retail',
    '供应链',
    '零售商把库存可见性作为跨渠道增长的基础设施',
    '线上线下库存协同可以减少缺货与积压，但也提高了系统和运营的复杂度。',
    '16:40',
    '零售',
    '供应链',
  ],
  [
    'saas',
    '资本与融资',
    '软件市场更偏好能证明经营效率的增长故事',
    '投资和采购判断同时强调增长质量、现金流和客户结构的可持续性。',
    '14:15',
    'SaaS',
    '资本市场',
  ],
  [
    'retail',
    '品类机会',
    '健康、宠物与家庭服务成为区域零售的增量品类',
    '高频消费之外，围绕家庭生命周期的服务和专业品类在扩展零售边界。',
    '10:05',
    '零售',
    '新增长',
  ],
  [
    'saas',
    '数据基础设施',
    '数据治理能力成为 AI 软件规模化部署的前置条件',
    '企业在引入 AI 工具前，先要解决数据口径、权限和流程连接等基础问题。',
    '18:30',
    'SaaS',
    '数据治理',
  ],
] as const

const analysisByTheme: Record<string, NewsItem['analysis']> = {
  消费结构: {
    change: '增长从单纯扩张门店，转向围绕高频场景提升履约密度与复购。',
    impact: '区域零售企业需要重新评估门店网络、前置仓和线上订单之间的协同方式。',
    related: ['华东市场', '社区零售', '履约网络'],
  },
  'AI 应用': {
    change: 'SaaS 竞争焦点从模块覆盖转向业务流程中的可验证产出。',
    impact: '产品价值证明、集成能力与按结果定价，可能比新增功能更影响续费。',
    related: ['企业服务', '工作流自动化', '续费率'],
  },
  渠道变化: {
    change: '门店从销售终点变成商品体验、服务交付和流量运营的中间节点。',
    impact: '零售企业需要把门店经营指标从单一销售额扩展到全渠道贡献。',
    related: ['门店网络', '全渠道', '服务收入'],
  },
  商业模式: {
    change: '产品边界由“软件订阅”向“软件 + 行业服务 + 数据资产”延伸。',
    impact: '垂直赛道的竞争者可能以更高交付深度换取更长客户生命周期。',
    related: ['垂直 SaaS', '行业数据', '客户成功'],
  },
  竞争格局: {
    change: '业态组合成为区域密度和客群覆盖的主要增长杠杆。',
    impact: '单一门店模型的效率优势可能被多业态协同能力重新拉开。',
    related: ['华南市场', '社区店', '大卖场'],
  },
  客户经营: {
    change: '实施周期和活跃使用率成为影响扩容与续费的关键变量。',
    impact: 'SaaS 企业需要将 onboarding、模板化和客户成功纳入产品竞争力。',
    related: ['中型企业', '客户成功', '净收入留存'],
  },
  供应链: {
    change: '库存数据从后台记录转变为影响销售承诺和履约效率的实时能力。',
    impact: '供应链系统、门店系统和电商系统之间的连接质量会直接影响增长成本。',
    related: ['库存周转', '供应链软件', '履约'],
  },
  资本与融资: {
    change: '单纯追求规模的叙事，让位于增长、利润和客户质量之间的平衡。',
    impact: 'SaaS 企业需要更早建立可拆解的单位经济模型和留存指标体系。',
    related: ['单位经济', '增长效率', '融资'],
  },
  品类机会: {
    change: '品类增长从价格和促销驱动，转向专业服务与持续关系驱动。',
    impact: '区域企业可以通过专业品类提高客单价和到店频率，但需要新的运营能力。',
    related: ['家庭消费', '专业服务', '品类扩张'],
  },
  数据基础设施: {
    change: 'AI 项目成败越来越取决于数据可用性，而不是模型演示效果。',
    impact: '能够帮助客户完成数据连接与治理的产品，会拥有更强的部署深度。',
    related: ['数据治理', 'AI 部署', '企业 IT'],
  },
}

export const demoNews: NewsItem[] = newsSeed.map((item, index) => {
  const [industry, theme, title, summary, time, tag, subtag] = item
  const date =
    index < 2
      ? '2026-10-01'
      : index < 6
        ? '2026-09-30'
        : index < 9
          ? '2026-09-29'
          : '2026-09-28'
  return {
    id: `news-${String(index + 1).padStart(2, '0')}`,
    industry,
    theme,
    title,
    summary,
    source: 'Signal 研究台 · 演示数据',
    publishedAt: `${date} ${time}`,
    url: `https://example.com/demo/${industry}-${index + 1}`,
    tags: [tag, subtag],
    analysis: analysisByTheme[theme],
  }
})

export const demoInspiration: ResearchInspiration = {
  id: 'inspiration-01',
  title: '零售与 SaaS 的下一场竞争，是否都在争夺“更短的反馈回路”？',
  summary:
    '零售通过门店与库存即时反馈，SaaS 通过工作流与使用数据反馈，两个行业正在出现相似的效率逻辑。',
  rationale:
    '过去 24 小时里，零售动态集中在履约密度与库存可见性，SaaS 动态集中在使用率、数据治理和结果证明，跨行业的共同变量已经足够清晰。',
  question: '企业如何通过缩短从客户行为到经营决策的反馈回路，获得可持续的效率优势？',
  signals: ['news-01', 'news-02', 'news-06', 'news-07', 'news-10'],
  entities: ['华东市场', '零售经营软件', '云脉科技'],
  value: [
    '识别跨行业的效率机会',
    '判断软件与零售能力的结合点',
    '支持下一轮重点研究取舍',
  ],
}

export const retailRegions: MarketRegion[] = [
  {
    id: 'retail-east',
    name: '华东',
    scope: 'china',
    marketSize: '¥ 4.8 万亿',
    growth: '+8.6%',
    year: '2025',
    color: '#e7b3c2',
    description:
      '高密度城市群与成熟供应链共同构成中国零售最复杂、最具示范性的区域市场。',
    segments: ['综合零售', '即时零售', '健康与宠物'],
    participants: ['综合商超集团', '平台型零售商', '区域便利店'],
    opportunity: '在成熟消费市场中，便利性、专业服务和全渠道效率仍有结构性增长空间。',
    structure:
      '市场参与者分层明显，头部企业承担规模效率，区域企业依靠场景和密度保持竞争力。',
  },
  {
    id: 'retail-south',
    name: '华南',
    scope: 'china',
    marketSize: '¥ 3.7 万亿',
    growth: '+9.3%',
    year: '2025',
    color: '#b9d7e9',
    description: '制造业、跨境贸易与年轻人口结构，让华南市场呈现出更强的渠道创新速度。',
    segments: ['社区零售', '跨境消费', '餐饮零售'],
    participants: ['区域连锁', '平台零售商', '新消费品牌'],
    opportunity: '围绕年轻客群、跨境供给和高频生活服务，新的小业态仍有试验空间。',
    structure: '企业竞争更关注反应速度和本地化运营，渠道创新往往先于全国性标准化。',
  },
  {
    id: 'retail-north',
    name: '华北',
    scope: 'china',
    marketSize: '¥ 3.2 万亿',
    growth: '+6.8%',
    year: '2025',
    color: '#d8c7e5',
    description:
      '核心城市消费能力与广域市场并存，零售企业需要在城市密度和区域覆盖之间平衡。',
    segments: ['大卖场', '社区服务', '家庭消费'],
    participants: ['全国连锁', '地方零售集团', '线上平台'],
    opportunity: '门店网络升级、家庭服务和库存效率是传统零售转型的主要抓手。',
    structure: '竞争格局相对分散，区域运营能力和供应链效率决定规模扩张的质量。',
  },
]

const retailMetrics = (
  revenue: string,
  growth: string,
  stores: string,
  employees: string,
  value: string,
) => [
  {
    label: '最近年度营收',
    value: revenue,
    note: '2025 年 · 演示口径',
    trend: ['580', '642', '710', '790', revenue.replace(/[^0-9.]/g, '')],
  },
  { label: '营收同比', value: growth, note: '2025 年' },
  { label: '门店规模', value: stores, note: '截至 2025 年' },
  { label: '员工规模', value: employees, note: '2025 年估算' },
  {
    label: '市值 / 估值',
    value,
    note: '2025 年末演示值',
    trend: ['760', '830', '940', '1040', '1180'],
  },
]

export const retailCompanies: RetailCompany[] = [
  {
    id: 'retail-company-01',
    name: '邻里优选集团',
    shortName: '邻里优选',
    description: '覆盖城市社区与即时履约场景的综合零售企业，重点经营高频家庭消费。',
    founded: '2008',
    headquarters: '上海，中国',
    position: '主要参与者',
    logoText: '邻',
    metrics: retailMetrics('¥ 862 亿', '+11.2%', '2,460 家', '约 6.8 万', '¥ 1,180 亿'),
    formats: ['社区超市', '便利店', '即时零售前置点'],
    categories: ['生鲜食品', '家庭日用', '健康与宠物'],
    operations: ['高频刚需为主', '线上订单由门店就近履约', '区域供应链自营与合作并行'],
    coverage: ['华东 1,380 家', '华南 620 家', '华北 460 家'],
    timeline: [
      { year: '2008', title: '成立', description: '从华东社区食品零售起步。' },
      {
        year: '2016',
        title: '建立区域供应链',
        description: '开始建设生鲜和日用商品的区域仓配体系。',
      },
      {
        year: '2021',
        title: '即时零售升级',
        description: '将门店网络接入统一的线上履约系统。',
      },
      {
        year: '2025',
        title: '扩展家庭服务',
        description: '将健康、宠物和到家服务纳入重点增长品类。',
      },
    ],
    strategy: [
      '通过门店密度缩短履约半径',
      '提高专业品类和服务收入占比',
      '用统一库存视图支持全渠道经营',
    ],
    sources: ['企业公开资料（演示数据）', '行业观察摘要（演示数据）'],
  },
  {
    id: 'retail-company-02',
    name: '远见生活商业',
    shortName: '远见生活',
    description:
      '以城市综合商业和精选业态为核心的区域零售集团，持续探索体验与服务融合。',
    founded: '1998',
    headquarters: '广州，中国',
    position: '头部企业',
    logoText: '远',
    metrics: retailMetrics(
      '¥ 1,260 亿',
      '+7.4%',
      '1,120 家',
      '约 8.3 万',
      '¥ 1,760 亿',
    ),
    formats: ['城市综合店', '购物中心', '精选超市'],
    categories: ['食品与餐饮', '生活方式', '家庭服务'],
    operations: [
      '体验型场景驱动',
      '线上线下会员统一运营',
      '核心城市深耕与区域复制并行',
    ],
    coverage: ['华南 540 家', '华东 340 家', '华北 240 家'],
    timeline: [
      { year: '1998', title: '成立', description: '从华南城市商业项目起步。' },
      {
        year: '2012',
        title: '建立综合业态',
        description: '形成购物中心、精选超市和生活方式的组合。',
      },
      {
        year: '2019',
        title: '会员体系升级',
        description: '把消费、服务和内容体验纳入统一会员体系。',
      },
      {
        year: '2024',
        title: '区域复制',
        description: '将成熟的城市运营模型复制到华东核心城市。',
      },
    ],
    strategy: [
      '把门店变成消费体验和服务节点',
      '提高会员经营与家庭服务收入',
      '以城市群为单位提升运营复用率',
    ],
    sources: ['企业公开资料（演示数据）', '行业观察摘要（演示数据）'],
  },
]

export const saasTracks: SaasTrack[] = [
  {
    id: 'saas-track-crm',
    name: '客户经营',
    group: '通用赛道',
    summary: '围绕客户、销售与服务流程，帮助企业形成可追踪的增长闭环。',
    marketSize: '¥ 1,180 亿',
    growth: '+18.2%',
    drivers: ['销售流程标准化', '客户数据统一', 'AI 辅助销售与客服'],
    leaders: ['云脉 CRM', 'FlowDesk', 'SalesLoop'],
    products: ['客户管理', '销售自动化', '客服与客户成功'],
    businessModel: '以席位订阅为主，结合增值模块和实施服务。',
  },
  {
    id: 'saas-track-data',
    name: '数据与智能决策',
    group: '通用赛道',
    summary: '将企业数据治理、分析和 AI 决策能力连接到日常经营流程。',
    marketSize: '¥ 930 亿',
    growth: '+22.4%',
    drivers: ['数据治理', '管理报表自动化', 'AI 决策辅助'],
    leaders: ['InsightHub', '数策云', 'MetricOS'],
    products: ['数据平台', '经营分析', 'AI 助手'],
    businessModel: '平台订阅与数据用量计费并存，交付深度影响客单价。',
  },
  {
    id: 'saas-track-retail',
    name: '零售经营软件',
    group: '垂直赛道',
    summary: '服务零售企业的门店、库存、会员和全渠道经营软件集合。',
    marketSize: '¥ 760 亿',
    growth: '+16.8%',
    drivers: ['全渠道库存', '门店数字化', '会员精细运营'],
    leaders: ['RetailOS', '店易云', 'Commerce Grid'],
    products: ['门店管理', '库存与供应链', '会员与营销'],
    businessModel: '基础平台订阅结合门店数、订单量或模块增值收费。',
  },
  {
    id: 'saas-track-hr',
    name: '人力与协作',
    group: '通用赛道',
    summary: '围绕组织、人才和协作效率，帮助企业降低管理摩擦。',
    marketSize: '¥ 680 亿',
    growth: '+13.6%',
    drivers: ['组织数字化', '灵活用工', '协作自动化'],
    leaders: ['PeopleFlow', 'WorkNest', '智联组织'],
    products: ['人事管理', '绩效与学习', '协同工作流'],
    businessModel: '按员工数或席位订阅，实施和咨询服务贡献额外收入。',
  },
]

const saasMetrics = (
  revenue: string,
  growth: string,
  customers: string,
  employees: string,
  funding: string,
) => [
  {
    label: '最近年度营收',
    value: revenue,
    note: '2025 年 · 演示口径',
    trend: ['7.2', '9.4', '12.1', '15.3', revenue.replace(/[^0-9.]/g, '')],
  },
  { label: '营收同比', value: growth, note: '2025 年' },
  { label: '客户 / 覆盖门店', value: customers, note: '截至 2025 年' },
  { label: '员工规模', value: employees, note: '2025 年估算' },
  { label: '融资状态', value: funding, note: '演示信息' },
]

export const saasCompanies: SaasCompany[] = [
  {
    id: 'saas-company-01',
    name: '云脉科技',
    shortName: '云脉',
    description: '为成长型企业提供客户经营、销售自动化和客户成功工具的 SaaS 企业。',
    founded: '2015',
    headquarters: '深圳，中国',
    position: '主要参与者',
    logoText: '云',
    metrics: saasMetrics('¥ 18.6 亿', '+21.5%', '12,800 家', '约 2,300 人', 'C 轮后'),
    products: ['客户数据平台', '销售自动化', '客户成功工作台', 'AI 跟进助手'],
    customers: ['中型消费企业', '连锁零售', '专业服务公司'],
    businessModel: ['按席位订阅', '高级 AI 模块增值', '复杂场景实施服务'],
    competition: [
      '产品覆盖完整度较高',
      '行业模板是主要差异化',
      '需要持续证明 AI 对续费的贡献',
    ],
    timeline: [
      { year: '2015', title: '成立', description: '从销售流程工具切入成长型企业。' },
      {
        year: '2019',
        title: '拓展客户成功',
        description: '将服务与续费管理纳入产品矩阵。',
      },
      {
        year: '2023',
        title: 'AI 产品线',
        description: '推出面向销售和客服的 AI 辅助功能。',
      },
      {
        year: '2025',
        title: '行业模板',
        description: '围绕零售和专业服务推出行业化工作流。',
      },
    ],
    sources: ['企业公开资料（演示数据）', 'SaaS 行业观察（演示数据）'],
  },
  {
    id: 'saas-company-02',
    name: 'RetailOS',
    shortName: 'RetailOS',
    description:
      '面向连锁零售企业提供门店、库存、会员和全渠道经营能力的垂直 SaaS 企业。',
    founded: '2018',
    headquarters: '杭州，中国',
    position: '新兴企业',
    logoText: 'R',
    metrics: saasMetrics('¥ 6.4 亿', '+36.8%', '48,000 家门店', '约 860 人', 'B 轮后'),
    products: ['门店经营中台', '库存与补货', '会员营销', '全渠道订单'],
    customers: ['区域连锁', '品牌零售商', '生活服务门店'],
    businessModel: ['按门店订阅', '订单量增值收费', '行业实施与集成服务'],
    competition: [
      '垂直场景深度较强',
      '实施速度是重要卖点',
      '需要扩大生态集成与行业覆盖',
    ],
    timeline: [
      { year: '2018', title: '成立', description: '从连锁门店 POS 和库存管理切入。' },
      { year: '2021', title: '全渠道升级', description: '将门店库存与线上订单连接。' },
      {
        year: '2024',
        title: '会员产品',
        description: '增加会员运营和营销自动化模块。',
      },
      {
        year: '2025',
        title: '扩展生活服务',
        description: '进入更多高频、多门店服务业态。',
      },
    ],
    sources: ['企业公开资料（演示数据）', 'SaaS 行业观察（演示数据）'],
  },
]

export const demoBriefs: Brief[] = [
  {
    id: 'brief-demo-01',
    title: '中国零售市场增长机会初探',
    objective: '快速判断中国区域零售市场中，哪些增长机会值得进入下一轮研究。',
    status: 'draft',
    updatedAt: '2026-10-01 16:20',
    materials: ['retail-east', 'retail-company-01'],
    blocks: [
      {
        id: 'block-demo-01',
        title: '核心判断',
        body: '区域零售的增长机会正在从单点扩店，转向门店密度、即时履约和专业品类的组合效率。',
      },
      {
        id: 'block-demo-02',
        title: '关键证据',
        body: '华东市场规模和增长率保持领先；邻里优选通过社区门店与即时履约形成高频消费网络。',
      },
      {
        id: 'block-demo-03',
        title: '下一步研究',
        body: '需要进一步比较不同区域的履约成本、门店模型和家庭服务品类渗透率。',
      },
    ],
  },
]
