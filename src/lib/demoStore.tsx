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
import { supabase } from './supabase'

type SupabaseBriefRow = {
  id: string
  title: string
  objective: string | null
  status: string
  inspiration_id: string | null
  updated_at: string
  brief_blocks: Array<{ id: string; title: string; body: string; sort_order: number }>
  brief_materials: Array<{ material_id: string; sort_order: number }>
}

function getMaterialType(id: string) {
  if (id.startsWith('news-')) return 'news'
  if (id.startsWith('retail-east') || id.startsWith('retail-south') || id.startsWith('retail-north')) {
    return 'market_region'
  }
  return 'company'
}

const STORAGE_KEY = 'signal-demo-store-v2'

const initialState: DemoStoreState = {
  bookmarks: [],
  inspirationStatuses: {},
  briefs: demoBriefs,
}

type DemoStore = DemoStoreState & {
  toggleBookmark: (id: string) => void
  setInspirationStatus: (id: string, status: InspirationStatus) => void
  createBriefFromInspiration: () => Promise<string>
  updateBrief: (brief: Brief) => Promise<void>
  setBriefStatus: (id: string, status: BriefStatus) => Promise<void>
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
  const [loadedFromSupabase, setLoadedFromSupabase] = useState(false)

  useEffect(() => {
    if (!supabase || loadedFromSupabase) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, loadedFromSupabase])

  useEffect(() => {
    if (!supabase) return
    const client = supabase

    let cancelled = false
    const loadBriefs = async () => {
      const { data: briefRows, error: briefError } = await client
        .from('briefs')
        .select('id, title, objective, status, inspiration_id, updated_at, brief_blocks(id, title, body, sort_order), brief_materials(material_id, sort_order)')
        .order('updated_at', { ascending: false })

      if (briefError) {
        console.warn('Supabase briefs load failed; using local demo data.', briefError)
        return
      }

      const briefs: Brief[] = ((briefRows ?? []) as SupabaseBriefRow[]).map((row) => ({
        id: row.id,
        title: row.title,
        objective: row.objective ?? '',
        status: row.status as BriefStatus,
        updatedAt: row.updated_at,
        inspirationId: row.inspiration_id ?? undefined,
        materials: [...(row.brief_materials ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => item.material_id),
        blocks: [...(row.brief_blocks ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((block) => ({ id: block.id, title: block.title, body: block.body })),
      }))

      if (!cancelled) {
        setState((current) => ({ ...current, briefs }))
        setLoadedFromSupabase(true)
      }
    }

    void loadBriefs()
    return () => {
      cancelled = true
    }
  }, [])

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

  const createBriefFromInspiration = useCallback(async () => {
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
    if (supabase) {
      const { error } = await supabase.from('briefs').insert({
        id: brief.id,
        title: brief.title,
        objective: brief.objective,
        status: brief.status,
        // The current inspiration is still mock data, so it does not exist in
        // research_inspirations yet. Keep this nullable until that table is
        // migrated; otherwise the foreign key blocks creating the brief.
        inspiration_id: null,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      const { error: blockError } = await supabase.from('brief_blocks').insert(
        brief.blocks.map((block, sort_order) => ({
          id: block.id,
          brief_id: brief.id,
          title: block.title,
          body: block.body,
          sort_order,
        })),
      )
      if (blockError) throw blockError
      const { error: materialError } = await supabase.from('brief_materials').insert(
        brief.materials.map((material_id, sort_order) => ({
          brief_id: brief.id,
          material_id,
          material_type: getMaterialType(material_id),
          sort_order,
        })),
      )
      if (materialError) throw materialError
    }
    return id
  }, [])

  const updateBrief = useCallback(async (brief: Brief) => {
    setState((current) => ({
      ...current,
      briefs: current.briefs.map((item) => (item.id === brief.id ? brief : item)),
    }))
    if (!supabase) return
    const { error } = await supabase
      .from('briefs')
      .update({
        title: brief.title,
        objective: brief.objective,
        status: brief.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', brief.id)
    if (error) throw error
    const { error: deleteBlocksError } = await supabase
      .from('brief_blocks')
      .delete()
      .eq('brief_id', brief.id)
    if (deleteBlocksError) throw deleteBlocksError
    const { error: blockError } = await supabase.from('brief_blocks').insert(
      brief.blocks.map((block, sort_order) => ({
        id: block.id,
        brief_id: brief.id,
        title: block.title,
        body: block.body,
        sort_order,
      })),
    )
    if (blockError) throw blockError
    const { error: deleteMaterialsError } = await supabase
      .from('brief_materials')
      .delete()
      .eq('brief_id', brief.id)
    if (deleteMaterialsError) throw deleteMaterialsError
    const { error: materialError } = await supabase.from('brief_materials').insert(
      brief.materials.map((material_id, sort_order) => ({
        brief_id: brief.id,
        material_id,
        material_type: getMaterialType(material_id),
        sort_order,
      })),
    )
    if (materialError) throw materialError
  }, [])

  const setBriefStatus = useCallback(async (id: string, status: BriefStatus) => {
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
    if (!supabase) return
    const { error } = await supabase
      .from('briefs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
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
