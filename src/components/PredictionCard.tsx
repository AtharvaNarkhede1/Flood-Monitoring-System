
import { GaugeIcon } from "@/components/ui/custom-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HalfCircleGauge } from "@/components/ui/custom-icons";

interface PredictionCardProps {
  predictionValue: number;
  waterLevel: number;
  floatSensor: boolean;
  temperature: number;
}

const getPredictionLabel = (value: number): string => {
  if (value < 25) return "Low Risk";
  if (value < 50) return "Moderate Risk";
  if (value < 75) return "High Risk";
  return "Critical Risk";
};

const PredictionCard = ({
  predictionValue,
  waterLevel,
  floatSensor,
  temperature,
}: PredictionCardProps) => {
  const predictionLabel = getPredictionLabel(predictionValue);
  
  // Determine gauge color based on prediction value
  let gaugeColor = "#10B981"; // Green for low risk
  if (predictionValue >= 75) {
    gaugeColor = "#EF4444"; // Red for critical
  } else if (predictionValue >= 50) {
    gaugeColor = "#F97316"; // Orange for high
  } else if (predictionValue >= 25) {
    gaugeColor = "#F59E0B"; // Amber for moderate
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Total Prediction Probability</CardTitle>
          <GaugeIcon className="h-5 w-5 text-prediction" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <HalfCircleGauge 
            value={predictionValue} 
            color={gaugeColor}
            label={predictionLabel}
          />
          
          <div className="w-full mt-6 space-y-2">
            <h4 className="font-medium text-sm">Contributing Factors:</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li className="flex justify-between">
                <span>Water Level:</span>
                <span className="font-medium">{waterLevel}%</span>
              </li>
              <li className="flex justify-between">
                <span>Float Sensor:</span>
                <span className={`font-medium ${floatSensor ? "text-red-500" : "text-green-500"}`}>
                  {floatSensor ? "Active" : "Inactive"}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Temperature:</span>
                <span className="font-medium">{temperature}°C</span>
              </li>
              <li className="flex justify-between">
                <span>Weather Data:</span>
                <span className="font-medium">+5%</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-muted p-2 rounded-md w-full text-center text-xs">
            {predictionValue > 70 ? (
              <span className="text-red-500 font-semibold">
                Take immediate action! High risk detected.
              </span>
            ) : predictionValue > 40 ? (
              <span className="text-amber-500 font-semibold">
                Monitor closely. Risk is elevated.
              </span>
            ) : (
              <span className="text-green-500 font-semibold">
                Conditions normal. No action needed.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
