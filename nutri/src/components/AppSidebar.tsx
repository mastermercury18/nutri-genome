
import { useState } from "react";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BarChart3, 
  User, 
  FileText,
  Heart,
  Dna
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Meal Plans", url: "/app/meal-plan", icon: UtensilsCrossed },
  { title: "Profile", url: "/app/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/app") {
      return currentPath === "/app";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-blue-100 text-blue-700 font-medium border-r-2 border-blue-500" 
      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600";

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} bg-white border-r border-blue-100`}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo section */}
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-slate-800">NutriGenome</h2>
                <p className="text-xs text-slate-500">AI Health Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-slate-400 font-medium">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/app"}
                      className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Health tip section */}
        {!isCollapsed && (
          <div className="p-4 mx-4 mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Health Tip</span>
            </div>
            <p className="text-xs text-green-700">
              Stay hydrated and maintain regular meal times for optimal liver health.
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
