"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, Droplets, Wind, Thermometer, MapPin, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  feelsLike: number
  rainChance: number
  icon: string
}

export function WeatherCard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<string>("prompt")

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      setError(null)

      // Call our secure API route instead of external API directly
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)

      if (!response.ok) {
        throw new Error("Weather data unavailable")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setWeatherData(data)
    } catch (err) {
      setError("Failed to fetch weather data")
      console.error("[v0] Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeatherData(latitude, longitude)
        setLocationPermission("granted")
      },
      (error) => {
        setError("Location access denied")
        setLocationPermission("denied")
        setLoading(false)
        console.error("[v0] Geolocation error:", error)
      },
    )
  }

  useEffect(() => {
    // Try to get location on component mount
    getCurrentLocation()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "clouds":
        return <Cloud className="w-8 h-8 text-gray-500" />
      case "rain":
      case "drizzle":
        return <Droplets className="w-8 h-8 text-blue-500" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Sun className="w-4 h-4 text-secondary" />
            </div>
            <span>Weather Conditions</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={loading}
            className="text-xs bg-transparent"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
            {loading ? "Loading..." : "Update Location"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={getCurrentLocation}>
              Try Again
            </Button>
          </div>
        ) : weatherData ? (
          <>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                {getWeatherIcon(weatherData.icon)}
                <span className="text-3xl font-bold text-foreground">{weatherData.temperature}°C</span>
              </div>
              <Badge variant="secondary" className="text-xs capitalize">
                {weatherData.condition}
              </Badge>
              <p className="text-xs text-muted-foreground flex items-center justify-center">
                <MapPin className="w-3 h-3 mr-1" />
                {weatherData.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">{weatherData.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">{weatherData.windSpeed} km/h</p>
                  <p className="text-xs text-muted-foreground">Wind</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">{weatherData.feelsLike}°C</p>
                  <p className="text-xs text-muted-foreground">Feels like</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">{weatherData.rainChance}%</p>
                  <p className="text-xs text-muted-foreground">Cloud cover</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                {weatherData.temperature > 25
                  ? "Hot conditions - increase irrigation frequency."
                  : weatherData.humidity > 70
                    ? "High humidity - monitor for fungal diseases."
                    : "Good conditions for farming activities."}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Getting your location...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
