
import { WaveIcon } from "@/components/ui/custom-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FloatSensorCardProps {
  isActive: boolean;
}

const FloatSensorCard = ({ isActive }: FloatSensorCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Float Sensor</CardTitle>
          <WaveIcon className="h-5 w-5 text-water" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            isActive 
              ? "bg-red-100 text-red-600 animate-pulse-slow" 
              : "bg-green-100 text-green-600"
          }`}>
            <span className="font-bold text-lg">{isActive ? "ACTIVE" : "INACTIVE"}</span>
          </div>
          
          <Badge variant={isActive ? "destructive" : "outline"} className="text-sm">
            {isActive ? "Water Detected" : "No Water Detected"}
          </Badge>
          
          <div className="text-sm text-center text-muted-foreground">
            <p>Boolean Sensor: {isActive ? "TRUE" : "FALSE"}</p>
            <p className="text-xs mt-2">
              {isActive 
                ? "Warning: Float sensor activated" 
                : "Normal: Sensor in resting state"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FloatSensorCard;
