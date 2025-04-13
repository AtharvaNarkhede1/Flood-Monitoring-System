
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import WaterLevelCard from "@/components/WaterLevelCard";
import FloatSensorCard from "@/components/FloatSensorCard";
import PredictionCard from "@/components/PredictionCard";
import WeatherCard from "@/components/WeatherCard";
import TempHumidityCard from "@/components/TempHumidityCard";
import { 
  fetchWeatherData, 
  getSensorData, 
  calculatePredictionProbability,
  type SensorData, 
  type WeatherData 
} from "@/lib/api";

const Index = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    waterLevel: 45,
    floatSensor: false,
    temperature: 24,
    humidity: 60,
  });
  
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: "Loading...",
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    precipitation: 0,
    description: "",
    icon: "01d",
  });
  
  const [predictionValue, setPredictionValue] = useState(0);
  
  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get weather data
        const weather = await fetchWeatherData();
        setWeatherData(weather);
        
        // Get sensor data (this would be a real API call in production)
        const sensors = getSensorData();
        setSensorData(sensors);
        
        // Calculate prediction
        const prediction = calculatePredictionProbability(sensors, weather);
        setPredictionValue(prediction);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
    
    // Set up a polling interval to refresh data
    const interval = setInterval(() => {
      const newSensorData = getSensorData();
      setSensorData(newSensorData);
      
      // Recalculate prediction with new sensor data and existing weather
      const newPrediction = calculatePredictionProbability(newSensorData, weatherData);
      setPredictionValue(newPrediction);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [weatherData]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Water Level + Float Sensor */}
          <div className="space-y-6">
            <WaterLevelCard waterLevel={sensorData.waterLevel} />
            <FloatSensorCard isActive={sensorData.floatSensor} />
          </div>
          
          {/* Middle Column - Prediction Probability */}
          <div>
            <PredictionCard 
              predictionValue={predictionValue}
              waterLevel={sensorData.waterLevel}
              floatSensor={sensorData.floatSensor}
              temperature={sensorData.temperature}
            />
          </div>
          
          {/* Right Column - Weather + Temp/Humidity */}
          <div className="space-y-6">
            <WeatherCard weatherData={weatherData} />
            <TempHumidityCard 
              temperature={sensorData.temperature}
              humidity={sensorData.humidity} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
