'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
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

export default function Page() {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p>Select an option from the sidebar to get started.</p>
          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background p-4 rounded-md shadow">
                <h3 className="font-medium">Total Orders</h3>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div className="bg-background p-4 rounded-md shadow">
                <h3 className="font-medium">Revenue</h3>
                <p className="text-2xl font-bold">$45,678</p>
              </div>
              <div className="bg-background p-4 rounded-md shadow">
                <h3 className="font-medium">New Customers</h3>
                <p className="text-2xl font-bold">56</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
//signup/signin
//Landing Page
//Blogs 
//Home page - Dashboard showing all the restaurants data,
//Restaurants - page listing the restaurants with a link to admin panel
//Settings
//Subscriptions
