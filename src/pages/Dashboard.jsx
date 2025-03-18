import React from "react";
import DeviceOverview from "../components/DeviceOverview";
import SystemStatus from "../components/SystemStatus";
import ChartSection from "../components/ChartSection";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>
      
      {/* Thống kê nhanh */}
      <DeviceOverview />

      {/* Trạng thái hệ thống */}
      <SystemStatus />

      {/* Biểu đồ giám sát */}
      <ChartSection />
    </div>
  );
};

export default Dashboard;
