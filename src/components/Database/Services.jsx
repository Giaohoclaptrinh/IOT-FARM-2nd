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
    onSnapshot,
} from "firebase/firestore";
import { ref } from "firebase/database";
import { AddComment } from "@mui/icons-material";
import { data } from "autoprefixer";

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
                    resolve({ type: "error", message: "Tên trang đã tồn tại" });
                } else {
                    await addDoc(CollectionRef, {
                        DeviceOfThing: [],
                        NamePage: namePage,
                    });
                    resolve({
                        type: "success",
                        message: "Tạo trang thành công",
                    });
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
            resolve({
                type: "success",
                message: `success turnOff  Device ${data.name} `,
            });
        } else {
            data.status = "Online";
            resolve({
                type: "success",
                message: `success turnOn  Device ${data.name} `,
            });
        }
        const editDoc = await updateDoc(docRef, { ...data });
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
    try {
        await Promise.all(Users.map((uid) => allowDeviceOfUser(uid, deviceId)));
        return {
            type: "success",
            message: "Allowed permission for all users with device",
        };
    } catch (errorAllow) {
        return {
            type: "error",
            message: "already  device axists  in user",
        };
    }
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
export const getDataDeviceByUid = (deviceId, deviceName, onData) => {
    let dataItem = null;
    if (!deviceId) {
        console.warn("Device ID không hợp lệ:", deviceId);
        return () => {};
    }

    const docRef = doc(
        db,
        `devices/${deviceId}/temperatureAndHumidityLogs`,
        deviceId
    );

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const rawData = JSON.parse(docSnap.data().data || "[]");

            dataItem = { NameDevice: deviceName, data: rawData };
            onData(dataItem);
        } else {
            onData?.(null);
        }
    });

    return unsubscribe;
};
// export const getNameDevice = async (deviceId = "3tCPsGhujHuJFsTctmjd") => {
//     let nameDevice = "";
//     const collectionRef = collection(db, "devices");
//     const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
//         const docs = snapshot.docs;
//         nameDevice = docs
//             .filter((item) => {
//                 return item.id === deviceId;
//             })[0]
//             .data().name;
//         // console.log(nameDevice);
//     });
//     return nameDevice;
// };
export const getNameDevice = async (deviceId = "") => {
    try {
        const docRef = doc(db, "devices", deviceId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
            return snap.data().name || "";
        } else {
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi lấy tên thiết bị:", error);
        return null;
    }
};
export const getDeviceHuminity = async (deviceId) => {
    console.log(deviceId);
    const docref = doc(
        db,
        `devices/${deviceId}/temperatureAndHumidityLogs/${deviceId}`
    );
    const getName = await getNameDevice(deviceId);
    const snapshot = await getDoc(docref);
    const newObject = { [deviceId]: { ...snapshot.data(), name: getName } };
    return newObject;
};
export const addDeviceIntoPage = async (pageUrl, idDevice, uid) => {
    if (pageUrl && idDevice) {
        const collectionRef = collection(db, `/users/${uid}/things`);
        const snapshot = (await getDocs(collectionRef)).docs;
        const itemPage = snapshot.filter((item) => {
            console.log(item.data());
            return item.data().NamePage === pageUrl;
        })[0];

        const dataItem = itemPage.data();
        const pageDocRef = doc(db, `/users/${uid}/things/${itemPage.id}`);
        const itemNew = {
            ...dataItem,
            DeviceOfThing: [...dataItem.DeviceOfThing, idDevice],
        };
        await updateDoc(pageDocRef, itemNew);
    } else {
        console.log("null roi");
    }
};
export const getDeviceofThingPage = async (pageUrl, uid) => {
    if (pageUrl && uid) {
        const collectionRef = collection(db, `/users/${uid}/things`);
        const snapshot = (await getDocs(collectionRef)).docs;
        const itemPage = await snapshot.filter((item) => {
            return item.data().NamePage === pageUrl;
        }).length;
        if (itemPage) {
            const itemRefesh = await snapshot
                .filter((item) => {
                    return item.data().NamePage === pageUrl;
                })[0]
                .data();
            return itemRefesh.DeviceOfThing;
        }
    } else {
        console.log("saidk");
    }
};
