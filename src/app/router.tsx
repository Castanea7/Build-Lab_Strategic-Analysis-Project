import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import {
  RetailCompanyPage,
  RetailGraphPage,
  RetailRegionPage,
} from '../features/retail/RetailPages'
import {
  SaasCompanyPage,
  SaasGraphPage,
  SaasTrackPage,
} from '../features/saas/SaasPages'
import {
  BriefEditorPage,
  BriefReadPage,
  ResearchWorkspacePage,
} from '../features/research/ResearchPages'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="retail" element={<RetailGraphPage />} />
          <Route path="retail/regions/:regionId" element={<RetailRegionPage />} />
          <Route path="retail/companies/:companyId" element={<RetailCompanyPage />} />
          <Route path="saas" element={<SaasGraphPage />} />
          <Route path="saas/tracks/:trackId" element={<SaasTrackPage />} />
          <Route path="saas/companies/:companyId" element={<SaasCompanyPage />} />
          <Route path="research" element={<ResearchWorkspacePage />} />
          <Route path="research/briefs/:briefId/edit" element={<BriefEditorPage />} />
          <Route path="research/briefs/:briefId/read" element={<BriefReadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
