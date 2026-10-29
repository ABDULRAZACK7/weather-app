import { useState } from 'react'

import './App.css'

function App() {
  const [city,setCity]=useState('')
  const[searchCity,setSearchCity]=useState('')
  const[searchCountry,setSearchCountry]=useState('')
  const[temperature,setTemperature]=useState(null)
  const[feelsLike,setFeelsLike]=useState(null)
  const[weatherCode,setWeatherCode]=useState(null)
  const[windSpeed,setWindSpeed]=useState(null)
  const[loading,setLoading]=useState(false) 
  const [error,setError]=useState(null)
  const[lastupdated,setLastUpdated]=useState(null)

  function handleClear(){
    setCity('')
    setSearchCity('')
    setSearchCountry('')
    setTemperature(null)
    setFeelsLike(null)
    setWeatherCode(null)
    setWindSpeed(null)
    setLoading(false)
    setError(null)
    setLastUpdated(null)
  }


  function getWeatherIcon(code) {
  if (code === 0) return '☀️'
  if (code === 1 || code === 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if ([51, 53, 55, 61, 63, 65].includes(code)) return '🌧️'
  if ([71, 73, 75].includes(code)) return '❄️'
  if (code === 95) return '⛈️'

  return '🌡️'
}


  function getWeatherCondition(code) {
  if (code === 0) return 'Clear sky'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Fog'
  if ([51, 53, 55].includes(code)) return 'Drizzle'
  if ([61, 63, 65].includes(code)) return 'Rain'
  if ([71, 73, 75].includes(code)) return 'Snow'
  if (code === 95) return 'Thunderstorm'

  return 'Other conditions'
}

  async function handleSearch(){
    
    if(city.trim()===''){
      alert('Please enter a city name')
      return
    }
    setError(null)
    
    setSearchCity('')
setSearchCountry('')
setTemperature(null)
setWeatherCode(null)
setFeelsLike(null)
setWindSpeed(null)
setLoading(true)
setLastUpdated(null)
    try{
      const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)

      const data=await response.json()
      if(!response.ok){
        throw new Error('Failed to fetch city data')
      }
      console.log(data)
      if(!data.results){
        setError('City not found')
        
        return
      }
      setSearchCity(data.results[0].name)
      setSearchCountry(data.results[0].country)
      const latitude=data.results[0].latitude
      const longitude=data.results[0].longitude
  
      const weatherResponse = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
) 
      const weatherData=await weatherResponse.json()
       if(!weatherResponse.ok){
        throw new Error('Failed to fetch weather data')
      }
      if(!weatherData.current){
        throw new Error('Weather data not available for this location')
      }
     
     setTemperature(weatherData.current.temperature_2m)
setFeelsLike(weatherData.current.apparent_temperature)
setWeatherCode(weatherData.current.weather_code)
setWindSpeed(weatherData.current.wind_speed_10m)
setLastUpdated(new Date().toLocaleTimeString())
    }catch(error){
      console.error('Error fetching weather data:', error)
      setError('Error fetching weather data. Please try again later.')
    }
    finally{
    setLoading(false)
  }
}

  return (
    <>
     
          <h1>Weather App</h1>
          <p>
             Check the weather in your city
          </p>

          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {e.key === 'Enter' && handleSearch()}}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search Weather'}
          </button>

          <button className="clear-button" onClick={handleClear} disabled={loading || !searchCity}>
            Clear
          </button>
          {loading && <p>Getting the latest weather information...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {searchCity && 
            <div className="weather-card">
              <h2>{searchCity},{searchCountry}</h2>
              {weatherCode!==null && <h2>{getWeatherIcon(weatherCode)}</h2>}
              {weatherCode!==null && <p> {getWeatherCondition(weatherCode)}</p>}
              {temperature!==null && <p>Temperature:{temperature} °C</p>}
              {feelsLike!==null && <p>Feels like: {feelsLike} °C</p>}
              {windSpeed!==null && <p>Wind Speed: {windSpeed} km/h</p>}
              {lastupdated && <p>Last Updated: {lastupdated}</p>}
          </div>}
          </>
  )
}


export default App
