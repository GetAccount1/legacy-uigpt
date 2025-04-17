import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function BrowserMockup() {
  return (
    <div className="border border-gray-200 rounded-md w-full overflow-hidden shadow-sm bg-white">
      {/* Browser Top Bar */}
      <div className="bg-gray-100 p-2 flex items-center border-b border-gray-200">
        <div className="flex items-center gap-1.5 mr-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1">
          <Input
            value="https://app.operator.dev/previews/"
            readOnly
            className="h-7 text-sm bg-white border-gray-300 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Website Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Preview</h1>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Session ID: 8f29a1b3</div>
        </div>

        <div className="border border-gray-200 rounded-md p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Browser Session</h2>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Active</span>
            <span className="mx-2">•</span>
            <span>Resolution: 1280x800</span>
            <span className="mx-2">•</span>
            <span>User Agent: Chrome 112</span>
          </div>
        </div>

        <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-500 mb-4 rounded">
          [Preview Content]
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" className="text-sm">
            Refresh
          </Button>
          <Button className="bg-[#10a37f] hover:bg-[#0e8f6e] text-white text-sm">Take Control</Button>
        </div>
      </div>
    </div>
  )
}
