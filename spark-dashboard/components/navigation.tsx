"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, FlaskConical, Stethoscope, Droplets, BarChart3, Settings, Menu, X } from "lucide-react"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { icon: Home, label: "Home" },
    { icon: FlaskConical, label: "Soil Analysis" },
    { icon: Stethoscope, label: "Plant Diagnosis" },
    { icon: Droplets, label: "Irrigation Control" },
    { icon: BarChart3, label: "Reports" },
    { icon: Settings, label: "Settings" },
  ]

  const handleNavClick = (label: string) => {
    setActiveSection(label)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 py-4">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={activeSection === item.label ? "default" : "ghost"}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeSection === item.label
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              onClick={() => handleNavClick(item.label)}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center space-x-2"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Menu</span>
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="mt-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={activeSection === item.label ? "default" : "ghost"}
                  className={`w-full justify-start space-x-2 ${
                    activeSection === item.label
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleNavClick(item.label)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
