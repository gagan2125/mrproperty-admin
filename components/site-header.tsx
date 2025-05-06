"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconNotification } from "@tabler/icons-react"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/fields": "Fields",
  "/buyers": "Buyers",
  "/sellers": "Sellers",
  "/buyers/add-buyer": "Add Buyer",
  "/buyers/edit-buyer": "Edit Buyer",
  "/sellers/add-seller": "Add Seller",
  "/sellers/edit-seller": "Edit Seller",
  "/users": "Users",
  "/settings": "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()
  const currentTitle = pageTitles[pathname] || "Dashboard"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              <IconNotification/>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
