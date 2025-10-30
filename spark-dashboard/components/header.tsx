import { Leaf, Zap } from "lucide-react"

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center animate-pulse-green">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <Zap className="w-4 h-4 text-secondary absolute -top-1 -right-1 animate-float" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">SPARK</h1>
              <p className="text-sm text-muted-foreground font-medium">
                {"Igniting Smart Farming, One Drop at a Time."}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium text-foreground">{new Date().toLocaleTimeString()}</p>
            </div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-green"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
