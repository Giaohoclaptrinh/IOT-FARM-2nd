import React, { useState, useEffect } from "react";
import { db } from "../firebase/db.config";
import { collection, query, orderBy, startAt, endAt, getDocs } from "firebase/firestore";

const SearchResult = ({ searchTerm, onSelectDevice, className }) => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      const devicesRef = collection(db, "devices");
      const q = query(devicesRef, orderBy("name"), startAt(searchTerm), endAt(searchTerm + "\uf8ff"));
      const querySnapshot = await getDocs(q);
      setSearchResults(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchDevices();
  }, [searchTerm]);

  return (
    <div className={`absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-50 ${className}`}>
      {searchResults.map((device) => (
        <div
          key={device.id}
          className="p-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => onSelectDevice(device)}
        >
          <strong>{device.name}</strong>
          <p className="text-sm text-gray-500">{device.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
