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
export const fetchAllData = async () => {
  return new Promise((resolve) => {
    subscribeToData((data) => {
      resolve(data);
    });
  });
};

// These functions are kept for compatibility with existing components
export const fetchWeatherData = async () => {
  const { weatherData } = await fetchAllData();
  return weatherData;
};

export const getSensorData = async () => {
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

import { ref, onValue, off } from 'firebase/database';
import { db } from './firebase';
import { WeatherData, SensorData } from './types';

export const subscribeToData = (
  onDataUpdate: (data: {
    sensorData: SensorData;
    weatherData: WeatherData;
    predictionProbability: number;
  }) => void
) => {
  const today = new Date().toISOString().split('T')[0];
  const iotRef = ref(db, `flood_monitoring/iot_data/latest/${today}`);

  const listener = onValue(iotRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const keys = Object.keys(data);
      const latest = data[keys[keys.length - 1]];

      // Convert Firebase data to our app's format
      const sensorData: SensorData = {
        waterLevel: 100 - (latest.distance / 200 * 100), // Convert distance to water level percentage
        floatSensor: latest.float_triggered === "true",
        temperature: latest.temperature || 0,
        humidity: latest.humidity || 0
      };

      // Use existing weather data structure
      const weatherData: WeatherData = {
        location: "Local Sensor",
        temperature: latest.temperature || 0,
        humidity: latest.humidity || 0,
        windSpeed: 0, // Add if you have this data
        precipitation: 0, // Add if you have this data
        description: latest.float_triggered === "true" ? "Warning: Water Detected" : "Normal Conditions",
        icon: latest.float_triggered === "true" ? "09d" : "01d"
      };

      // Calculate prediction using existing function
      const probability = calculatePredictionProbability(sensorData, weatherData);

      onDataUpdate({
        sensorData,
        weatherData,
        predictionProbability: probability
      });
    }
  });

  // Return unsubscribe function
  return () => off(iotRef, 'value', listener);
};
