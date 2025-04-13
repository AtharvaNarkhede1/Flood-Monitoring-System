
import { Thermometer, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TempHumidityCardProps {
  temperature: number;
  humidity: number;
}

const TempHumidityCard = ({ temperature, humidity }: TempHumidityCardProps) => {
  // Determine temperature ranges
  const isHot = temperature > 30;
  const isCold = temperature < 15;
  
  // Determine humidity ranges
  const isHumid = humidity > 70;
  const isDry = humidity < 30;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Temperature & Humidity</CardTitle>
          <Thermometer className="h-5 w-5 text-temperature" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temperature */}
          <div className="flex flex-col items-center">
            <div className={`relative w-24 h-24 flex items-center justify-center rounded-full ${
              isHot ? "bg-red-100" : isCold ? "bg-blue-100" : "bg-amber-100"
            }`}>
              <div className={`text-3xl font-bold ${
                isHot ? "text-red-600" : isCold ? "text-blue-600" : "text-amber-600"
              }`}>
                {temperature}°C
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-2 rounded-b-full" 
                style={{
                  background: isHot 
                    ? "linear-gradient(90deg, #FCD34D 0%, #EF4444 100%)"
                    : isCold 
                    ? "linear-gradient(90deg, #93C5FD 0%, #1D4ED8 100%)"
                    : "linear-gradient(90deg, #FCD34D 0%, #F97316 100%)"
                }}
              />
            </div>
            <h4 className="mt-3 font-medium">Temperature</h4>
            <span className="text-xs text-muted-foreground mt-1">
              {isHot 
                ? "High Temperature Warning" 
                : isCold 
                ? "Low Temperature Warning" 
                : "Normal Temperature Range"}
            </span>
          </div>
          
          {/* Humidity */}
          <div className="flex flex-col items-center">
            <div className={`relative w-24 h-24 flex items-center justify-center rounded-full ${
              isHumid ? "bg-blue-100" : isDry ? "bg-orange-100" : "bg-sky-100"
            }`}>
              <div className={`text-3xl font-bold ${
                isHumid ? "text-blue-600" : isDry ? "text-orange-600" : "text-sky-600"
              }`}>
                {humidity}%
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-2 rounded-b-full" 
                style={{
                  background: isHumid 
                    ? "linear-gradient(90deg, #93C5FD 0%, #1D4ED8 100%)"
                    : isDry 
                    ? "linear-gradient(90deg, #FCD34D 0%, #EA580C 100%)"
                    : "linear-gradient(90deg, #BAE6FD 0%, #0EA5E9 100%)"
                }}
              />
            </div>
            <h4 className="mt-3 font-medium">Humidity</h4>
            <span className="text-xs text-muted-foreground mt-1">
              {isHumid 
                ? "High Humidity Warning" 
                : isDry 
                ? "Low Humidity Warning" 
                : "Normal Humidity Range"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TempHumidityCard;
