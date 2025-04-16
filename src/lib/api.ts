
import { ref, onValue, off } from 'firebase/database';
import { db } from './firebase';
import { WeatherData, SensorData, FirebaseData } from './types';

export type { WeatherData, SensorData };

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
      console.log("Latest IoT data:", latestIoT);

      // Convert IoT data to SensorData format
      const sensorData: SensorData = {
        waterLevel: convertDistanceToPercentage(latestIoT.distance || 0),
        floatSensor: latestIoT.float_triggered === "true",
        temperature: latestIoT.temperature || 0,
        humidity: latestIoT.humidity || 0
      };

      // Get weather data and calculate prediction
      onValue(weatherRef, (weatherSnapshot) => {
        const weatherData = weatherSnapshot.val();
        console.log("Weather data:", weatherData);
        
        const latestWeather = weatherData ? weatherData[Object.keys(weatherData)[Object.keys(weatherData).length - 1]] : null;
        console.log("Latest weather:", latestWeather);

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
    } else {
      console.log("No IoT data available");
      // Return fallback data when no data is available
      onDataUpdate({
        sensorData: {
          waterLevel: 0,
          floatSensor: false,
          temperature: 0,
          humidity: 0
        },
        weatherData: {
          location: CITY,
          temperature: 0,
          humidity: 0,
          windSpeed: 0,
          precipitation: 0,
          description: "No data available",
          icon: "03d"
        },
        predictionProbability: 0
      });
    }
  });

  // Return cleanup function
  return () => {
    off(iotRef);
    off(weatherRef);
  };
};

// Helper function to convert distance to percentage
// Assuming sensor is placed at top, and max water height is 200cm
// So 0cm distance = 100% water level, 200cm distance = 0% water level
const convertDistanceToPercentage = (distanceCm: number): number => {
  // Set a max distance (when tank is empty)
  const maxDistance = 200; // 200cm when empty
  
  // Convert: closer to sensor = higher water level
  const percentage = Math.max(0, Math.min(100, 100 - (distanceCm / maxDistance * 100)));
  
  // Return as a rounded integer percentage
  return Math.round(percentage);
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
export const fetchAllData = async () => {
  return new Promise((resolve) => {
    const unsubscribe = subscribeToData((data) => {
      resolve(data);
      unsubscribe();
    });
  });
};

export const calculatePredictionProbability = (
  sensorData: SensorData,
  weatherData: WeatherData
): number => {
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
  
  return Math.min(100, Math.max(0, Math.round(probability)));
};

// Export these for compatibility
export const fetchWeatherData = async () => {
  const data = await fetchAllData() as any;
  return data.weatherData;
};

export const getSensorData = async () => {
  const data = await fetchAllData() as any;
  return data.sensorData;
};
