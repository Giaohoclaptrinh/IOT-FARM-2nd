import HomeWrap from '@/pages/HomeWrap';
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import ChartDynamic from '../Chart/ChartDynamic';

export default function Testdevice() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

    socket.onopen = () => {
      console.log('Đã kết nối websocket');
    };

    socket.onmessage = (event) => {
      try {
        console.log(event.data);
        const parseData = JSON.parse(event.data);

        if (parseData.id === 'stm32-motor-current-6') {
          const { m6_pH } = parseData.decoded_payload;
          const timestamp = new Date(parseData.received_at).getTime();

          setData((prevData) => {
            const newData = [...prevData, { x: timestamp, y: m6_pH }];
            return newData.slice(-60); 
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
        <ChartDynamic humidity={data} divID={"saocungdc"}/>
       
      </HomeWrap>
  );
}
