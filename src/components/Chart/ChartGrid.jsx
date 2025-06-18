import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

export default function ChartGrid({
    divID,
    typeChart = "line",
    humidity = [],
    temperature = [],
    ph = [],
}) {
    const chartRef = useRef(null);
    const containerID = `chart-${divID ?? "default"}`;

    const formatData = () => {
        const combined = humidity.map((item, i) => ({
            timestamp: item.x,
            humidity: item.y,
            temperature: temperature[i]?.y ?? null,
            ph: ph[i]?.y ?? null,
        }));
        return combined;
    };

    const getSeries = (data) => [
        {
            name: "pH",
            data: data.map((d) => [d.timestamp, d.ph]),
        },
        {
            name: "DO",
            data: data.map((d) => [d.timestamp, d.humidity]),
        },
        {
            name: "Temp",
            data: data.map((d) => [d.timestamp, d.temperature]),
        },
    ];

    const renderChart = (data) => {
        const options = {
            chart: {
                type: typeChart,
                height: 350,
                zoom: { autoScaleYaxis: true },
            },
            series: getSeries(data),
            dataLabels: { enabled: false },
            stroke: { curve: "smooth", width: 2 },
            xaxis: {
                type: "datetime",
                labels: {
                    formatter: (val) =>
                        new Date(val).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        }),
                },
            },
            tooltip: {
                x: {
                    formatter: (val) =>
                        new Date(val).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        }),
                },
            },
        };

        const chart = new ApexCharts(document.getElementById(containerID), options);
        chart.render();
        chartRef.current = chart;
    };

    useEffect(() => {
        const data = formatData();
        renderChart(data);

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [humidity, temperature, ph]);

    return (
        <div>
            <div className="w-full h-80" id={containerID}></div>
        </div>
    );
}
