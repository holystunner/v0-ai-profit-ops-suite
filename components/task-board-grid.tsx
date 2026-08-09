"use client"

import { useEffect, useRef } from "react"
import { useStore, type TaskBox } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Globe, Play, CheckCircle2, Clock, Loader2, ListTodo } from "lucide-react"

const priorityStyles: Record<TaskBox["priority"], string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted text-muted-foreground border-border",
}

const statusStyles: Record<TaskBox["status"], string> = {
  queued: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary",
  completed: "bg-chart-2/15 text-chart-2",
  failed: "bg-destructive/10 text-destructive",
}

const AGENT_STEPS = [
  "Reading standing context and assigned files",
  "Planning approach and sub-steps",
  "Executing — running tools",
  "Verifying output against expected result",
  "Reporting results back to Kassandra",
]

function TaskCard({ task }: { task: TaskBox }) {
  const { updateTaskBox } = useStore()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Autonomous progress loop: once dispatched, the task advances and reports back.
  useEffect(() => {
    if (task.status !== "in-progress") return
    timerRef.current = setInterval(() => {
      const next = Math.min(task.progress + Math.random() * 12 + 4, 100)
      const stepIndex = Math.min(Math.floor((next / 100) * AGENT_STEPS.length), AGENT_STEPS.length - 1)
      const stepLog = `${task.agentName}: ${AGENT_STEPS[stepIndex]}`
      const logs = task.logs.includes(stepLog) ? task.logs : [...task.logs, stepLog]
      if (next >= 100) {
        updateTaskBox(task.id, {
          progress: 100,
          status: "completed",
          logs: [...logs, `${task.agentName}: Task complete. Deliverable ready for review.`],
        })
      } else {
        updateTaskBox(task.id, { progress: next, logs })
      }
    }, 1400)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [task.status, task.progress, task.id, task.agentName, task.logs, updateTaskBox])

  function dispatch() {
    updateTaskBox(task.id, {
      status: "in-progress",
      logs: [...task.logs, `Dispatched to ${task.agentName} — beginning autonomous execution`],
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{task.project}</p>
          <h4 className="text-pretty text-sm font-semibold leading-snug text-card-foreground">{task.title}</h4>
        </div>
        <Badge variant="outline" className={`shrink-0 text-[10px] ${priorityStyles[task.priority]}`}>
          {task.priority}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 font-medium text-secondary-foreground">
          {task.agentName}
        </span>
        {task.browser && (
          <span className="inline-flex items-center gap-1 rounded-md bg-chart-1/10 px-2 py-1 font-medium text-chart-1">
            <Globe className="size-3" /> Browser
          </span>
        )}
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium ${statusStyles[task.status]}`}>
          {task.status === "queued" && <Clock className="size-3" />}
          {task.status === "in-progress" && <Loader2 className="size-3 animate-spin" />}
          {task.status === "completed" && <CheckCircle2 className="size-3" />}
          {task.status}
        </span>
      </div>

      {task.status !== "queued" && (
        <div className="mt-3 space-y-1.5">
          <Progress value={task.progress} className="h-1.5" />
          <p className="text-right text-[10px] tabular-nums text-muted-foreground">{Math.round(task.progress)}%</p>
        </div>
      )}

      {task.logs.length > 0 && (
        <div className="mt-3 max-h-24 overflow-y-auto rounded-lg bg-muted/50 p-2">
          {task.logs.slice(-4).map((log, i) => (
            <p key={i} className="text-[11px] leading-relaxed text-muted-foreground">
              {"› "}
              {log}
            </p>
          ))}
        </div>
      )}

      {task.status === "queued" && (
        <Button onClick={dispatch} size="sm" variant="secondary" className="mt-3 w-full">
          <Play className="size-3.5" /> Dispatch to agent
        </Button>
      )}
    </div>
  )
}

export function TaskBoardGrid() {
  const { taskBoxes } = useStore()

  if (taskBoxes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <ListTodo className="size-6" />
        </div>
        <p className="text-sm font-medium text-foreground">No task boards yet</p>
        <p className="max-w-xs text-pretty text-xs text-muted-foreground">
          Describe a project to Kassandra in the chat. She&apos;ll break it into tasks, assign your crew, and they
          appear here as live boards.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {taskBoxes.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
