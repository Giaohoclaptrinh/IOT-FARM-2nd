import { db } from "@/firebase/db.config";
import { doc, setDoc, getDoc, collection, addDoc, query, getDocs, updateDoc } from "firebase/firestore";

/**
 * Lấy dữ liệu nhiệt độ và độ ẩm từ Firestore.
 * @param {string} deviceId ID của thiết bị
 * @returns {humidity, temperature} Mảng chứa dữ liệu lịch sử
 */
export const fetchTemperatureHumidityData = async (deviceId) => {
  if (!deviceId) return [];


    

  try {
    const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const rawData = JSON.parse(docSnap.data().data || "[]");  
      return {
        humidity:rawData.map((item)=>{
            return {
                x:item.humidity,
                y:item.timestamp
            }

        },),
        temperature:rawData.map((item)=>{
            return item.temperature},)
      }
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
  }
  return null;
}; 


const addPage = async (userID, deviceID) => {
  try {

    const pagesRef = collection(db, `users/${userID}/pages`);
    const docRef = await addDoc(pagesRef, {allDevice: [] });
   console.log(docRef)

   
  } catch (error) {
    console.error("Error adding page or updating allDevice:", error);
  }
};



/**
 * @param {void} param - description void
 * @return {Array } return Array  container  element  doc are  device
 */


const   getCollectionDevice  = async ()=>{
     const collectionRef =  collection(db,'devices')
     const  getData =  await getDocs(collectionRef);
     return  getData.docs 
}
















/**
 * Gửi dữ liệu nhiệt độ và độ ẩm lên Firestore.
 * @param {string} deviceId ID của thiết bị
 * @param {number} temperature Giá trị nhiệt độ
 * @param {number} humidity Giá trị độ ẩm
 */
export const sendTemperatureHumidityData = async (deviceId, temperature, humidity) => {
  if (!deviceId) return;

  try {
    const timestamp = new Date().toISOString();
    const newEntry = { timestamp, temperature, humidity };

    const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
    const docSnap = await getDoc(docRef);

    let updatedData = [];

    if (docSnap.exists()) {
      const rawData = docSnap.data().data;
      try {
        updatedData = JSON.parse(rawData || "[]");
        if (!Array.isArray(updatedData)) updatedData = [];
      } catch (error) {
        console.error("Lỗi khi parse JSON:", error);
        updatedData = [];
      }
    }

    updatedData.push(newEntry);
    await setDoc(docRef, { data: JSON.stringify(updatedData) });

    console.log("Dữ liệu đã cập nhật:", updatedData);
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu:", error);
  }
};

/**
 * Bắt đầu phát sinh dữ liệu giả tự động mỗi 2s.
 * @param {string} deviceId ID của thiết bị
 * @returns {Function} Hàm để dừng phát sinh dữ liệu
 */
export const startFakeDataGeneration = (deviceId) => {
  if (!deviceId) return;

  const intervalId = setInterval(() => {
    const fakeTemperature = Math.floor(Math.random() * 120) + 1; // Nhiệt độ từ 1 - 120°C
    const fakeHumidity = Math.floor(Math.random() * 100) + 1; // Độ ẩm từ 1 - 100%
    sendTemperatureHumidityData(deviceId, fakeTemperature, fakeHumidity);
  }, 2000);

  console.log("Bắt đầu tạo dữ liệu giả...");
  return () => {
    clearInterval(intervalId);
    console.log("Đã dừng tạo dữ liệu giả.");
  };
};
export {addPage,getCollectionDevice};
