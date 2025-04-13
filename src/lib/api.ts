
// OpenWeather API integration
const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // Replace with your API key
const MOCK_MODE = true; // Set to false when you have your API key

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  description: string;
  icon: string;
}

export const fetchWeatherData = async (
  city = "London"
): Promise<WeatherData> => {
  if (MOCK_MODE) {
    return getMockWeatherData();
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      precipitation: data.rain ? data.rain["1h"] || 0 : 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return getMockWeatherData();
  }
};

// Mock data for demonstration
const getMockWeatherData = (): WeatherData => {
  return {
    location: "Demo City",
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    precipitation: 30,
    description: "Partly cloudy",
    icon: "03d",
  };
};

// Sensor data types
export interface SensorData {
  waterLevel: number; // 0-100 percentage
  floatSensor: boolean; // true = water detected
  temperature: number; // in celsius
  humidity: number; // 0-100 percentage
}

// Mock sensor data - now with consistent values instead of random ones
let mockSensorData: SensorData = {
  waterLevel: 45,
  floatSensor: false,
  temperature: 24,
  humidity: 60,
};

// For simulation purposes - gradual changes to create realistic data patterns
let trend = {
  waterLevel: 1, // increasing
  temperature: 0.5, // increasing
  humidity: -0.5, // decreasing
};

// Get sensor data (mock for now, would be replaced with actual API calls or WebSocket)
export const getSensorData = (): SensorData => {
  // For demonstration, make small changes to simulate real sensor fluctuations
  if (MOCK_MODE) {
    // Update water level with trend, and reverse trend if limits are reached
    mockSensorData.waterLevel += trend.waterLevel;
    if (mockSensorData.waterLevel >= 98) {
      trend.waterLevel = -1;
    } else if (mockSensorData.waterLevel <= 10) {
      trend.waterLevel = 1;
    }
    
    // Update temperature with trend
    mockSensorData.temperature += trend.temperature;
    if (mockSensorData.temperature >= 32) {
      trend.temperature = -0.5;
    } else if (mockSensorData.temperature <= 18) {
      trend.temperature = 0.5;
    }
    
    // Update humidity with trend
    mockSensorData.humidity += trend.humidity;
    if (mockSensorData.humidity >= 85) {
      trend.humidity = -0.5;
    } else if (mockSensorData.humidity <= 40) {
      trend.humidity = 0.5;
    }
    
    // Float sensor becomes active when water level is above 75%
    mockSensorData.floatSensor = mockSensorData.waterLevel > 75;
    
    // Round values for cleaner display
    return {
      waterLevel: Math.round(mockSensorData.waterLevel),
      floatSensor: mockSensorData.floatSensor,
      temperature: Math.round(mockSensorData.temperature * 10) / 10,
      humidity: Math.round(mockSensorData.humidity),
    };
  }
  
  // This would be replaced with actual API call in production
  return mockSensorData;
};

// Calculate prediction probability based on all data
export const calculatePredictionProbability = (
  sensorData: SensorData,
  weatherData: WeatherData
): number => {
  // Calculate based on multiple factors with different weights
  let probability = 0;
  
  // Water level contributes 40% to the prediction
  // Higher water level = higher flood probability
  probability += (sensorData.waterLevel / 100) * 40;
  
  // Float sensor contributes 15% to the prediction
  // If float sensor detects water, it adds to the probability
  if (sensorData.floatSensor) {
    probability += 15;
  }
  
  // Weather precipitation chance contributes 30% to the prediction
  probability += (weatherData.precipitation / 100) * 30;
  
  // High humidity and temp contribute 15% to the prediction
  const tempHumidityFactor = ((sensorData.humidity / 100) * 0.7) + 
                             ((Math.min(sensorData.temperature, 40) / 40) * 0.3);
  probability += tempHumidityFactor * 15;
  
  // Ensure probability is between 0 and 100
  return Math.min(100, Math.max(0, Math.round(probability)));
};
