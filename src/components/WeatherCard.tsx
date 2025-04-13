
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  CloudSun, 
  CloudSnow, 
  Cloud,
  Sun
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/lib/api";

interface WeatherCardProps {
  weatherData: WeatherData;
}

const getWeatherIcon = (icon: string) => {
  // Map OpenWeather icon codes to Lucide icons
  switch (icon.substring(0, 2)) {
    case "01": // clear sky
      return <Sun className="h-12 w-12 text-amber-400" />;
    case "02": // few clouds
    case "03": // scattered clouds
      return <CloudSun className="h-12 w-12 text-amber-400" />;
    case "04": // broken clouds
      return <Cloud className="h-12 w-12 text-gray-400" />;
    case "09": // shower rain
    case "10": // rain
      return <CloudRain className="h-12 w-12 text-blue-400" />;
    case "13": // snow
      return <CloudSnow className="h-12 w-12 text-blue-200" />;
    default:
      return <CloudSun className="h-12 w-12 text-amber-400" />;
  }
};

const WeatherCard = ({ weatherData }: WeatherCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Weather Data</CardTitle>
          <CloudSun className="h-5 w-5 text-amber-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">{weatherData.location}</h3>
            {getWeatherIcon(weatherData.icon)}
          </div>
          
          <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
          
          <div className="text-sm text-muted-foreground capitalize">
            {weatherData.description}
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <CloudRain className="h-4 w-4 mr-1" />
                <span>Precipitation</span>
              </div>
              <span className="font-semibold">{weatherData.precipitation}%</span>
            </div>
            
            <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Wind className="h-4 w-4 mr-1" />
                <span>Wind Speed</span>
              </div>
              <span className="font-semibold">{weatherData.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
