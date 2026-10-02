/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { Brief, BriefStatus, DemoStoreState, InspirationStatus } from '../types'
import { demoBriefs, demoInspiration } from '../data/demoData'

const STORAGE_KEY = 'signal-demo-store-v2'

const initialState: DemoStoreState = {
  bookmarks: [],
  inspirationStatuses: {},
  briefs: demoBriefs,
}

type DemoStore = DemoStoreState & {
  toggleBookmark: (id: string) => void
  setInspirationStatus: (id: string, status: InspirationStatus) => void
  createBriefFromInspiration: () => string
  updateBrief: (brief: Brief) => void
  setBriefStatus: (id: string, status: BriefStatus) => void
}

const DemoStoreContext = createContext<DemoStore | null>(null)

function readInitialState(): DemoStoreState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialState
    const parsed = JSON.parse(stored) as Partial<DemoStoreState>
    return {
      bookmarks: parsed.bookmarks ?? initialState.bookmarks,
      inspirationStatuses:
        parsed.inspirationStatuses ?? initialState.inspirationStatuses,
      briefs: parsed.briefs ?? initialState.briefs,
    }
  } catch {
    return initialState
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoStoreState>(readInitialState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const toggleBookmark = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      bookmarks: current.bookmarks.includes(id)
        ? current.bookmarks.filter((item) => item !== id)
        : [...current.bookmarks, id],
    }))
  }, [])

  const setInspirationStatus = useCallback((id: string, status: InspirationStatus) => {
    setState((current) => ({
      ...current,
      inspirationStatuses: { ...current.inspirationStatuses, [id]: status },
    }))
  }, [])

  const createBriefFromInspiration = useCallback(() => {
    const id = `brief-${Date.now()}`
    const brief: Brief = {
      id,
      title: demoInspiration.title,
      objective: demoInspiration.question,
      status: 'draft',
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      inspirationId: demoInspiration.id,
      materials: demoInspiration.signals,
      blocks: [
        { id: `${id}-01`, title: '研究目标', body: demoInspiration.question },
        { id: `${id}-02`, title: '初步判断', body: demoInspiration.summary },
        {
          id: `${id}-03`,
          title: '待验证问题',
          body: '从区域市场、企业档案和行业赛道中补充能够验证该判断的资料。',
        },
      ],
    }
    setState((current) => ({ ...current, briefs: [brief, ...current.briefs] }))
    return id
  }, [])

  const updateBrief = useCallback((brief: Brief) => {
    setState((current) => ({
      ...current,
      briefs: current.briefs.map((item) => (item.id === brief.id ? brief : item)),
    }))
  }, [])

  const setBriefStatus = useCallback((id: string, status: BriefStatus) => {
    setState((current) => ({
      ...current,
      briefs: current.briefs.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
            }
          : item,
      ),
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      toggleBookmark,
      setInspirationStatus,
      createBriefFromInspiration,
      updateBrief,
      setBriefStatus,
    }),
    [
      state,
      toggleBookmark,
      setInspirationStatus,
      createBriefFromInspiration,
      updateBrief,
      setBriefStatus,
    ],
  )

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore() {
  const store = useContext(DemoStoreContext)
  if (!store) throw new Error('useDemoStore must be used inside DemoStoreProvider')
  return store
}
