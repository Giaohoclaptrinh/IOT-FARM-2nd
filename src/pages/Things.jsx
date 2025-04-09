import React, { useState } from "react";
import HomeWrap from "@/pages/HomeWrap";
import PageList from "@/components/Things/PageList";
import PageDetail from "@/components/Things/PageDetail";

const Things = () => {
  const [selectedPageId, setSelectedPageId] = useState(null);

  return (
    <HomeWrap>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Things</h1>
        {!selectedPageId ? (
          <PageList onSelectPage={setSelectedPageId} />
        ) : (
          <PageDetail pageId={selectedPageId} onBack={() => setSelectedPageId(null)} />
        )}
      </div>
    </HomeWrap>
  );
};

export default Things;
