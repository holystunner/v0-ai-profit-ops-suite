"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useMemo, useRef, useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TaskBoardGrid } from "@/components/task-board-grid"
import { Send, Sparkles, Loader2, Crown } from "lucide-react"

interface ParsedBoard {
  project: string
  summary?: string
  tasks: Array<{
    title: string
    agent: string
    priority?: "low" | "medium" | "high" | "critical"
    browser?: boolean
  }>
}

const TASKBOARD_RE = /```taskboard\s*([\s\S]*?)```/i

function extractBoard(text: string): ParsedBoard | null {
  const match = text.match(TASKBOARD_RE)
  if (!match) return null
  try {
    const parsed = JSON.parse(match[1].trim())
    if (parsed && Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
      return parsed as ParsedBoard
    }
  } catch {
    return null
  }
  return null
}

function stripBoard(text: string): string {
  return text.replace(TASKBOARD_RE, "").trim()
}

const SUGGESTIONS = [
  "Launch a new empire for a premium AI resume SaaS. Extract the plan and spin up the crew.",
  "Relay a 72-hour profit sprint for a Notion template shop — assign every task.",
  "Kick off a landing page + Stripe checkout for a $99 coaching offer.",
]

export function CeoChat() {
  const { ceoAgent, standingContext, addTaskBoxes, taskBoxes } = useStore()
  const [input, setInput] = useState("")
  const processedRef = useRef<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { context: standingContext },
      }),
    [standingContext],
  )

  const { messages, sendMessage, status, error } = useChat({ transport })

  // Detect taskboard blocks in completed assistant messages and materialize task boxes.
  useEffect(() => {
    if (status !== "ready") return
    for (const message of messages) {
      if (message.role !== "assistant") continue
      if (processedRef.current.has(message.id)) continue
      const text = message.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as { text: string }).text)
        .join("")
      const board = extractBoard(text)
      if (board) {
        addTaskBoxes(
          board.project,
          board.tasks.map((t) => ({
            title: t.title,
            agentName: t.agent,
            priority: t.priority ?? "medium",
            browser: Boolean(t.browser),
          })),
        )
        processedRef.current.add(message.id)
      }
    }
  }, [messages, status, addTaskBoxes])

  // Auto-scroll to newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const isBusy = status === "submitted" || status === "streaming"

  function submit() {
    const value = input.trim()
    if (!value || isBusy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Chat column */}
      <div className="flex min-h-0 flex-1 flex-col border-r border-border">
        <ScrollArea className="flex-1" viewportRef={scrollRef}>
          <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-6 pt-10 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Crown className="size-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-balance text-2xl font-semibold tracking-tight">
                    Command Kassandra, your CEO agent
                  </h2>
                  <p className="text-pretty text-sm text-muted-foreground">
                    Running on {ceoAgent.model}. Describe a project or empire in plain language — she plans it,
                    assigns your crew, and spawns live task boxes you can track.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-card-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = message.parts
                .filter((p) => p.type === "text")
                .map((p) => (p as { text: string }).text)
                .join("")
              const display = message.role === "assistant" ? stripBoard(text) : text
              const hasBoard = message.role === "assistant" && Boolean(extractBoard(text))
              return (
                <div
                  key={message.id}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm bg-card px-4 py-3 text-sm text-card-foreground ring-1 ring-border"
                    }
                  >
                    {message.role === "assistant" && (
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Sparkles className="size-3" />
                        Kassandra
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{display || "…"}</p>
                    {hasBoard && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        <Sparkles className="size-3" /> Task board spawned →
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {isBusy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-card px-4 py-3 text-sm text-muted-foreground ring-1 ring-border">
                  <Loader2 className="size-4 animate-spin" />
                  Kassandra is thinking…
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {"Kassandra hit an error reaching the model. Check the AI Gateway connection and try again."}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-background p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  submit()
                }
              }}
              placeholder="Relay a project, empire, or command to Kassandra…"
              className="max-h-40 min-h-[52px] resize-none"
              rows={1}
            />
            <Button onClick={submit} disabled={isBusy || !input.trim()} size="icon" className="size-[52px] shrink-0">
              {isBusy ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Task board column */}
      <div className="flex min-h-0 w-full flex-col lg:w-[42%]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold">Live Task Boards</h3>
            <p className="text-xs text-muted-foreground">
              {taskBoxes.length} task{taskBoxes.length === 1 ? "" : "s"} across your projects
            </p>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <TaskBoardGrid />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
