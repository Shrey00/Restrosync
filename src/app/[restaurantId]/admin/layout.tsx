'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { LayoutDashboard, Menu, ShoppingBag, Truck, Star, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const SidebarButton = ({ icon, text, isExpanded }: { icon: React.ReactNode, text: string, isExpanded: boolean }) => (
  <Button variant="ghost" className="w-full justify-start px-2">
    <span className={cn("transition-all duration-300", 
      isExpanded ? "mr-2" : "mr-0")}>
      {icon}
    </span>
    <span className={cn("transition-all duration-300", 
      isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0")}>
      {text}
    </span>
  </Button>
)

export default function adminPanelRootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
     const [isExpanded, setIsExpanded] = useState(false)

    return (
      <div className="relative h-screen overflow-hidden">
        <aside 
          className={cn(
            "absolute top-0 left-0 h-full bg-secondary text-secondary-foreground",
            "transition-all duration-300 ease-in-out z-10",
            isExpanded ? "w-56" : "w-10"
          )}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <nav className="py-4">
            <SidebarButton icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" isExpanded={isExpanded} />
            <SidebarButton icon={<Menu className="h-5 w-5" />} text="Menu" isExpanded={isExpanded} />
            <SidebarButton icon={<ShoppingBag className="h-5 w-5" />} text="Orders" isExpanded={isExpanded} />
            <SidebarButton icon={<Truck className="h-5 w-5" />} text="Deliveries" isExpanded={isExpanded} />
            <SidebarButton icon={<Star className="h-5 w-5" />} text="Reviews" isExpanded={isExpanded} />
            <SidebarButton icon={<Users className="h-5 w-5" />} text="Customers" isExpanded={isExpanded} />
            <SidebarButton icon={<CreditCard className="h-5 w-5" />} text="Billing" isExpanded={isExpanded} />
          </nav>
        </aside>
        <main className={cn(
          "h-full p-8 text-foreground",
          "transition-all duration-300 ease-in-out",
          "ml-12"
        )}>
            {children}
            
        </main>
        <Toaster />
      </div>
    )
  }
  