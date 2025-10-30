"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { DashboardGrid } from "@/components/dashboard-grid"
import { Footer } from "@/components/footer"
import { SoilHealthCard } from "@/components/cards/soil-health-card"
import { PlantDiagnosisCard } from "@/components/cards/plant-diagnosis-card"
import { IrrigationControlCard } from "@/components/cards/irrigation-control-card"
import { ReportsCard } from "@/components/cards/reports-card"
import { SettingsCard } from "@/components/cards/settings-card"

export default function SparkDashboard() {
  const [activeSection, setActiveSection] = useState("Home")

  const renderContent = () => {
    switch (activeSection) {
      case "Home":
        return <DashboardGrid />
      case "Soil Analysis":
        return (
          <div className="grid gap-6">
            <SoilHealthCard />
          </div>
        )
      case "Plant Diagnosis":
        return (
          <div className="grid gap-6">
            <PlantDiagnosisCard />
          </div>
        )
      case "Irrigation Control":
        return (
          <div className="grid gap-6">
            <IrrigationControlCard />
          </div>
        )
      case "Reports":
        return (
          <div className="grid gap-6">
            <ReportsCard />
          </div>
        )
      case "Settings":
        return (
          <div className="grid gap-6">
            <SettingsCard />
          </div>
        )
      default:
        return <DashboardGrid />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
      <Footer />
    </div>
  )
}
