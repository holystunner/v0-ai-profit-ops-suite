"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { CREW_AGENTS, type CrewToolId } from "@/lib/crew-catalog"

export interface Agent {
  id: string
  name: string
  role: "ceo" | "empire-manager" | "project-manager" | "worker"
  status: "active" | "idle" | "working" | "offline"
  avatar: string
  capabilities: string[]
  tools?: CrewToolId[]
  crewKey?: string
  goal?: string
  backstory?: string
  model?: string
  assignedTo?: string
  currentTask?: string
  performance: number
  browserSessions: number
}

export interface BrowserSession {
  id: string
  agentId: string
  url: string
  status: "active" | "completed" | "error"
  action: string
  screenshot?: string
  startedAt: Date
  logs: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "paused" | "completed"
  empireId: string
  manager?: Agent
  workers: Agent[]
  files: ProjectFile[]
  apis: APIConfig[]
  credentials: Credential[]
  progress: number
  tasks: Task[]
  browserSessions: BrowserSession[]
  createdAt: Date
  launchedAt?: Date
}

export interface ProjectFile {
  id: string
  name: string
  type: "handoff" | "code" | "asset" | "config" | "documentation"
  size: number
  uploadedAt: Date
}

export interface APIConfig {
  id: string
  name: string
  endpoint: string
  status: "connected" | "error" | "pending"
}

export interface Credential {
  id: string
  name: string
  type: "api-key" | "oauth" | "login" | "token"
  service: string
  isValid: boolean
}

export interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed" | "failed"
  assignedTo?: string
  priority: "low" | "medium" | "high" | "critical"
  browserRequired: boolean
}

// A visual task box spawned from the CEO chat interface.
export interface TaskBox {
  id: string
  project: string
  title: string
  agentName: string
  priority: "low" | "medium" | "high" | "critical"
  browser: boolean
  status: "queued" | "in-progress" | "completed" | "failed"
  progress: number
  logs: string[]
  createdAt: Date
}

export interface Empire {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "scaling"
  manager?: Agent
  projects: Project[]
  files: {
    brand: ProjectFile[]
    governing: ProjectFile[]
    vision: ProjectFile[]
    goals: ProjectFile[]
    credentials: ProjectFile[]
    assets: ProjectFile[]
    code: ProjectFile[]
  }
  metrics: {
    revenue: number
    growth: number
    activeProjects: number
    totalAgents: number
    browserSessions: number
  }
  createdAt: Date
}

export type ActiveView =
  | "chat"
  | "dashboard"
  | "empires"
  | "projects"
  | "agents"
  | "browser"
  | "settings"

interface StoreContextType {
  // CEO Agent
  ceoAgent: Agent

  // Empires
  empires: Empire[]
  activeEmpire: Empire | null
  setActiveEmpire: (empire: Empire | null) => void
  createEmpire: (empire: Omit<Empire, "id" | "createdAt" | "projects" | "metrics">) => Empire
  updateEmpire: (id: string, updates: Partial<Empire>) => void

  // Projects
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void
  createProject: (empireId: string, project: Omit<Project, "id" | "createdAt" | "workers" | "browserSessions">) => Project
  launchProject: (projectId: string) => void

  // Agents
  availableAgents: Agent[]
  assignAgent: (agentId: string, projectId: string) => void

  // Browser Sessions
  browserSessions: BrowserSession[]
  createBrowserSession: (agentId: string, projectId: string, url: string, action: string) => BrowserSession

  // Task boxes (spawned from CEO chat)
  taskBoxes: TaskBox[]
  addTaskBoxes: (
    project: string,
    tasks: Array<Omit<TaskBox, "id" | "status" | "progress" | "logs" | "createdAt" | "project">>,
  ) => void
  updateTaskBox: (id: string, updates: Partial<TaskBox>) => void
  clearTaskBoxes: () => void

  // Standing context: files/knowledge the crew must know
  standingContext: string
  setStandingContext: (ctx: string) => void

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void

