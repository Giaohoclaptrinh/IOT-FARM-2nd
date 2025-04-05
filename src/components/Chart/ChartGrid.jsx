import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import { fontFamily, fontWeight } from '@mui/system';

export default function ChartGrid({ humidity, temperature, ph, divID, typeChart = "line" }) {
  const [options, setOption] = useState({});
  const activeTime = ['1M', "6M", "YTD", "ALL"];

  const handleSwitch = (type) => {
    let currentDate = new Date();
    let beginDate;
    
   
    let startDate = new Date(currentDate);
  
    switch (type) {
      case "1M":
        startDate.setMonth(currentDate.getMonth() - 1); 
        beginDate = startDate;
        break;
      case "6M":
        startDate.setMonth(currentDate.getMonth() - 6);
        beginDate = startDate;
        break;
      case "YTD":
        startDate.setDate(currentDate.getDate() - 1); 
        beginDate = startDate;
        break;
      case "ALL":
        return [null, null];
        break;
      default:
        return undefined;
    }
  
  
    const beginUnix = beginDate.getTime();
    const endUnix = currentDate.getTime();
  
    return [beginUnix, endUnix];
  }
  

  const updateZoom = (beginUnix, endUnix) => {
    if (Object.keys(options).length > 0 && divID !== undefined) {
      let chart = new ApexCharts(document.getElementById(divID), options);
      chart.render();
      chart.zoomX(beginUnix, endUnix);
      
      return () => {
        chart.destroy();
      };
    }
  }
  useEffect(() => {
    const chartOptions = {
      chart: {
        type: typeChart,
        height: 350,
        zoom: {
          autoScaleYaxis: true
        },
        width: "100%",
     

        
      },
      series: [
        {
          name: "Humidity",
          data: humidity
        }
      ],
     
      tooltip: {
        x: {
          format: 'dd/MM/yyyy HH:mm:ss'
        }
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        
      },
      stroke: {
        show:true,
        curve: "smooth"
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
        style: 'hollow',
      },
   
    
      
    };

    setOption(chartOptions);

  }, [humidity]);

  useEffect(() => {
    if (Object.keys(options).length > 0 && divID !== undefined) {
      let chart = new ApexCharts(document.getElementById(divID), options);
      chart.render();
      
      return () => {
        chart.destroy();
      };
    }
  }, [options, divID]);

  
  return (
    <div>
      <div className='ml-16 flex gap-x-2 text-xs font-primary text-white font-semibold'>
        {
          activeTime.map((item) => {
            return (
              <button
                key={item}
                className='py-2 px-4 bg-blue-500 shadow-md rounded-lg'
                onClick={() => {
                  const [beginDate, endDate] = handleSwitch(item);
                 
                  updateZoom(beginDate, endDate);
                }}
              >
                {item}
              </button>
            )
          })
        }
      </div>
      <div className='w-full h-80' id={divID}></div>
    </div>
  )
}
