
// Type definitions for API data
export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  description: string;
  icon: string;
}

export interface SensorData {
  waterLevel: number; // 0-100 percentage
  floatSensor: boolean; // true = water detected
  temperature: number; // in celsius
  humidity: number; // 0-100 percentage
}

// Backend API endpoint (change this to your actual backend URL)
const API_URL = 'http://localhost:3000/api/data';

// Fetch data from backend
export const fetchAllData = async (): Promise<{
  sensorData: SensorData;
  weatherData: WeatherData;
  predictionProbability: number;
}> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return default values if API call fails
    return {
      sensorData: {
        waterLevel: 0,
        floatSensor: false,
        temperature: 0,
        humidity: 0
      },
      weatherData: {
        location: "Connecting...",
        temperature: 0,
        humidity: 0,
        windSpeed: 0,
        precipitation: 0,
        description: "Waiting for API connection",
        icon: "03d"
      },
      predictionProbability: 0
    };
  }
};

// These functions are kept for compatibility with existing components
export const fetchWeatherData = async (): Promise<WeatherData> => {
  const { weatherData } = await fetchAllData();
  return weatherData;
};

export const getSensorData = async (): Promise<SensorData> => {
  const { sensorData } = await fetchAllData();
  return sensorData;
};

// Calculate prediction probability based on all data
export const calculatePredictionProbability = (
  sensorData: SensorData,
  weatherData: WeatherData
): number => {
  // This could be implemented on your backend or frontend depending on your preference
  // For now, keeping the calculation logic for reference
  
  // Calculate based on multiple factors with different weights
  let probability = 0;
  
  // Water level contributes 40% to the prediction
  probability += (sensorData.waterLevel / 100) * 40;
  
  // Float sensor contributes 15% to the prediction
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
