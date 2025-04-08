import HomeWrap from '@/pages/HomeWrap';
import React, { useState } from 'react'
import { addPage } from '../Database/Services';
import { auth } from '@/firebase/db.config';

 function TestAddPage() {
    const [idDevice,setIdDevice] = useState({idDevice:""})
   const  handleSubmit = async (e)=>{
    e.preventDefault();
    console.log("addPage",auth.currentUser.uid)
          const run =  await addPage(auth.currentUser.uid,idDevice.idDevice)
    }
    
  return (
   <HomeWrap> <div>submit ID pages</div>
   <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="">id Devices</label>
            <input
            value={idDevice.idDevice}
            name='idDevice'
            onChange={
                (e)=>{
                    setIdDevice((prev)=>(
                        {
                            ...prev,
                            idDevice:e.target.value

                        }
                    ))

                }
            } type="text" />
            <button type="submit">submit</button>
        </form>
    </div></HomeWrap>
  )
}

export default TestAddPage;
