import React, { useEffect, useState } from "react";
import HomeWrap from "./HomeWrap";
import OverLay from "@/components/Utilities/OverLay";
import SearchUser from "@/components/TopBar and Search/SearchUser";
import TemperatureHumidityChart from "@/components/Chart/DeviceChart";
import TemperatureHumidityInput from "@/components/Chart/TemperatureAndHumidityInput";
import ChartGrid from "@/components/Chart/ChartGrid";
import { useDeviceData } from "@/components/Database/useDataRealtime";
import {
    getDataDeviceByUid,
    getDeviceHuminity,
    getDeviceListByuser,
    getDevices,
    getNameDevice,
} from "@/components/Database/Services";
import { Key } from "lucide-react";
import { data } from "autoprefixer";

export const convertDataRawToHumidity = function (arrayData) {
    if (arrayData) {
        const getObject = JSON.parse(arrayData);
        const humidityItem = getObject.map((value) => {
            return {
                x: new Date(value.timestamp).getTime(),
                y: value.humidity,
            };
        });

        return humidityItem;
    }
    return null;
};

const ShowDevicePage = ({ deviceIdList = [] }) => {
    const [deviceList, setDeviceList] = useState({});
    useEffect(() => {
        const unsubscribes = [];

        const fetchData = async () => {
            try {
                deviceIdList.forEach(async (item) => {
                    const objectData = await getDeviceHuminity(item);
                    Object.entries(objectData).forEach(([keyframes, value]) => {
                        setDeviceList((prev) => {
                            return {
                                ...prev,
                                [keyframes]: value,
                            };
                        });
                    });
                });
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
            }
        };

        fetchData();

        // Cleanup để tránh memory leak
        return () => {
            unsubscribes.forEach((unsub) => unsub && unsub());
        };
    }, [deviceIdList]);
    useEffect(() => {
        console.log("device  List Change", deviceList);
    }, [deviceList]);

    return (
        <div className="pb-36">
            {/* <TemperatureHumidityChart deviceId={id} />
                <TemperatureHumidityInput deviceId={id} />
                <div className="mb-6 border border-gray-400 p-4 rounded shadow bg-white">
                    <ChartGrid divID={"grid-item"} humidity={humidityValues} />
                </div> */}

            <div>
                {deviceList && (
                    <div className="flex flex-col gap-y-12">
                        {Object.entries(deviceList).map(
                            ([keyframes, value]) => {
                                console.log(keyframes, value);
                                const humidityConvert =
                                    convertDataRawToHumidity(value.data);
                                console.log("da convert : ", humidityConvert);
                                return (
                                    <div className="p-4  shadow-lg bg-gray-200/40 rounded-md">
                                        <div className="text-end ">
                                            <div
                                                className="bg-blue-400 rounded-sm py-2 text-xl font-bold
                                                text-center
                                                my-2
                                                px-2
                                                ml-auto
                                                inline-flex 
                                                justify-center
                                                items-center
                                                w-44
                                                gap-x-4
                                                text-white"
                                            >
                                                <span>Device</span>
                                                <span>{value.NameDevice}</span>
                                            </div>
                                        </div>
                                        <ChartGrid
                                            divID={"chart" + keyframes}
                                            humidity={humidityConvert}
                                            typeChart="line"
                                        />
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowDevicePage;
