import React, { useState } from 'react'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi2";
import "../index.css";
const SideMenu = (
    { setMenu,
        setUser,
        sideMenu,
        mails,
        setMails,
        loading,
        setLoading,
        setId,
        setOpen,
        handleClick1,
        isDarkMode }) => {
            const[selected,setSelected]=useState(null);
    const refresh = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://hiring.reachinbox.xyz/api/v1/onebox/list', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const d = await response.json();
            setMails(d.data);
            console.log(mails);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
   
    const handleClick = (a,e) => {
        handleClick1();
        setSelected(a);
        setUser(e);
        setId(a);
    }

    const truncateHtml = (html, maxLength) => {
        const text = new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
        const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        return `${truncatedText}`;
    };


    return (
        <>
            <div
                className={`inline ${sideMenu ? "custom-width px-3 py-6" : "w-[0rem] px-[0.5rem]"}
                h-full relative ${isDarkMode ? "bg-black border-r-[2px] border-[#343A40]" : "bg-[#FFFFFF] border-r-[2px] border-[#D8D8D8]"}
                flex flex-col items-center justify-start transition-all duration-200 ease-in-out`}
            >
                <div
                    onClick={() => setMenu(!sideMenu)}
                    className={`w-8 h-8 ${isDarkMode ? 'bg-black border-r-[2px] border-[#343A40]' : 'bg-white border-r-[2px] border-[#D8D8D8]'}  rounded-3xl absolute -right-3 z-[0] bottom-[50vh] flex items-center justify-center cursor-pointer`}
                >
                    {sideMenu ? (
                        <HiChevronDoubleLeft className={`${isDarkMode ? 'text-white' : 'text-black'} text-xl py-[0.2rem]`} />
                    ) : (
                        <HiChevronDoubleRight className={`${isDarkMode ? 'text-white' : 'text-black'} text-xl py-[0.2rem]`} />
                    )}
                </div>

                <div className={`overflow-hidden w-full h-full flex flex-col gap-4 px-[1rem] text-white ${sideMenu ? "" : "hidden"}`}>
                    <div className='h-full'>

                        <div className="flex justify-between items-center">
                            <div className='text-blue-500 text-[1.4rem] font-bold'>All Inbox(s)</div>
                            <span className={`cursor-pointer py-[0.4rem] px-[0.6rem] rounded-md
                            ${isDarkMode ? 'bg-[#1F1F1F] text-white c' : 'bg-[#f5f5f5] text-black  border-[#D8D8D8]'} 
                            `} onClick={() => refresh()}>
                                <i className="fa-solid fa-rotate-right text-[1rem]"></i>
                            </span>
                        </div>

                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>25/25 Inboxes selected</div>

                        <div className='text-center mt-[1rem]'>
                            <input
                                placeholder='Search'
                                className={`w-[99%] h-[2rem] rounded-sm p-[0.6rem] border ${isDarkMode ? 'bg-[#101113] border-[#343A40] text-white placeholder-white outline-none' : 'bg-[#f5f5f5] border-[#D8D8D8] text-black placeholder-black outline-none'}`}
                                style={{ outline: 'none' }}
                            />
                        </div>

                        <div className={`text-right mt-[0.7rem] pr-[0.3rem] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <select
                                className={` rounded-sm p-1 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black '}`}
                                defaultValue="newest"
                            >
                                <option value="oldest" className='pt-[0.4rem]'>Oldest</option>
                                <option value="newest" className='pt-[0.4rem]'>Newest</option>
                            </select>
                        </div>

                        {loading ? (<div className={` text-[1.5rem] text-center mt-[1.5rem] ${isDarkMode ? 'text-white' : 'text-black '}`}><i className="fa-solid fa-spinner fa-spin"></i></div>)
                            : (
                                <div className='h-full flex flex-col pt-[1rem]'>
                                    <div className='flex-1 overflow-y-auto '>
                                        {mails.map((email, index) => {
                                            const formattedDate = new Date(email.sentAt).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: 'short'
                                            });
                                            const hasBottomBorder = index === mails.length - 1;
                                            return (
                                            <div key={email.id} className={`border-t-[1px] p-2 cursor-pointer ${email.threadId===selected?" border-l-2 border-l-blue-500 ":""} ${isDarkMode ? 'border-t-[#343A40] border-b-[#343A40]' : ''} ${hasBottomBorder ? 'border-b-[1px]' : ''}`} onClick={() => handleClick(email.threadId,email)}>
                                            <div className={`py-[0.6rem]  `}>
                                            <p className={`flex justify-between items-center ${isDarkMode?'text-white':'text-black'}`}>
                                            <span>{truncateHtml(email.fromEmail, 15)}</span>
                                            <span className='text-sm text-[#515960]'>{formattedDate}</span>
                                            </p>

                                            <p className={`pt-[0.3rem] ${isDarkMode?'text-white':'text-black'}`}>
                                            <div dangerouslySetInnerHTML={{ __html: truncateHtml(email.body, 25) }} />
                                            </p>

                                            <div className='mb-[0.3rem] mt-[0.7rem]'>
                                            <div className='text-[13px] '>
                                            <span className={`pt-[2.5px] pb-[3px] px-[12px] text-center  ${isDarkMode?'bg-[#1F1F1F]':'bg-[#f3f3f3]'} rounded-xl font-bold text-green-500`}>
                                            <i class="fa-solid fa-circle pr-[0.4rem] text-[10px]"></i>
                                            Status</span>
                                            <span className={`pt-[2.5px] pb-[3px] px-[12px] text-center ml-[0.5rem] ${isDarkMode?'bg-[#1F1F1F]':'bg-[#f3f3f3] text-[#545454] '} rounded-xl font-bold`}>
                                            <i className="fa-solid fa-paper-plane pr-[0.4rem]"></i>  
                                            Campaign Name</span>
                                            </div>
                                            </div>

                                            </div>
                                            </div>
                                            );
                                        })}

                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>

    )
}

export default SideMenu;