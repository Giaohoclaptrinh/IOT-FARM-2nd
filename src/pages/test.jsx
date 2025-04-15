// import React, { useEffect, useState } from "react";
// import { auth, db } from "../firebase/db.config";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
// import DeviceChart from "../components/DeviceChart";
// import RoleManager from "../components/RoleManager";
// import DeviceList from "@/components/DeviceList";

app.use((req, res, next) => {
    console.log('API Key:', req.headers['authorization'] || req.query.key);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    next();
  });
//         <li key={device.uid} className="flex justify-between items-center mb-2">
//           <span>{device.name}</span>       
