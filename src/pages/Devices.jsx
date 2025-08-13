
import React, { useEffect, useState } from "react";
import HomeWrap from "./HomeWrap";
import { instance } from "@/components/API/devices";
import { Link, useParams } from "react-router-dom";
import ViewDevice from "./ViewDevice";


const Devices = () => {
    const {id} = useParams();
   
    const [data,setData] = useState([])
    useEffect(()=>{
        instance.get('/device').then((value) => {
            console.log(id);
            setData(value.data)
        });
    },[])

    return (
      <HomeWrap>
        {
           id ?(
            <ViewDevice id={id}/>
           )
           :
        (<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Device name
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((el, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {el}
                    </th>

                    <td className="px-6 py-4 flex gap-x-2">
                      <Link
                        to={`/devices/${el}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        to={`/devices/stream/${el}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Stream
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>)
        }
      </HomeWrap>
    );
};

export default Devices;
