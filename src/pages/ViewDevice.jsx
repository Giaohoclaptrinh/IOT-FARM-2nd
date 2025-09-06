import { instance } from '@/components/API/devices'
import ChartDynamic from '@/components/Chart/ChartDynamic'
import ChartGrid from '@/components/Chart/ChartGrid'
import React, { useEffect, useState } from 'react'

export default function ViewDevice( {id}) {
    const  [deviceData,setDeviceData] = useState()
    useEffect(()=>{
        instance.get(`/device/${id}`).then(
            value=>{
                setDeviceData(value.data);
                
            }
        )
    },[id])
    if (!deviceData) {
      return <div>Loading...</div>;
    }

    return <ChartDynamic data={deviceData} />;
}
