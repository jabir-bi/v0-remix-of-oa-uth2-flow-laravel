"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Key,
  Shield,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  LogOut,
  User,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Access Control",
    href: "/dashboard/access",
    icon: Shield,
    children: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Roles",
        href: "/dashboard/roles",
        icon: UserCog,
      },
      {
        title: "Permissions",
        href: "/dashboard/permissions",
        icon: Key,
      },
    ],
  },
]

interface AppSidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function AppSidebar({ collapsed, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">OAuth2 App</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => onCollapsedChange(!collapsed)} className="h-8 w-8 shrink-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {expandedItems.includes(item.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && expandedItems.includes(item.title) && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive(child.href) && "bg-sidebar-accent text-sidebar-accent-foreground",
                        )}
                      >
                        <child.icon className="h-4 w-4 shrink-0" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className={cn("w-full justify-start gap-3 px-3 py-2", collapsed && "justify-center px-2")}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
              </div>
            )}
          </Button>

          {userDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
              <div className="absolute bottom-full left-2 right-2 z-50 mb-2 rounded-lg border border-border bg-popover p-1 shadow-lg">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <Link
                  href="/dashboard/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  Profile
                </Link>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={() => {
                    setUserDropdownOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
