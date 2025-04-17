"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <>
          {action.href ? (
            <Link href={action.href}>
              <Button className="mt-4 md:mt-0 bg-[#10a37f] hover:bg-[#0e8f6e] text-white">{action.label}</Button>
            </Link>
          ) : (
            <Button className="mt-4 md:mt-0 bg-[#10a37f] hover:bg-[#0e8f6e] text-white" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
