"use client"

import { useStore } from "@/lib/store"
import { 
  LayoutDashboard, 
  Building2, 
  FolderKanban, 
  Bot, 
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Activity,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "chat", label: "Kassandra Chat", icon: MessageSquare },
  { id: "dashboard", label: "Command Centre", icon: LayoutDashboard },
  { id: "empires", label: "Empires", icon: Building2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "agents", label: "AI Workforce", icon: Bot },
  { id: "browser", label: "Browser Sessions", icon: Globe },
  { id: "settings", label: "Settings", icon: Settings },
] as const

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activeView, setActiveView, ceoAgent, browserSessions } = useStore()
  
  const activeSessions = browserSessions.filter(s => s.status === "active").length

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-card/80 backdrop-blur-xl transition-all duration-300",
      sidebarOpen ? "w-64" : "w-20"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">AI Profit Ops</h1>
                <p className="text-xs text-muted-foreground">Ultimate Edition</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* CEO Agent Status */}
        <div className={cn(
          "mx-3 mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3",
          !sidebarOpen && "mx-2 p-2"
        )}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold">
                  K
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{ceoAgent.name}</p>
                <p className="text-xs text-muted-foreground">CEO Clone Agent</p>
              </div>
              <Activity className="h-4 w-4 text-success animate-pulse" />
            </div>
          ) : (
            <div className="relative mx-auto w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold">
                K
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            const showBadge = item.id === "browser" && activeSessions > 0
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/25" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {showBadge && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                      {activeSessions}
                    </span>
                  )}
                </div>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-border/50 p-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