  // Modals
  showNewEmpireModal: boolean
  setShowNewEmpireModal: (show: boolean) => void
  showNewProjectModal: boolean
  setShowNewProjectModal: (show: boolean) => void
  showAgentDetailModal: boolean
  setShowAgentDetailModal: (show: boolean) => void
  selectedAgent: Agent | null
  setSelectedAgent: (agent: Agent | null) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

const initialCeoAgent: Agent = {
  id: "ceo-001",
  name: "Kassandra",
  role: "ceo",
  status: "active",
  avatar: "/agents/kassandra.png",
  capabilities: ["strategic-planning", "resource-allocation", "empire-oversight", "communication"],
  model: "google/gemma-4-31b-it",
  goal: "Plan, communicate, and directly assist John in running all empires, projects, agents, and bot swarms.",
  performance: 100,
  browserSessions: 0,
}

// Agent library seeded from the user's real CrewAI crew catalog.
const initialAgents: Agent[] = CREW_AGENTS.map((a) => ({
  id: a.key,
  name: a.name,
  role: a.tier,
  status: "idle" as const,
  avatar: "/agents/generic.png",
  capabilities: a.tools,
  tools: a.tools,
  crewKey: a.key,
  goal: a.goal,
  backstory: a.backstory,
  model: a.model,
  performance: 0,
  browserSessions: 0,
}))

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ceoAgent] = useState<Agent>(initialCeoAgent)
  // Clean production start — zero empires, zero sessions.
  const [empires, setEmpires] = useState<Empire[]>([])
  const [activeEmpire, setActiveEmpire] = useState<Empire | null>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [availableAgents, setAvailableAgents] = useState<Agent[]>(initialAgents)
  const [browserSessions, setBrowserSessions] = useState<BrowserSession[]>([])
  const [taskBoxes, setTaskBoxes] = useState<TaskBox[]>([])
  const [standingContext, setStandingContext] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState<ActiveView>("chat")
  const [showNewEmpireModal, setShowNewEmpireModal] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showAgentDetailModal, setShowAgentDetailModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const createEmpire = useCallback((empireData: Omit<Empire, "id" | "createdAt" | "projects" | "metrics">) => {
    const newEmpire: Empire = {
      ...empireData,
      id: `empire-${Date.now()}`,
      projects: [],
      metrics: { revenue: 0, growth: 0, activeProjects: 0, totalAgents: 0, browserSessions: 0 },
      createdAt: new Date(),
    }
    setEmpires((prev) => [...prev, newEmpire])
    return newEmpire
  }, [])

  const updateEmpire = useCallback((id: string, updates: Partial<Empire>) => {
    setEmpires((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }, [])

  const createProject = useCallback(
    (empireId: string, projectData: Omit<Project, "id" | "createdAt" | "workers" | "browserSessions">) => {
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        workers: [],
        browserSessions: [],
        createdAt: new Date(),
      }
      setEmpires((prev) =>
        prev.map((e) =>
          e.id === empireId
            ? {
                ...e,
                projects: [...e.projects, newProject],
                metrics: { ...e.metrics, activeProjects: e.metrics.activeProjects + 1 },
              }
            : e,
        ),
      )
      return newProject
    },
    [],
  )

  const launchProject = useCallback((projectId: string) => {
    setEmpires((prev) =>
      prev.map((e) => ({
        ...e,
        projects: e.projects.map((p) =>
          p.id === projectId ? { ...p, status: "active" as const, launchedAt: new Date() } : p,
        ),
      })),
    )
  }, [])

  const assignAgent = useCallback((agentId: string, projectId: string) => {
    setAvailableAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, assignedTo: projectId, status: "working" as const } : a)),
    )
  }, [])

  const createBrowserSession = useCallback((agentId: string, projectId: string, url: string, action: string) => {
    const newSession: BrowserSession = {
      id: `bs-${Date.now()}`,
      agentId,
      url,
      status: "active",
      action,
      startedAt: new Date(),
      logs: [`Initiated browser session for ${action}`],
    }
    setBrowserSessions((prev) => [...prev, newSession])
    return newSession
  }, [])

  const addTaskBoxes = useCallback<StoreContextType["addTaskBoxes"]>((project, tasks) => {
    const now = Date.now()
    const boxes: TaskBox[] = tasks.map((t, i) => ({
      ...t,
      id: `task-${now}-${i}`,
      project,
      status: "queued",
      progress: 0,
      logs: [`Task queued by Kassandra — assigned to ${t.agentName}`],
      createdAt: new Date(),
    }))
    setTaskBoxes((prev) => [...boxes, ...prev])
  }, [])

  const updateTaskBox = useCallback((id: string, updates: Partial<TaskBox>) => {
    setTaskBoxes((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }, [])

  const clearTaskBoxes = useCallback(() => setTaskBoxes([]), [])

  return (
    <StoreContext.Provider
      value={{
        ceoAgent,
        empires,
        activeEmpire,
        setActiveEmpire,
        createEmpire,
        updateEmpire,
        activeProject,
        setActiveProject,
        createProject,
        launchProject,
        availableAgents,
        assignAgent,
        browserSessions,
        createBrowserSession,
        taskBoxes,
        addTaskBoxes,
        updateTaskBox,
        clearTaskBoxes,
        standingContext,
        setStandingContext,
        sidebarOpen,
        setSidebarOpen,
        activeView,
        setActiveView,
        showNewEmpireModal,
        setShowNewEmpireModal,
        showNewProjectModal,
        setShowNewProjectModal,
        showAgentDetailModal,
        setShowAgentDetailModal,
        selectedAgent,
        setSelectedAgent,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}
