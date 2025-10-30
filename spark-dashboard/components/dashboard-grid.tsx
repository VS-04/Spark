import { SoilHealthCard } from "@/components/cards/soil-health-card"
import { RecommendationsCard } from "@/components/cards/recommendations-card"
import { PlantDiagnosisCard } from "@/components/cards/plant-diagnosis-card"
import { IrrigationControlCard } from "@/components/cards/irrigation-control-card"
import { ReportsCard } from "@/components/cards/reports-card"
import { WeatherCard } from "@/components/cards/weather-card"
import { SensorReadingsCard } from "@/components/cards/sensor-readings-card"

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Row - Main Cards */}
      <div className="lg:col-span-2">
        <SoilHealthCard />
      </div>
      <div className="lg:col-span-1">
        <WeatherCard />
      </div>

      {/* Second Row */}
      <div className="lg:col-span-1">
        <RecommendationsCard />
      </div>
      <div className="lg:col-span-1">
        <PlantDiagnosisCard />
      </div>
      <div className="lg:col-span-1">
        <IrrigationControlCard />
      </div>

      <div className="lg:col-span-2">
        <SensorReadingsCard />
      </div>
      <div className="lg:col-span-1">
        {/* Placeholder for future card or move existing card here */}
        <div className="h-full min-h-[300px] border-2 border-dashed border-border rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Additional Module</p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="lg:col-span-3">
        <ReportsCard />
      </div>
    </div>
  )
}
