"use client"

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { usePathname } from 'next/navigation'
import { MainNav } from '@/components/dashboard/main-nav'
import { Sidebar } from '@/components/dashboard/sidebar'
import { UserNav } from '@/components/dashboard/user-nav'
import { cn } from '@/lib/utils'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <MainNav 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar 
          className={cn(
            "fixed inset-y-0 left-0 z-20 w-64 shrink-0 border-r bg-background transition-transform md:static md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          pathname={pathname}
        />
        <main className="flex-1 pt-1 md:pt-6">
          <div className="container mx-auto md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
