// src/services/deviceService.js
import { db, auth } from "@/firebase/db.config";
import Things from "@/pages/Things";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

/**
 * Lấy danh sách thiết bị (có phân quyền cho admin).
 * @returns {Promise<Array>} Danh sách thiết bị
 */
// export const fetchDevices = async () => {
//   const user = auth.currentUser;
//   const devicesRef = collection(db, "devices");

//   const q = user.email === "1@gmail.com"
//     ? query(devicesRef)
//     : query(devicesRef, where("userUID", "==", user.uid));

//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({
//     uid: doc.id,
//     ...doc.data()
//   }));
// };

/**
 * Lấy dữ liệu nhiệt độ và độ ẩm từ Firestore.
 * @param {string} deviceId ID của thiết bị
 * @returns {humidity, temperature} Dữ liệu đã xử lý
 */
export const fetchTemperatureHumidityData = async (deviceId) => {
    if (!deviceId) return null;

    try {
        const docRef = doc(
            db,
            `devices/${deviceId}/temperatureAndHumidityLogs`,
            deviceId
        );
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

/**
 * Gửi dữ liệu nhiệt độ và độ ẩm lên Firestore.
 * @param {string} deviceId ID của thiết bị
 * @param {number} temperature Giá trị nhiệt độ
 * @param {number} humidity Giá trị độ ẩm
 */
export const sendTemperatureHumidityData = async (
    deviceId,
    temperature,
    humidity
) => {
    if (!deviceId) return;

    try {
        const timestamp = new Date().toISOString();
        const newEntry = { timestamp, temperature, humidity };

        const docRef = doc(
            db,
            `devices/${deviceId}/temperatureAndHumidityLogs`,
            deviceId
        );
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

        updatedData.push(newEntry);
        await setDoc(docRef, { data: JSON.stringify(updatedData) });

        console.log("Dữ liệu đã cập nhật:", updatedData);
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
    }
};

/**
 * Tạo page mới cho user.
 * @param {string} userID ID của người dùng
 * @param {string} deviceID ID thiết bị
 */
export const addPage = async (userID, deviceID) => {
    try {
        const pagesRef = collection(db, `users/${userID}/pages`);
        const docRef = await addDoc(pagesRef, { allDevice: [] });
        console.log(docRef);
    } catch (error) {
        console.error("Error adding page or updating allDevice:", error);
    }
};

/**
 * Lấy toàn bộ thiết bị (dành cho admin).
 * @returns {Promise<Array>} Mảng thiết bị
 */
export const getCollectionDevice = async () => {
    const collectionRef = collection(db, "devices");
    const getData = await getDocs(collectionRef);
    return getData.docs;
};

/**
 * Bắt đầu phát sinh dữ liệu giả tự động mỗi 2s.
 * @param {string} deviceId ID của thiết bị
 * @returns {Function} Hàm để dừng phát sinh dữ liệu
 */
export const startFakeDataGeneration = (deviceId) => {
    if (!deviceId) return;

    const intervalId = setInterval(() => {
        const fakeTemperature = Math.floor(Math.random() * 120) + 1;
        const fakeHumidity = Math.floor(Math.random() * 100) + 1;
        sendTemperatureHumidityData(deviceId, fakeTemperature, fakeHumidity);
    }, 5000);

    console.log("Bắt đầu tạo dữ liệu giả...");
    return () => {
        clearInterval(intervalId);
        console.log("Đã dừng tạo dữ liệu giả.");
    };
};

export const CreatePage = (namePage) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const CollectionRef = collection(
                    db,
                    `users/${user.uid}/things`
                );

                const getPageName = query(
                    CollectionRef,
                    where("NamePage", "==", namePage)
                );

                const check = (await getDocs(getPageName)).docs;

                if (check.length !== 0) {
                    resolve(["error", "Tên trang đã tồn tại"]);
                } else {
                    await addDoc(CollectionRef, {
                        ThingList: [],
                        NamePage: namePage,
                    });
                    resolve(["success", "Tạo trang thành công"]);
                }

                unsubscribe(); // dọn dẹp listener
            } else {
                reject(["error", "Người dùng chưa đăng nhập"]);
            }
        });
    });
};
export const getPageList = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user.uid) {
                const collectionRef = collection(
                    db,
                    `users/${user.uid}/things`
                );
                const docs = (await getDocs(collectionRef)).docs;

                const assignValue = docs.map((item, index) => {
                    return { ...item.data(), idpage: item.id };
                });
                resolve(assignValue);
            }
            return unsubscribe();
        });
    });
};
export const deletePageid = (idPage) => {
    return new Promise((resolve, reject) => {
        if (
            onAuthStateChanged(auth, async (user) => {
                if (user.uid) {
                    const collectionRef = collection(
                        db,
                        `users/${user.uid}/things`
                    );
                    const removeDoc = await deleteDoc(
                        doc(db, `users/${user.uid}/things`, idPage)
                    );
                    resolve(["seccus", "alredy  has  delete"]);
                }
            })
        );
    });
};
