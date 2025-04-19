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
    getDeviceListByuser,
} from "@/components/Database/Services";
import { Key } from "lucide-react";
import ShowDevicePage from "./ShowDevicePage";

export const convertDataRawToHumidity = function (arrayData) {
    const humidityItem = arrayData.map((value) => {
        return {
            x: new Date(value.timestamp).getTime(),
            y: value.humidity,
        };
    });

    return humidityItem;
};

const HomePage = () => {
    const UserId = "62WjDlu3uWTKnhjIRIYKCm9epX92";
    return <ShowDevicePage />;
};

export default HomePage;
