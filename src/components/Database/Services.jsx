// ====================== FIREBASE & IMPORTS ======================
import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, addDoc, arrayUnion, onSnapshot
} from "firebase/firestore";
import { db, auth } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";

// ====================== AUTH HELPERS ======================
export const getUser = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        const docRef = doc(db, `users/${user.uid}`);
        const userData = (await getDoc(docRef)).data();
        resolve(userData);
        unsubscribe();
      } else {
        reject("No user logged in");
        unsubscribe();
      }
    });
  });

// ====================== PAGE MANAGEMENT ======================
export const createPage = async (namePage) => {
  const pageRef = doc(collection(db, "pages"));
  await setDoc(pageRef, { namePage, devices: [] });
  return pageRef.id;
};

export const addPage = async (userID, deviceID) => {
  try {
    const pagesRef = collection(db, `users/${userID}/pages`);
    await addDoc(pagesRef, { allDevice: [] });
  } catch (error) {
    console.error("Error adding page or updating allDevice:", error);
  }
};

export const addDeviceToPage = async (pageId, deviceID) => {
  const pageRef = doc(db, "pages", pageId);
  const pageSnap = await getDoc(pageRef);
  if (pageSnap.exists()) {
    const data = pageSnap.data();
    await updateDoc(pageRef, { devices: [...(data.devices || []), deviceID] });
  }
};

export const getPageList = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        const collectionRef = collection(db, `users/${user.uid}/things`);
        const docs = (await getDocs(collectionRef)).docs;
        const assignValue = docs.map((item) => ({
          ...item.data(),
          idpage: item.id,
        }));
        resolve(assignValue);
      } else {
        reject("No user logged in");
      }
      unsubscribe();
    });
  });

export const deletePageid = (idPage) =>
  new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        await deleteDoc(doc(db, `users/${user.uid}/things`, idPage));
        resolve(["success", "already has delete"]);
      } else {
        reject("No user logged in");
      }
    });
  });

export const deletePage = async (pageId) => {
  await deleteDoc(doc(db, "pages", pageId));
};

export const getDeviceofThingPage = async (pageId, uid) => {
  if (!pageId || !uid) return [];

  const docRef = doc(db, `users/${uid}/things/${pageId}`);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data().DeviceOfThing || []; 
  }
  return [];
};




export const removeDeviceFromThingPage = async (pageId, deviceId, userId) => {
    const ref = doc(db, `users/${userId}/pages/${pageId}/devices/${deviceId}`);
    await deleteDoc(ref);
};
// ====================== DEVICE MANAGEMENT ======================
export const getCollectionDevice = async () => {
  const collectionRef = collection(db, "devices");
  const getData = await getDocs(collectionRef);
  return getData.docs;
};

export const CreatePage = (namePage) =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const CollectionRef = collection(db, `users/${user.uid}/things`);
        const getPageName = query(CollectionRef, where("NamePage", "==", namePage));
        const check = (await getDocs(getPageName)).docs;
        if (check.length !== 0) {
          resolve({ type: "error", message: "Tên trang đã tồn tại" });
        } else {
          await addDoc(CollectionRef, { DeviceOfThing: [], NamePage: namePage });
          resolve({ type: "success", message: "Tạo trang thành công" });
        }
        unsubscribe();
      } else {
        reject(["error", "Người dùng chưa đăng nhập"]);
      }
    });
  });

