import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { instance } from '../API/devices';

function ChartDynamic({ humidity,data, divID }) {
  const chartRef = useRef(null); // Lưu thể hiện chart
  const containerID = `chart-dynamic-${divID ?? "default"}`; // ID của div

  useEffect(()=>{
    // console.log(data.payload);
  },[])
  // Render chart lần đầu
  useEffect(() => {
    var options = {
      series: [
        {
          name: 'pH',
          data: data.payload.map((el) => el.ph),
        },
        {
          name: 'Temprature',
          data: data.payload.map((el) => el.temp),
        },
      ],
      title: {
        text: `${data.id}`,
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Poppins',
          color: '#263238',
        },
      },
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: data.payload.map((el) => el.timestamp),
      },
      
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
    

    const chart = new ApexCharts(document.getElementById(containerID), options);
    chart.render();
    chartRef.current = chart;

    return () => {
      chart.destroy();
    };
  }, [containerID]);




  return <div id={containerID}></div>;
}

export default ChartDynamic;
