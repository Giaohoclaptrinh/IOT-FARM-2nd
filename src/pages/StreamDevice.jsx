import React, { useEffect, useState } from 'react'
import HomeWrap from './HomeWrap'
import { useParams } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import ApexCharts from 'apexcharts';
import ChartRealTime from '@/components/Chart/ChartRealTime';
import { instance } from '@/components/API/devices';

export default function StreamDevice() {
    const [data, setData] = useState([]);
    const {id} = useParams();
    useEffect(()=>{
        console.log(id)
        if(id)
        {
          instance.get(`device/${id}`).then(
            result=>{
               const  payload   =   result.data.payload;

              const listData = payload.map((el) => {
                console.log(el)
                const values = Object.values(el);
                const dataRealTime = { x: values[2], y: values[1] };
                return dataRealTime.slice(-60);
              });
              setData((prev) => [...prev, ...listData]);
           }
          )
        }
        
    },[])
      useEffect(() => {
        const socket = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');
    
        socket.onopen = () => {
          console.log('Đã kết nối websocket');
        };
    
        socket.onmessage = (event) => {
          try {

            const parseData = JSON.parse(event.data);
            if (parseData.id === id) {
              const values = Object.values(parseData.decoded_payload); 
              const dataRealTime = {x:values[2],y:values[1]}
                
              setData((prevData) => {
                return  [...prevData, dataRealTime]
              });
            }
          } catch (err) {
            console.error('Lỗi phân tích dữ liệu websocket:', err);
          }
        };
    
        return () => {
          socket.close();
        };
      }, []);

  return (
    <HomeWrap>
      <ChartRealTime data={data} />
    </HomeWrap>
  );
}