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
    orderBy,
    startAt,
    endAt,
} from "firebase/firestore";
import { ref } from "firebase/database";
import { AddComment } from "@mui/icons-material";

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

export const getUser = async () => {
    return new Promise((resolve, reject) => {
        const unsubcribe = onAuthStateChanged(auth, async (user) => {
            if (user.uid) {
                const docRef = doc(db, `users/${user.uid}`);
                const userData = (await getDoc(docRef)).data();
                resolve(userData);
            }
        });
    });
};

export const getDevices = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const collectionRef = collection(db, "devices");
            const devices = await getDocs(collectionRef);
            const data = devices.docs.map((item) => {
                return { ...item.data(), idDevice: item.id };
            });
            resolve(data);
        } catch (error) {
            reject(error.message);
        }
    });
};

export const toggleDevice = async (idDevice) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(db, `devices/${idDevice}`);
        const data = (await getDoc(docRef)).data();
        if (data.status === "Online") {
            data.status = "Offline";
        } else {
            data.status = "Online";
        }
        const editDoc = await updateDoc(docRef, { ...data });
        resolve("Sucess", "has update cucess");
    });
};
export const searchUserByName = async (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userRef = collection(db, "/users/");
            const queryUser = query(
                userRef,
                orderBy("name"),
                startAt(name),
                endAt(name + "\uf8ff")
            );
            const data = (await getDocs(queryUser)).docs;
            const userList = data.map((user) => {
                return {
                    ...user.data(),
                };
            });
            const cleanValue = userList.filter((userObject) => {
                return userObject.role !== "admin";
            });
            resolve(cleanValue);
        } catch (error) {
            reject(["error", error.message]);
        }
    });
};

export const allowDeviceOfUser = async (userId, deviceId) => {
    return new Promise(async (resolve, reject) => {
        if (userId) {
            try {
                const createPath = doc(
                    db,
                    `users/${userId}/devicesList/${deviceId}`
                );
                const checkDoc = (await getDoc(createPath)).data();
                if (!checkDoc) {
                    await setDoc(createPath, {});
                    resolve(["success", "sucess add device  into user"]);
                } else {
                    reject(["error", "device  already  exists "]);
                }
            } catch (error) {
                console.log(error);
            }
        }
    });
};

export const allowDeviceofUsers = async (Users, deviceId) => {
    return new Promise(async (resolve, reject) => {
        Users.forEach(async (uid, index) => {
            await allowDeviceOfUser(uid, deviceId);
        });
        resolve(["sucess", ["add all  device  into user"]]);
    });
};

export const getDevicesId = async (deviceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, `devices/${deviceId}`);
            const device = await getDoc(docRef);
            resolve(device.data());
        } catch (error) {
            reject(error.message);
        }
    });
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
