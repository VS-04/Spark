import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Use environment variable securely on server side
    const API_KEY = process.env.WEATHER_API_KEY

    if (!API_KEY) {
      // Return mock data if no API key is configured
      return NextResponse.json({
        location: "Demo Location",
        temperature: 24,
        condition: "partly cloudy",
        humidity: 65,
        windSpeed: 12,
        feelsLike: 26,
        rainChance: 30,
        icon: "Clear",
      })
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    )

    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const data = await response.json()

    const weatherData = {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      feelsLike: Math.round(data.main.feels_like),
      rainChance: data.clouds.all, // Using cloud coverage as rain chance approximation
      icon: data.weather[0].main,
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
