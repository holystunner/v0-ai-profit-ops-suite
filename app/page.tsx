"use client"

import { useStore, StoreProvider } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CeoChat } from "@/components/ceo-chat"
import { DashboardView } from "@/components/dashboard-view"
import { EmpiresView } from "@/components/empires-view"
import { ProjectsView } from "@/components/projects-view"
import { AgentsView } from "@/components/agents-view"
import { BrowserView } from "@/components/browser-view"
import { SettingsView } from "@/components/settings-view"
import { NewEmpireModal } from "@/components/new-empire-modal"
import { NewProjectModal } from "@/components/new-project-modal"
import { AgentDetailModal } from "@/components/agent-detail-modal"
import { cn } from "@/lib/utils"

function CommandCentre() {
  const { sidebarOpen, activeView } = useStore()

  const isChat = activeView === "chat"

  const renderView = () => {
    switch (activeView) {
      case "chat": return <CeoChat />
      case "dashboard": return <DashboardView />
      case "empires": return <EmpiresView />
      case "projects": return <ProjectsView />
      case "agents": return <AgentsView />
      case "browser": return <BrowserView />
      case "settings": return <SettingsView />
      default: return <CeoChat />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className={cn(
        "pt-16 transition-all duration-300",
        sidebarOpen ? "pl-64" : "pl-20"
      )}>
        {isChat ? (
          <div className="h-[calc(100vh-4rem)]">
            {renderView()}
          </div>
        ) : (
          <div className="min-h-[calc(100vh-4rem)] p-6">
            {renderView()}
          </div>
        )}
      </main>

      {/* Modals */}
      <NewEmpireModal />
      <NewProjectModal />
      <AgentDetailModal />
    </div>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <CommandCentre />
    </StoreProvider>
  )
}
