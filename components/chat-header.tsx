import { Terminal } from "lucide-react"

export function ChatHeader() {
  return (
    <div className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/50">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center">
          <Terminal className="h-4 w-4 text-black" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-white font-figtree">Operator.dev</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-xs text-zinc-400">Connected</span>
      </div>
    </div>
  )
}
