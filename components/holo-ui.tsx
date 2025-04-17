"use client"

import { useState } from "react"
import { Plus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrowserMockup } from "@/components/browser-mockup"

export function HoloUI() {
  const [bottomInput, setBottomInput] = useState("")

  return (
    <div className="flex flex-col h-full font-sans bg-white">
      {/* Top Bar */}
      <div className="p-3 border-b border-zinc-200 flex items-center gap-3">
        <span className="font-semibold bg-zinc-100 px-2 py-1 rounded text-sm">IR</span>
        <Input value="Enter google.com and visit hololivepro.com" readOnly className="flex-1 bg-white" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-2/5 p-5 bg-zinc-50 border-r border-zinc-200 overflow-y-auto">
          <p className="font-semibold text-zinc-900 mb-3">OK. I'm trying access the hololive website for you.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
            <li>Opening the browser to access their website.</li>
            <li>Access the hololivepro.com address.</li>
            <li>Now, I'm see the landing space of the hololive.</li>
            <li>Now i see the EN Page. Also the page have Japanese version.</li>
          </ul>
        </div>

        {/* Right Panel */}
        <div className="w-3/5 p-5 flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            <BrowserMockup />
          </div>

          <Button variant="outline" className="mt-4">
            Take over
          </Button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center border border-zinc-200 rounded-full px-3 py-2 bg-white mb-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full mr-2">
            <Plus className="h-4 w-4" />
          </Button>
          <Input
            value={bottomInput}
            onChange={(e) => setBottomInput(e.target.value)}
            placeholder="Type your command..."
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-zinc-500 text-center">
          Operator.dev actions can sometimes be not correctly. Please see operator.dev operations to avoid unwanted
          situations that may occur.
        </p>
      </div>
    </div>
  )
}
