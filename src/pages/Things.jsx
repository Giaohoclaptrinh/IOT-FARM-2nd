import React from "react";
import DevicesPage from "../components/Devices/DevicePage";
import HomeWrap from "./HomeWrap";

const Things = () => {
  // Ví dụ: hiện một page cụ thể hoặc danh sách page
  const examplePageId = "example-page-id";

  return (
    <HomeWrap>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Things</h1>
      <DevicesPage pageId={examplePageId} onSelectDevice={(uid) => console.log("Selected", uid)} />
    </div>
  
  </HomeWrap>
  );
};

export default Things;
    