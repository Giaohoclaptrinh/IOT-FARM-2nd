import React, { useEffect, useState } from "react";
import HomeWrap from "@/pages/HomeWrap";
import PageList from "@/components/Things/PageList";
import PageDetail from "@/components/Things/PageDetail";
import { HiOutlineXMark } from "react-icons/hi2";
import {
    CreatePage,
    deletePageid,
    getPageList,
} from "@/components/Database/Services";
import { addPage } from "@/utils/FireStoreUtils";
import OverLay from "@/components/Utilities/OverLay";
import { Link, useParams } from "react-router-dom";

const Things = () => {
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [pageName, setPageName] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [pageList, setPageList] = useState([]);
    const url = useParams();
    console.log("params", url.id);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const addPage = async () => {
            const message = await CreatePage(pageName);
            const page = await getPageList();
            setPageList(page);
        };

        addPage();
    };
    useEffect(() => {
        const pageList = async () => {
            const page = await getPageList();
            setPageList(page);
        };
        pageList();
    }, []);
    return !url.id ? (
        <HomeWrap>
            <div>
                <button
                    onClick={() => {
                        setShowOverlay(!showOverlay);
                    }}
                    className="btn-primary"
                >
                    Create Page
                </button>
            </div>
            <div className="flex flex-col justify-center mt-4 gap-y-2">
                {pageList.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="flex-center justify-between py-2   bg-gray-100 px-2 rounded-md border
                                 border-gray-300/70 hover:bg-gray-200"
                        >
                            <Link
                                key={index}
                                className="w-full text-md"
                                to={{
                                    pathname: `/things/${item.NamePage}-${index}`,
                                }}
                            >
                                {item.NamePage}
                            </Link>
                            <span className="flex-center">
                                <button
                                    onClick={async (e) => {
                                        await deletePageid(item.idpage);
                                        const page = await getPageList();
                                        setPageList(page);
                                    }}
                                    className=" rounded-xs bg-sky-500"
                                >
                                    <HiOutlineXMark className="text-2xl font-semibold  text-white " />
                                </button>
                            </span>
                        </div>
                    );
                })}
            </div>

            {showOverlay && (
                <OverLay
                    onClose={() => {
                        setShowOverlay(!showOverlay);
                    }}
                >
                    <div className="w-96 h-44 p-4">
                        <form
                            action=""
                            onSubmit={handleSubmit}
                            className="size-full "
                        >
                            <div
                                className="w-full border rounded-md 
                    border-gray-300 h-16 flex items-center bg-white
                    focus-within:border-blue-400 p-2"
                            >
                                <input
                                    placeholder="Nhập tên trang . . ."
                                    className="size-full  caret-gray-500 "
                                    type="text"
                                    value={pageName}
                                    onChange={(e) => {
                                        setPageName(e.target.value);
                                    }}
                                />
                            </div>
                            <div
                                className="w-full h-12 bg-gradient-to-r
                            bg-linear-to-r from-cyan-500 to-blue-500
                            rounded-lg 
                             mt-4 items-center flex-center text-xl text-white  font-semibold"
                            >
                                <button className="size-full" type="submit">
                                    submit
                                </button>
                            </div>
                        </form>
                    </div>
                </OverLay>
            )}
        </HomeWrap>
    ) : (
        <HomeWrap>
            
        </HomeWrap>
    );
};

export default Things;
