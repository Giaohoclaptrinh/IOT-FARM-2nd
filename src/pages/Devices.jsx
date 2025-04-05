// import React, { useState } from "react";
// import DeviceList from "../components/Devices/DeviceList";
// import DeviceChart from "@/components/Devices/DeviceChart";
// import { useNavigate } from "react-router-dom";

// const Devices = () => {
//   const navigate = useNavigate();
//   const [selectedDevice, setSelectedDevice] = useState(null); // Lưu cả đối tượng thiết bị

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Quản lý Thiết bị</h1>

//       {/* Truyền setSelectedDevice vào DeviceList để cập nhật khi click vào thiết bị */}
//       <DeviceList setSelectedDevice={(device) => setSelectedDevice(device)} />

//       {/* Chỉ hiển thị biểu đồ nếu có thiết bị được chọn */}
//       {selectedDevice && (
//         <div className="mt-8 p-4 border rounded-lg shadow bg-white">
//           <h2 className="text-lg font-semibold">Dữ liệu thiết bị: {selectedDevice}</h2>
//           <DeviceChart deviceId={selectedDevice.id} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Devices;



import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/db.config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import DeviceChart from "@/components/Devices/DeviceChart"; // Đảm bảo đã import đúng component biểu đồ
import HomeWrap from "./HomeWrap";
import { getCollectionDevice } from "@/components/Database/Services";

const Devices = () => {
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState([]);
  
  useEffect(()=>{
    const getCollection = async()=>{
      const device =  await getCollectionDevice();
      setDeviceData(device);
    }
    getCollection();
    

  },[])

 console.log(deviceData)

  

  return (
    <HomeWrap>
      <div className=" font-seconds border rounded-md">
      <table className="table-auto border-collapse  divide-y  relative text-left  w-full">
            <thead className="">
              <tr className=" bg-slate-200 rounded-t-md font-semibold text-md    ">
                <th className="py-2  rounded-tl-md ">Name Device</th>
                <th className="py-2  ">Date </th>
                <th  className="py-2  rounded-tr-md">Status</th>
              </tr>
            </thead>
            <tbody className="">
              {
                deviceData.map((item,index)=>{
                  const createdAt = item.data().createdAt.toDate();  // Chuyển timestamp thành Date
                  const day = createdAt.getDate();  // Lấy ngày
                  const month = createdAt.getMonth() + 1;  // Lấy tháng (chú ý: tháng bắt đầu từ 0, nên cần +1)
                  const year = createdAt.getFullYear();  // Lấy năm
                  const formattedDate = `${day}-${month}-${year}`
                  return (
                    <tr className="border-b last:border-none">
                      <td className="  font-bold ">{item.data().name}</td>
                      <td className="text-gray-600 font-normal" >{formattedDate}</td>
                      <td  className="text-gray-600 font-normal">{item.data().status  }</td>
                    </tr>
                  )
                })
              }
            </tbody>
        </table>
      </div>
        
    </HomeWrap>
   
  );
};

export default Devices;
