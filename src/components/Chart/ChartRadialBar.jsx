  import React, { useEffect, useState } from 'react'
  import { RadialBar } from 'recharts'
  import ApexCharts from 'apexcharts';
  import { Opacity } from '@mui/icons-material';

  function ChartRadialBar({temperature , divID}) {
      const [options, setOptions] = useState(null); 
      useEffect(() => {
          console.log("chartRadialBar");
      
          if (temperature !== undefined) {
            const newOptions = {
              chart: {
                type: "radialBar",
                width: "100%",
              },
              series: [temperature],
            
              labels: ["Temperature"],
              plotOptions: {
                radialBar: {
                  startAngle:-180,
                  dataLabels:{
                    name: {
                          show:true,
                          fontSize:16,
                          fontFamily:"Poppins",
                          fontWeight:800,
                      }
                  },
                  hollow: {
                    size: "60%",
                  
                  dropShadow :{
                      enabled:true,
                  },
                  
                  },
                },
              },
            };
      
            setOptions(newOptions);
          }
        }, [temperature]);
      
        useEffect(() => {
          if (options) {
            // Ensure options is defined before rendering the chart
            const chart = new ApexCharts(document.getElementById(divID), options);
            chart.render();
      
            // Cleanup when component unmounts
            return () => {
              chart.destroy();
            };
          }
        }, [options, divID]);
    return (
      <div className='flex items-center justify-center translate-y-10' id={divID}></div>
    )
  }

  export default ChartRadialBar;
