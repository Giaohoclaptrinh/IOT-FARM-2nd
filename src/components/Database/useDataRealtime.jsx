import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/db.config";

export function useDeviceData(deviceId) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!deviceId) return;

    const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const rawData = JSON.parse(docSnap.data().data || "[]");
        setData(rawData); // rawData = array of { timestamp, temperature, humidity }
      }
    });

    return () => unsubscribe();
  }, [deviceId]);

  return data;
}
