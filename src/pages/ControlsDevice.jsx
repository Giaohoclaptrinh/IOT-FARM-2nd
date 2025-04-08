import ChartDynamic from '@/components/Chart/ChartDynamic';
import React, { useState, useEffect } from 'react';
import HomeWrap from './HomeWrap';


function ControlsDevice() {
  
  const [humidityData, setHumidityData] = useState([]);
  
 
  useEffect(() => {
    const interval = setInterval(() => {
      
      const newHumidity = Math.random() * (100 - 0) + 0; 
      const timestamp = new Date().getTime();

      setHumidityData((prevData) => [
        ...prevData,
        [timestamp, newHumidity.toFixed(1)], 
      ]);
    }, 5000); 

  
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <HomeWrap>
      <h2>Device Control</h2>
      <ChartDynamic humidity={humidityData} divID="device-chart" />
    </HomeWrap>
  );
}

export default ControlsDevice;
