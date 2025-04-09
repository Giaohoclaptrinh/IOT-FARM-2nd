import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

function ChartDynamic({ humidity, divID }) {
  const chartRef = useRef(null); // Lưu thể hiện chart
  const containerID = `chart-dynamic-${divID}`; // ID của div

  // Render chart lần đầu
  useEffect(() => {
    const options = {
      chart: {
        id: 'realtime-humidity',
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        zoom: { enabled: true },
        toolbar: { show: true },
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'Humidity',
          data: humidity,
        },
      ],
      xaxis: {
        type: 'datetime',
        range: 30000,
        labels: {
          formatter: (value) =>
            new Date(value).toLocaleTimeString("vi-VN", {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
              timeZone: "Asia/Ho_Chi_Minh"
            }),
        },
      },
      yaxis: {
        max: 100,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Realtime Humidity',
        align: 'left',
      },
    };
    

    const chart = new ApexCharts(document.getElementById(containerID), options);
    chart.render();
    chartRef.current = chart;

    return () => {
      chart.destroy();
    };
  }, [containerID]);


  useEffect(() => {
    if (chartRef.current && humidity) {
      chartRef.current.updateSeries([
        {
          name: 'Humidity',
          data: humidity,
        },
      ]);
    }
  }, [humidity]);

  return <div id={containerID}></div>;
}

export default ChartDynamic;
