import { useParams } from "react-router-dom";
import { useState } from "react";
import { startFakeDataGeneration } from "../components/Database/Services";
import { useDeviceData } from "../components/Database/useDataRealtime";
import React from "react";
import HomeWrap from "./HomeWrap";
import ChartDynamic from "../components/Chart/ChartDynamic";
import ChartGrid from "../components/Chart/ChartGrid";
import ChartRadialBar from "../components/Chart/ChartRadialBar";
// import DeviceChart from "../components/Chart/DeviceChart";

const ControlsDevice = () => {
    const { deviceUid } = useParams();
    const data = useDeviceData(deviceUid);
    const [stopGenerating, setStopGenerating] = useState(null);

    // Lấy dữ liệu mới nhất
    const latest = data[data.length - 1] || {};

    // Dữ liệu cho biểu đồ động (đúng format datetime)
    const humidity = data.map((d) => ({
        x: new Date(d.timestamp).getTime(), // timestamp dạng number
        y: d.humidity,
    }));

    // Dữ liệu cho biểu đồ lưới
    const humidityValues = data.map((d) => ({
        x: new Date(d.timestamp).getTime(), // timestamp dạng number
        y: d.humidity,
    }));

    const handleFakeData = () => {
        if (stopGenerating) {
            stopGenerating(); // Dừng
            setStopGenerating(null);
        } else {
            const stop = startFakeDataGeneration(deviceUid); // Bắt đầu
            setStopGenerating(() => stop);
        }
    };

    const renderFakeButton = () => (
        <button
            onClick={handleFakeData}
            className={`px-3 ml-auto py-1 rounded text-white font-medium transition 
        ${
            stopGenerating
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
        }`}
        >
            {stopGenerating ? "Dừng tạo dữ liệu giả" : "Tạo dữ liệu giả"}
        </button>
    );

    return (
        <HomeWrap>
            <div className=" w-full grid grid-cols-[3fr_7fr] gap-x-4">
                {/* Radial Bar Chart */}
                <div className="mb-6 border border-gray-400 p-4 rounded shadow bg-white">
                    <ChartRadialBar
                        temperature={latest.temperature}
                        divID="radial1"
                    />
                </div>

                {/* Grid Chart */}
                <div className="mb-6 border border-gray-400 p-4 rounded shadow bg-white">
                    <ChartGrid divID={"grid-item"} humidity={humidityValues} />
                </div>
            </div>
            <div className="pb-32">
                {/* Dynamic Chart */}
                <div className="mb-6 border border-gray-400 p-4 rounded shadow bg-white">
                    <div className="flex items-center justify-between mb-2">
                        {renderFakeButton()}
                    </div>
                    <ChartDynamic humidity={humidity} divID="dynamic1" />
                </div>
            </div>
        </HomeWrap>
    );
};

export default ControlsDevice;
