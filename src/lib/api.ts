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

// These are placeholder functions to be replaced with your actual API calls
export const fetchWeatherData = async (): Promise<WeatherData> => {
  // This will be replaced with your backend API call
  // For initial rendering, returning default values
  return {
    location: "Connecting...",
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    precipitation: 0,
    description: "Waiting for API connection",
    icon: "03d",
  };
};

export const getSensorData = (): SensorData => {
  // This will be replaced with your backend API call
  // For initial rendering, returning default values
  return {
    waterLevel: 0,
    floatSensor: false,
    temperature: 0,
    humidity: 0,
  };
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
