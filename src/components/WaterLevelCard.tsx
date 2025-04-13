
import { Droplets, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WaterLevelCardProps {
  waterLevel: number;
}

const WaterLevelCard = ({ waterLevel }: WaterLevelCardProps) => {
  // Define thresholds for status
  const isHigh = waterLevel > 75;
  const isLow = waterLevel < 25;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Water Level</CardTitle>
          <Droplets className="h-5 w-5 text-water" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative h-36 w-36">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="#E5F6FD"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                />
                <path
                  d={`M50,5 A45,45 0 ${waterLevel > 50 ? 1 : 0},1 ${
                    50 + 45 * Math.sin((waterLevel / 100) * Math.PI)
                  },${
                    50 - 45 * Math.cos((waterLevel / 100) * Math.PI)
                  }`}
                  fill="none"
                  stroke="#1EAEDB"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <text
                  x="50"
                  y="55"
                  fontSize="18"
                  textAnchor="middle"
                  fill="#1A202C"
                  fontWeight="bold"
                >
                  {waterLevel}%
                </text>
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Ultrasonic Sensor</span>
              <span className={`flex items-center font-medium ${
                isHigh ? "text-red-500" : isLow ? "text-green-500" : "text-blue-500"
              }`}>
                {isHigh ? (
                  <>
                    <ArrowUpCircle className="mr-1 h-4 w-4" /> High
                  </>
                ) : isLow ? (
                  <>
                    <ArrowDownCircle className="mr-1 h-4 w-4" /> Low
                  </>
                ) : (
                  "Normal"
                )}
              </span>
            </div>
            <Progress value={waterLevel} className="h-2 bg-water-light" />
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Threshold: 75% (Warning)</p>
            <p>Current Reading: {waterLevel}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterLevelCard;
