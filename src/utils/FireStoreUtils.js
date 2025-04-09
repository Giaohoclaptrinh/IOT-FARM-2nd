import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/db.config";

// Thêm Page
export const addPage = async (namePage, userId) => {
  const path = `users/${userId}/pages`;
  const ref = doc(db, path, namePage);
  await setDoc(ref, { createdAt: new Date() });
};

// Lấy tất cả Page của user
export const getUserPages = async (userId) => {
  const path = `users/${userId}/pages`;
  const ref = collection(db, path);
  const snap = await getDocs(ref);
  return snap.docs;
};

// Lấy thiết bị trong Page
export const getDevicesInPage = async (pageId) => {
  const ref = collection(db, `things/${pageId}/devices`);
  const snap = await getDocs(ref);
  return snap.docs.map(d => d.data());
};

// Lấy thiết bị chưa có trong Page
export const getDevicesNotInPage = async (pageId) => {
  const allDevicesSnap = await getDocs(collection(db, "devices"));
  const linkedSnap = await getDocs(collection(db, `things/${pageId}/devices`));
  const linkedUIDs = new Set(linkedSnap.docs.map(d => d.id));
  return allDevicesSnap.docs
    .map(doc => doc.data())
    .filter(d => !linkedUIDs.has(d.uid));
};

// Thêm thiết bị vào Page
export const addDeviceToPage = async (pageId, device) => {
  if (!device?.uid) {
    console.error("Device UID is missing!", device);
    return; // hoặc throw new Error("Missing device UID");
  }

  const ref = doc(db, `things/${pageId}/devices/${device.uid}`);
  await setDoc(ref, { ...device, addedAt: new Date() });
};

// Xoá thiết bị khỏi Page
export const removeDeviceFromPage = async (pageId, uid) => {
  const ref = doc(db, `things/${pageId}/devices/${uid}`);
  await deleteDoc(ref);
};
