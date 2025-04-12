import React, { useContext, useEffect, useState } from "react";
import {
  getDevicesNotInPage,
  getDevicesInPage,
  addDeviceToPage,
  removeDeviceFromPage,
} from "@/utils/FireStoreUtils";
import { auth } from "@/firebase/db.config";
import { context, devicesObject } from "@/utils/Provide";

const PageDetail = ({ pageId, onBack }) => {
  const [linkedDevices, setLinkedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const  {state, dispatch } = useContext(context)
  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const [inPage, notInPage] = await Promise.all([
      getDevicesInPage(pageId),
      getDevicesNotInPage(pageId),
    ]);
    setLinkedDevices(inPage);
    setAvailableDevices(notInPage);
  };
 
  useEffect(()=>{
    if(availableDevices.length > 0 )
    {

      dispatch(devicesObject(linkedDevices))
      
    }
  },[availableDevices])

  useEffect(() => {
    fetchData();
  }, [pageId]);

  const handleAdd = async (device) => {
    await addDeviceToPage(pageId, device);
    setShowAddModal(false);
    fetchData();
  };

  const handleRemove = async (uid) => {
    await removeDeviceFromPage(pageId, uid);
    fetchData();
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-2">
      <button
        onClick={() => setShowAddModal(true)}
        className="inline-block px-6 py-2   bg-blue-500 rounded-md  text-white x"
      >
        Thêm thiết bị
      </button>
        <button
          onClick={onBack}
          className="inline-block px-6 py-2   bg-blue-500 rounded-md  text-white x"
        >
          {" "}
          Quay lại
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-2">
        Thiết bị trong Page{" "}
        <span className="text-blue-600">{pageId}</span>
      </h2>

      <ul className="mb-4">
        {linkedDevices.map((device) => (
          <li
            key={device.uid}
            className="flex justify-between bg-slate-100 p-2 rounded mb-2"
          >
            <span>{device.name}</span>
            <button
              onClick={() => handleRemove(device.uid)}
              className="text-red-500"
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>

     

      {/* Modal */}
      {showAddModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Chọn thiết bị để thêm
            </h3>
            <ul>
              {availableDevices.length === 0 && (
                <p className="text-gray-500 italic">
                  Không còn thiết bị nào để thêm.
                </p>
              )}
              {availableDevices.map((device) => (
                <li
                  key={device.uid}
                  className="flex justify-between items-center bg-green-50 p-2 rounded mb-2"
                >
                  <span>{device.name}</span>
                  <button
                    onClick={() => handleAdd(device)}
                    className="text-green-600"
                  >
                    Thêm
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 hover:text-black"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageDetail;
