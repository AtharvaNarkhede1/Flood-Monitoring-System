import { ref, onValue, off } from 'firebase/database';
import { db } from './firebase';
import { WeatherData, SensorData, FirebaseData } from './types';

// Fetch data from Firebase
export const subscribeToData = (
  onDataUpdate: (data: {
    sensorData: SensorData;
    weatherData: WeatherData;
    predictionProbability: number;
  }) => void
) => {
  const today = new Date().toISOString().split('T')[0];
  const iotRef = ref(db, `flood_monitoring/iot_data/latest/${today}`);
  const weatherRef = ref(db, `flood_monitoring/weather_data/${today}`);

  // Subscribe to IoT data
  const iotListener = onValue(iotRef, (snapshot) => {
    const iotData = snapshot.val();
    if (iotData) {
      const keys = Object.keys(iotData);
      const latestIoT = iotData[keys[keys.length - 1]] as FirebaseData;

      // Convert IoT data to SensorData format
      const sensorData: SensorData = {
        waterLevel: 100 - (latestIoT.distance / 200 * 100), // Convert distance to percentage
        floatSensor: latestIoT.float_triggered === "true",
        temperature: latestIoT.temperature || 0,
        humidity: latestIoT.humidity || 0
      };

      // Get weather data and calculate prediction
      onValue(weatherRef, (weatherSnapshot) => {
        const weatherData = weatherSnapshot.val();
        const latestWeather = weatherData ? weatherData[Object.keys(weatherData)[Object.keys(weatherData).length - 1]] : null;

        const weatherInfo: WeatherData = latestWeather ? {
          location: CITY,
          temperature: latestWeather.temperature,
          humidity: latestWeather.humidity,
          windSpeed: latestWeather.wind_speed,
          precipitation: latestWeather.precipitation,
          description: latestWeather.weather,
          icon: getWeatherIcon(latestWeather.weather)
        } : {
          location: "Loading...",
          temperature: 0,
          humidity: 0,
          windSpeed: 0,
          precipitation: 0,
          description: "Connecting...",
          icon: "03d"
        };

        const probability = calculatePredictionProbability(sensorData, weatherInfo);
        
        onDataUpdate({
          sensorData,
          weatherData: weatherInfo,
          predictionProbability: probability
        });
      }, { onlyOnce: true });
    }
  });

  // Return cleanup function
  return () => {
    off(iotRef);
    off(weatherRef);
  };
};

// Helper function to get weather icon code
const getWeatherIcon = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes('rain')) return '09d';
  if (desc.includes('cloud')) return '03d';
  if (desc.includes('clear')) return '01d';
  if (desc.includes('snow')) return '13d';
  if (desc.includes('thunder')) return '11d';
  return '02d';
};

const CITY = "Mumbai"; // Matching your Python script

// These functions are kept for compatibility
export const fetchAllData = () => {
  return new Promise((resolve) => {
    subscribeToData((data) => {
      resolve(data);
    });
  });
};

// Fetch data from backend
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
