"use client"

import * as React from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ActionMenuItem {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive"
}

interface ActionMenuProps {
  items: ActionMenuItem[]
}

export function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = React.useState(false)

  const handleItemClick = (onClick: () => void) => {
    onClick()
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            console.log("[v0] Action menu clicked")
          }}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.variant === "destructive" && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                console.log("[v0] Menu item clicked:", item.label)
                handleItemClick(item.onClick)
              }}
              className={item.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
