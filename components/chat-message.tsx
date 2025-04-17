import { CheckCircle, AlertCircle, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageProps = {
  message: {
    content: string
    role: "user" | "assistant" | "system"
    status?: "executing" | "complete" | "denied"
  }
}

export function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) {
    return (
      <div className="flex items-center space-x-2 py-1 px-3 rounded-md bg-zinc-900/50 max-w-[80%] mx-auto">
        {message.status === "executing" && <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>}
        {message.status === "complete" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
        {message.status === "denied" && <AlertCircle className="h-4 w-4 text-red-500" />}
        <span className="text-xs text-zinc-400">{message.content}</span>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col space-y-2 animate-fade-in", isUser ? "items-end" : "items-start")}>
      <div className="flex items-center space-x-2">
        {!isUser && (
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center">
            <Terminal className="h-3 w-3 text-black" />
          </div>
        )}
        <span className="text-xs text-zinc-500 font-medium">{isUser ? "You" : "Operator"}</span>
      </div>

      <div
        className={cn(
          "px-4 py-3 rounded-lg max-w-[80%]",
          isUser
            ? "bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-700/30 text-emerald-50"
            : "bg-zinc-900 border border-zinc-800 text-zinc-100",
        )}
      >
        <p className={cn("text-sm", isUser && "font-medium")}>{message.content}</p>
      </div>

      {isUser && <div className="px-2 py-1 text-xs text-emerald-500/70 font-mono">~ incantation received</div>}
    </div>
  )
}
