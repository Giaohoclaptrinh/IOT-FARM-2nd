import React from "react";
import DevicesPage from "../components/Devices/DevicePage";
import HomeWrap from "./HomeWrap";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase/db.config";

const Things = () => {
  // Ví dụ: hiện một page cụ thể hoặc danh sách page
  const examplePageId = "example-page-id";
/**
 * addPage
 * @param {String} param - NameUser
 * @param {String} param - userID
 * @return {Promise} Promise
 */
  const   addPage = async (namePage,userId)=>{
    const path  =  `users/${userId}/pages`
    const   documentRef =   doc(db,path,namePage)
    const getSnapShot = await  setDoc(documentRef,{})
    console.log(getSnapShot)
  }

  return (
    <HomeWrap>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Things</h1>
      <DevicesPage addPage = {addPage} pageId={examplePageId} onSelectDevice={(uid) => console.log("Selected", uid)} />
    </div>
  
  </HomeWrap>
  );
};

export default Things;
    