export const getDevices = async () => {
  try {
    const collectionRef = collection(db, "devices");
    const devices = await getDocs(collectionRef);
    return devices.docs.map((item) => ({
      ...item.data(),
      idDevice: item.id,
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const toggleDevice = async (idDevice) => {
  const docRef = doc(db, `devices/${idDevice}`);
  const data = (await getDoc(docRef)).data();
  if (!data) throw new Error("Device not found");
  const newStatus = data.status === "Online" ? "Offline" : "Online";
  await updateDoc(docRef, { ...data, status: newStatus });
  return {
    type: "success",
    message: `success turn${newStatus === "Online" ? "On" : "Off"} Device ${data.name}`,
  };
};

export const getDeviceById = async (deviceId) => {
  const docSnap = await getDoc(doc(db, "devices", deviceId));
  return docSnap.exists() ? docSnap.data() : null;
};

export const getDevicesByUser = async (uid) => {
  const q = query(collection(db, "devices"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const toggleDeviceStatus = async (deviceId) => {
  const deviceRef = doc(db, "devices", deviceId);
  const deviceSnap = await getDoc(deviceRef);
  if (deviceSnap.exists()) {
    const { status } = deviceSnap.data();
    await updateDoc(deviceRef, { status: status === "ON" ? "OFF" : "ON" });
  }
};

// ====================== DEVICE DATA ======================
export const fetchTemperatureHumidityData = async (deviceId) => {
  if (!deviceId) return null;
  try {
    const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const rawData = JSON.parse(docSnap.data().data || "[]");
      return {
        humidity: rawData.map((item) => ({
          x: item.humidity,
          y: item.timestamp,
        })),
        temperature: rawData.map((item) => item.temperature),
      };
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
  }
  return null;
};

export const sendTemperatureHumidityData = async (deviceId, temperature, humidity) => {
  if (!deviceId) return;
  try {
    const timestamp = new Date().toISOString();
    const newEntry = { timestamp, temperature, humidity };
    const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
    const docSnap = await getDoc(docRef);
    let updatedData = [];
    if (docSnap.exists()) {
      try {
        updatedData = JSON.parse(docSnap.data().data || "[]");
        if (!Array.isArray(updatedData)) updatedData = [];
      } catch (error) {
        console.error("Lỗi khi parse JSON:", error);
        updatedData = [];
      }
    }
    updatedData = [...updatedData, newEntry];
    await setDoc(docRef, { data: JSON.stringify(updatedData) });
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu:", error);
  }
};

export const fetchDeviceData = async (deviceId) => {
  const q = query(collection(db, "devices", deviceId, "data"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const sendDeviceData = async (deviceId, temperature, humidity) => {
  const newDoc = doc(collection(db, "devices", deviceId, "data"));
  await setDoc(newDoc, { temperature, humidity, time: new Date().toISOString() });
};

export const startFakeDataGeneration = (deviceId) => {
  if (!deviceId) return;
  const intervalId = setInterval(() => {
    const fakeTemperature = Math.floor(Math.random() * 120) + 1;
    const fakeHumidity = Math.floor(Math.random() * 100) + 1;
    sendTemperatureHumidityData(deviceId, fakeTemperature, fakeHumidity);
  }, 5000);
  return () => clearInterval(intervalId);
};

export const getNameDevice = async (deviceId = "") => {
  try {
    const docRef = doc(db, "devices", deviceId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data().name || "" : null;
  } catch (error) {
    console.error("Lỗi khi lấy tên thiết bị:", error);
    return null;
  }
};

export const getDeviceHuminity = async (deviceId, storageDataID) => {
  const docref = doc(db, `devices/${deviceId}/storageData/${storageDataID}`);
  const getName = await getNameDevice(deviceId);
  const snapshot = await getDoc(docref);
  return { [deviceId]: { ...snapshot.data(), name: getName } };
};

export const addDeviceIntoPage = async (pageId, idDevice, uid) => {
  if (!pageId || !idDevice || !uid) return;
  try {
    const pageDocRef = doc(db, `users/${uid}/things/${pageId}`);
    await updateDoc(pageDocRef, {
      DeviceOfThing: arrayUnion(idDevice),
    });
  } catch (error) {
    console.error("Lỗi khi thêm thiết bị vào trang:", error);
  }
};

export const getDeviceData = async (deviceId) => {
  try {
    const ref = collection(db, `devices/${deviceId}/storageData`);
    const snap = await getDocs(ref);
    return snap.docs.map((doc) => ({
      timestamp: doc.data().timestamp,
      value: doc.data().value || 0,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thiết bị:", error);
    return [];
  }
};

// ====================== USER DEVICE PERMISSIONS ======================
export const allowDeviceToUser = async (userId, deviceId) => {
  const userDeviceRef = doc(db, "users", userId, "devices", deviceId);
  await setDoc(userDeviceRef, { allowed: true });
};

export const allowDeviceToMultipleUsers = async (userIds, deviceId) => {
  for (const uid of userIds) {
    await allowDeviceToUser(uid, deviceId);
  }
};

export const allowDeviceOfUser = async (userId, deviceId) => {
  if (!userId) return;
  try {
    const createPath = doc(db, `users/${userId}/devicesList/${deviceId}`);
    const checkDoc = (await getDoc(createPath)).data();
    if (!checkDoc) {
      await setDoc(createPath, {});
      return ["success", "success add device into user"];
    } else {
      throw new Error("device already exists");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const allowDeviceofUsers = async (Users, deviceId) => {
  try {
    await Promise.all(Users.map((uid) => allowDeviceOfUser(uid, deviceId)));
    return { type: "success", message: "Allowed permission for all users with device" };
  } catch (errorAllow) {
    return { type: "error", message: "already device exists in user" };
  }
};

export const getDevicesId = async (deviceId) => {
  try {
    const docRef = doc(db, `devices/${deviceId}`);
    const device = await getDoc(docRef);
    return device.data();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDeviceListByuser = async (uid) => {
  if (!uid) return [];
  try {
    const collectionRef = collection(db, `users/${uid}/devicesList`);
    const devices = await getDocs(collectionRef);
    const docList = devices.docs;
    const dataList = await Promise.all(
      docList.map(async (deviceId) => {
        const data = await getDevicesId(deviceId.id);
        return { ...data, idDevice: deviceId.id };
      })
    );
    return dataList;
  } catch (error) {
    console.error("getDeviceListByuser error: ", error);
    return [];
  }
};

export const getDataDeviceByUid = (deviceId, deviceName, onData) => {
  if (!deviceId) return () => {};
  const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const rawData = JSON.parse(docSnap.data().data || "[]");
      onData({ NameDevice: deviceName, data: rawData });
    } else {
      onData?.(null);
    }
  });
  return unsubscribe;
};

// ====================== SEARCH ======================
export const searchUserByName = async (name) => {
  const q = query(collection(db, "users"), where("name", "==", name));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

