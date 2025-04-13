
# Aqua Guardian Insight Hub

A web application dashboard for monitoring water levels, environmental conditions, and flood prediction analytics from IoT sensors and weather APIs.

## Features

- Real-time water level monitoring with ultrasonic sensor data
- Float sensor status for water detection
- Weather data integration with OpenWeather API
- Temperature and humidity sensor readings
- Flood prediction probability calculation based on sensor and weather data
- Responsive dashboard design with real-time updates

## Setup Instructions

### Backend Setup

1. Create a server to receive data from Arduino and OpenWeather API
2. Install dependencies: Express, Axios, CORS
3. Set up API endpoints:
   - `/api/sensor-data` - to receive Arduino sensor data
   - `/api/data` - to serve combined sensor and weather data to frontend

### Arduino Setup

1. Connect sensors to Arduino:
   - Ultrasonic sensor for water level
   - Float sensor for water detection
   - DHT11/DHT22 for temperature and humidity
2. Install required libraries for WiFi and HTTP communication
3. Configure the Arduino to send sensor data to your backend endpoint
4. Set appropriate polling interval for sensor readings

### Frontend Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Update the API endpoint in `src/lib/api.ts` to point to your backend
4. Run the development server: `npm run dev`
5. Access the dashboard at `http://localhost:5173`

## Configuration

- Update `API_URL` in `src/lib/api.ts` to match your backend URL
- Adjust polling intervals in both Arduino code and React frontend as needed
- Customize prediction algorithm parameters based on your specific environment

## OpenWeather API Integration

1. Sign up for an OpenWeather API key at [openweathermap.org](https://openweathermap.org/api)
2. Add your API key to the backend environment variables
3. Configure your location settings in the backend

## Troubleshooting

- Check console for API connection errors
- Verify Arduino is correctly sending data to your backend
- Ensure your backend server is running and accessible
- Check network connectivity between all components
