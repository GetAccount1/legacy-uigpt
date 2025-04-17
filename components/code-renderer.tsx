"use client"
import { useEffect, useRef } from "react"

interface CodeRendererProps {
  html: string
  css: string
  js: string
}

export function CodeRenderer({ html, css, js }: CodeRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    // Create the HTML content with embedded CSS and JS
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `

    // Write to the iframe
    iframeDoc.open()
    iframeDoc.write(content)
    iframeDoc.close()
  }, [html, css, js])

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <iframe ref={iframeRef} className="w-full h-[400px] border-0" title="Code Preview" sandbox="allow-scripts" />
    </div>
  )
}
