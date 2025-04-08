import React, { useEffect, useState } from "react";
// import { fetchDevices } from "@/components/Database/Services";
import { setDoc, doc, getDocs, collection, } from "firebase/firestore";
import { auth, db } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import HomeWrap from "@/pages/HomeWrap";

const createPage = async (pageId) => {
  try {
    const docRef = doc(db, "things", pageId);
    await setDoc(docRef, { name: `Page ${pageId}`, createdAt: new Date() });
    console.log("Page created successfully!");
  } catch (error) {
    console.error("Error creating page:", error);
  }
};

const addDeviceToPage = async (pageId, device) => {
  try {
    const docRef = doc(db, `things/${pageId}/devices`, device.uid);
    await setDoc(docRef, { ...device, addedAt: new Date() });
    console.log(`Device ${device.uid} added successfully to ${pageId}`);
  } catch (error) {
    console.error("Error adding device:", error);
  }
};

const fetchLinkedDeviceUIDs = async (pageId) => {
  const snap = await getDocs(collection(db, `things/${pageId}/devices`));
  return snap.docs.map(doc => doc.id);
};

const DevicesPage = ({ pageId, onSelectDevice,addPage }) => {
  const [devices, setDevices] = useState([]);
  const  [pages,setPages] = useState([]);
  const   [isPage,setIsPage] =  useState(false)

  // useEffect(() => {
  //   const getDevices = async () => {
  //     const allDevices = await fetchDevices();
  //     const linkedUIDs = await fetchLinkedDeviceUIDs(pageId);
  //     const unlinkedDevices = allDevices.filter(d => !linkedUIDs.includes(d.uid));
  //     setDevices(unlinkedDevices);
  //   };
  //   getDevices();
  // }, [pageId]);

  const handleSelectDevice = async (deviceUid) => {
    const selectedDevice = devices.find(device => device.uid === deviceUid);
    if (selectedDevice) {
      await addDeviceToPage(pageId, selectedDevice);
      if (onSelectDevice) onSelectDevice(deviceUid);

      // Optionally cập nhật lại danh sách
      setDevices(prev => prev.filter(d => d.uid !== deviceUid));
    }
  };

  const handleCreatePage = async (pageName) => {
    if (!pageId) return;
    await addPage(pageName,auth.currentUser.uid)
    const updatedPages = await getPages(auth.currentUser.uid);
    setPages(updatedPages);
    setIsPage(false);
    
  };
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const allPage = await getPages(user.uid)
        setPages(allPage)   
      }
    })
  
    // Cleanup khi component unmount
    return () => unsubscribe()

  },[])
  const  getPages =  async(userId)=>{
    const path  = `users/${userId}/pages`
     const   CollectionRef =  collection(db,path)
     const  getCollection = await  getDocs(CollectionRef); 
     return getCollection.docs;
  }
  return (
    
      <HomeWrap>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Devices in: {pageId}</h2>
          <button
            onClick={()=>{
              setIsPage(!isPage)
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Tạo Page mới
          </button>
        </div>
       <div  className={` ${!isPage ? "hidden" :""}`}>
          <div className="absolute w-full h-full  inset-0 z-40 bg-black bg-opacity-10 "
           onClick={()=>{
            setIsPage(!isPage)
           }}/>
          <div overlay="" className="absolute  inset-0  
          flex items-start justify-center
          w-96
          h-40
          top-1/2
          left-1/2
          bg-white
          -translate-x-1/2
          -translate-y-2/3
          rounded-lg
          shadow-md
          z-50
          
            
          ">
            <form className="my-8 flex  flex-col items-center" onSubmit={async (e)=>{
              e.preventDefault();
             await handleCreatePage(e.target.children[0].value.trim())
             setIsPage(!isPage)

            }}>
    
              <input className="w-full 
              placeholder:text-gray-400
              
              rounded-md outline-none " placeholder="Name Page..." type="text" />
              <button type="submit" className=" mt-4 py-2 
               w-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg text-center text-white "
               onClick={()=>{
                
               }}>Create Page</button>
            </form>
          </div>
    
       </div>
        <div>
            <ul className="space-y-2">
              {pages.map((item,index)=>{
                console.log(item)
                return ( 
                <Link key={index} to="/hahah" className="block p-4 rounded shadow-sm bg-slate-100 
                hover:bg-slate-300  hover:text-white ">
                  {item.id}
                </Link>
                )
              })}
            </ul>
          
        </div>
      </HomeWrap>
    
  );
};

export default DevicesPage;
