
import { auth } from '@/firebase/db.config';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function HomeWrap({children}) {
    const [userCurrent, setUserCurrent] = useState({
           userName: "",
           email: ""
       });
   
       useEffect(() => {
           onAuthStateChanged(auth, async (user) => {
               if (user) {
                   setUserCurrent({
                       userName: user.displayName,
                       email: user.email,
                   });
                   console.log(userCurrent.email);
               } else {
                   console.log("User not logged in");
               }
           });
       }, []);
  return (
    <div className={
        `fixed ${userCurrent ?('min-w-top-bar max-w-top-bar  h-full'):('min-w-full max-w-full ')} h-full mt-[70px] overflow-scroll p-2 min-h-16 z-50 font-primary  border-b border-gray-300 top-0 right-0  bg-white`
      }>{children}</div>
  )
}

// import { auth } from '@/firebase/db.config';
// import { onAuthStateChanged } from 'firebase/auth';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function HomeWrap({ children }) {
//     const [userCurrent, setUserCurrent] = useState(null);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserCurrent({
//                     userName: user.displayName || "No Name",
//                     email: user.email,
//                 });
//             } else {
//                 setUserCurrent(null);
//             }
//         });

//         return () => unsubscribe(); // Cleanup để tránh memory leak
//     }, []);

//     return (
//         <div
//             className={`fixed ${userCurrent ? 'min-w-top-bar' : 'min-w-full'} 
//                 max-w-top-bar h-full mt-[70px] overflow-scroll p-2 min-h-16 
//                 z-50 font-primary border-b border-gray-300 top-0 right-0 bg-white`}//bị lỗi fixed ${userCurrent ? 'min-w-top-bar' : 'min-w-full'
//         >
//             {children}
//         </div>
//     );
// }
