import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import HomeWrap from '@/pages/HomeWrap';

export default function ChartRealTime({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = new ApexCharts(chartRef.current, {
      series: [
        {
          data: data,
        },
      ],
      chart: {
        id: 'realtime',
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Dynamic Updating Chart',
        align: 'center',
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        max: 40,
        min: 0,
      },
      legend: {
        show: false,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: (val) => {
            return new Date(val).toLocaleTimeString('vi-VN', {
             hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
              timeZone: 'Asia/Ho_Chi_Minh', 
            });
          },
        },
      },
      tooltip: {
        x: {
          format: 'HH:mm',
        },
      },
    });

    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.updateSeries([
        {
          data: data,
        },
      ]);
    }
  }, [data]);

  return<HomeWrap>
    <div id="chart" ref={chartRef}></div>
  </HomeWrap>;
  
  
}
