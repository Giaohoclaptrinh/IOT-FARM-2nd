
// export default Dashboard; parameter
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/db.config";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";

import TemperatureAndHumidityChart from "@/components/Chart/TemperatureAndHumidityChart";
import TemperatureAndHumidityInput from "@/components/Chart/TemperatureAndHumidityInput";

import HomeWrap from "./HomeWrap";
import ChartGrid from "@/components/Chart/ChartGrid";
import { getCollectionDevice } from "@/components/Database/Services";
import ChartRadialBar from "@/components/Chart/ChartRadialBar";

const Dashboard = () => {
  const { deviceUid } = useParams();
  function generateTemperatureData(startDate, endDate, numPoints) {
    // Chuyển đổi ngày bắt đầu và kết thúc thành timestamp (miliseconds)
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
  

    const timeStep = (endTimestamp - startTimestamp) / numPoints;
  
    const data = [];
  
    for (let i = 0; i < numPoints; i++) {
      const timestamp = startTimestamp + timeStep * i;
      
      const temperature = Math.random() * (40 - 20) + 20;
  
      data.push([timestamp, temperature.toFixed(1)]);
    }
  
    return data;
  }
  
  const startDate = '2024-01-01';
  const endDate = '2025-4-10';
  const numPoints = 50; 
  
  const temperatureData = generateTemperatureData(startDate, endDate, numPoints);
  

  return (
    <HomeWrap>
   
      <div>sidetop bar option</div>
       <div className="mt-16 grid  grid-cols-[1fr_9fr]  gap-y-40">
     <ChartRadialBar temperature={28} divID={"item-2-child"}></ChartRadialBar>
      <ChartGrid humidity={temperatureData} typeChart="area"  divID={"item-2"}  />
  
      {/* <ChartRadialBar temperature={28} divID={"item-1-child"}></ChartRadialBar>
      <ChartGrid humidity={temperatureData} typeChart="area"  divID={"item-1"}  /> */}
     
    </div>


    </HomeWrap>
  );
};

export default Dashboard;