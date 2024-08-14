import React, { useRef, useEffect } from 'react';
import Swal from "sweetalert2";
import { useState } from 'react';

const Thread = ({ thread, setOpenEditor, openEditor, setMails, setId, Id, mails, isDarkMode, userInfo }) => {

    const [latestMail, setLatestMail] = useState({});
    const [replyText, setReplyText] = useState("");
    const [replySubject, setSubject] = useState("");
    const [replyReferences, setReferences] = useState([]);
    const [sending, setSending] = useState(false);
    const [shiftRPressed, setShiftRPressed] = useState(false);

    const textAreaRef = useRef(null);

    const handleReplyClick = () => {
        setOpenEditor(true);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.shiftKey && event.key === 'R') {
                if(openEditor===false) setOpenEditor(true);
                setShiftRPressed(true);
            }
        };

        const handleKeyUp = (event) => {
            if (event.shiftKey && event.key === 'R') {
                if(openEditor===false) setOpenEditor(true);
                setShiftRPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.shiftKey && event.key === 'D') {
                handleDelete();
                setShiftRPressed(true);
            }
        };

        const handleKeyUp = (event) => {
            if (event.shiftKey && event.key === 'D') {
                handleDelete();
                setShiftRPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    
    useEffect(() => {
        if (openEditor) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openEditor]);

    useEffect(() => {
        const prepareReply = () => {
            const foundMail = mails.find(mail => mail.threadId === Id);
            const messageIds = new Set();
            mails.forEach(email => {
                messageIds.add(email.messageId);
            });
            const uniqueMessageIds = Array.from(messageIds);
            setReferences(uniqueMessageIds);
            setLatestMail(foundMail);
        }
        prepareReply();
    }, []);

    const sendReply = async () => {
        setSending(true);
        const replyData = {
            toName: latestMail.fromName,
            to: latestMail.fromEmail,
            from: latestMail.toEmail,
            fromName: latestMail.toName,
            subject: replySubject,
            body: replyText,
            references: replyReferences,
            inReplyTo: latestMail.messageId
        };

        const url = `https://hiring.reachinbox.xyz/api/v1/onebox/reply/${Id}`;
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(replyData)
            });

            if (!response.ok) {
                throw new Error(response.status);
            }
            const responseData = await response.json();

            Swal.fire({
                title: 'Sent',
                text: "Reply sent successfully",
                icon: 'success',
                background: isDarkMode ? "#1F1F1F" : "#FFFFFF",
                color: isDarkMode ? "#FFFFFF" : "#000000",
                confirmButtonColor: "#3085d6"
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message + " internal server error",
                icon: 'error',
                background: isDarkMode ? "#1F1F1F" : "#FFFFFF",
                color: isDarkMode ? "#FFFFFF" : "#000000",
                confirmButtonColor: "#3085d6"
            });
        }
        finally {
            setSending(false);
        }
    };


    const handleDelete = () => {

        Swal.fire({
            title: "Are you sure?",
            text: "Your selected email will be deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
            background: isDarkMode ? "#1F1F1F" : "#FFFFFF",
            color: isDarkMode ? "#FFFFFF" : "#000000",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    await fetch(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${Id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    setMails(prevMails => prevMails.filter(mail => mail.threadId !== Id));
                    setId(null);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your email thread has been deleted.',
                        icon: 'success',
                        background: isDarkMode ? "#1F1F1F" : "#FFFFFF",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                        confirmButtonColor: "#3085d6"
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was an error deleting the email thread.',
                        icon: 'error',
                        background: isDarkMode ? "#1F1F1F" : "#FFFFFF",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                        confirmButtonColor: isDarkMode ? "#d33" : "#d33",
                    });

                }
            }
        });
    };


    const handleClickOutside = (event) => {
        if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
            setOpenEditor(false);
        }
    };

  

    return (
        <>
            <div className='flex flex-row w-full h-full overflow-hidden'>

                <div className='w-[70%] h-full transition-all duration-200 ease-in-out'>

                    <div className={`h-[5rem] flex items-center ${isDarkMode ? "bg-black border-b-[2px] border-[#343A40]" : "bg-[#FFFFFF] border-b-[2px] border-[#D8D8D8]"}`}>
                        <div className='ml-[2rem]'>
                            <div className={`text-[1.5rem] ${isDarkMode ? "text-white" : "text-black"}`}>User</div>
                            <div className='text-[12px] text-[#515960] font-bold'>{userInfo.fromEmail}</div>
                        </div>
                    </div>

                    <div className={`w-full h-[calc(100%-4rem)] flex flex-row overflow-hidden px-[2rem] ${isDarkMode ? "bg-black" : "bg-white"}`}>
                        <div className='w-full pt-[2rem] h-full overflow-y-auto relative'>
                            {thread.map((email) => (
                                <div className={`border-t ${isDarkMode ? "border-[#343A40]" : "border-[#D8D8D8]"}`}>
                                    <div key={email.id} className={`border ${isDarkMode ? "border-[#343A40]" : "border-[#D8D8D8]"} rounded-md my-[1.5rem] p-[1rem] ${isDarkMode ? "bg-[#141517]" : "bg-white"}`}>
                                        <p className='text-white flex justify-between'>
                                            <span className={`text-[1.2rem] ${isDarkMode ? "text-white" : "text-black"}`}>{email.subject}</span>
                                            <span className={`text-sm text-[#515960] text-center`}>{new Date(email.sentAt).toLocaleString()}</span>
                                        </p>

                                        <div className='mt-[0.6rem]'>
                                            <p className='text-[#515960] break-words'><span>From:  </span>{email.fromEmail}</p>
                                            <p className='text-[#515960] break-words'><span>To:  </span>{email.toEmail}</p>
                                        </div>

                                        <p className={`mt-[1rem] text-[0.9rem] ${isDarkMode ? "text-white" : "text-black"}`}>
                                            <div dangerouslySetInnerHTML={{ __html: email.body }} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {openEditor && (
                            <>
                              
                                <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                                <div className="fixed inset-0 flex items-center justify-center z-50">
                                    <div ref={textAreaRef} className={`border ${isDarkMode ? "bg-[#141517] border-[#343A40]" : "bg-white border-[#D8D8D8]"}  rounded-lg shadow-xl w-[60vw] h-[33rem] relative z-50`}>
                                    <div className={`rounded-tl-md rounded-tr-md flex justify-between py-[0.4rem] border-b ${isDarkMode ? "text-white bg-[#1F1F1F] border-[#343A40]" : "text-black bg-[#f5f5f5]  border-[#D8D8D8]"}`}>
                                        <span className="mx-[2rem]">Reply</span>
                                        <span className="cursor-pointer mx-[1rem]" onClick={() => setOpenEditor(false)}>
                                        <i className="fa-solid fa-xmark"></i>
                                        </span>
                                    </div>

                                        <div>
                                            <div className={`${isDarkMode ? "border-[#343A40]" : "border-[#D8D8D8]"} text-[#515960] text-sm border-b px-[2rem] py-[0.4rem]`}>
                                                <span>To:</span>
                                                <span className={`${isDarkMode ? "text-white" : "text-black"}`}> {latestMail.fromEmail}</span>
                                            </div>
                                            <div className={`${isDarkMode ? "border-[#343A40]" : "border-[#D8D8D8]"} text-[#515960] text-sm border-b px-[2rem] py-[0.4rem]`}>
                                                <span>From:</span>
                                                <span className={`${isDarkMode ? "text-white" : "text-black"}`}> {latestMail.toEmail}</span>
                                            </div>
                                            <div className={`flex flex-row h-[3.3rem] mb-[1rem] border-b ${isDarkMode ? "border-[#343A40]" : "border-[#D8D8D8]"}`}>
                                                <span className="my-auto text-[#515960] text-sm pl-[2rem] pr-[1rem] py-[0.4rem]">Subject:</span>
                                                <textarea
                                                    rows="1"
                                                    cols="30"
                                                    className={`my-auto w-[50rem] p-2 border resize-none overflow-y-auto outline-none border-none ${isDarkMode ? "text-white bg-[#141517]" : "text-black bg-white"}`}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    value={replySubject}
                                                />
                                            </div>

                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                rows="12"
                                                cols="40"
                                                placeholder="Type your reply here..."
                                                className={`w-full px-[2rem] border-none outline-none rounded-lg resize-none overflow-y-auto ${isDarkMode ? "text-white bg-[#141517]" : "text-black bg-white"}`}
                                            />
                                        </div>

                                        <div className={`border-t pt-[0.8rem] pb-[0.8rem] px-[2.5rem] ${isDarkMode ? "border-[#343A40]" : "border-[#D8D8D8]"}`}>
                                            <span
                                                className={`cursor-pointer py-[0.4rem] px-[2rem] mr-[1rem] rounded-sm bg-blue-600 text-white text-center ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => !sending && sendReply()}
                                                disabled={sending}
                                            >
                                                {sending ? (
                                                    <i className="fa-solid fa-spinner fa-spin text-[1rem]"></i>
                                                ) : (
                                                    <>Send</>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                    <div className="flex gap-4 sticky bottom-[2rem]  ">
                        <span className='ml-[3rem]'>
                            <button onClick={handleReplyClick} className='shadow-xl border border-blue-600 bg-blue-600 text-white px-[1.4rem] py-[0.4rem] rounded-sm ' >
                                <i class="fa-solid fa-reply pr-[0.5rem]"></i>
                                Reply
                            </button>
                            <button onClick={handleDelete} className='shadow-xl bg-red-500 ml-[2rem] rounded-3xl'><i class={`fa-solid fa-trash p-[0.8rem] rounded text-white`}></i></button>
                        </span>
                    </div>
                </div>

                <div className={`w-[30%] h-full overflow-y-auto ${isDarkMode ? " border-l border-[#343A40] bg-black" : " border-l border-[#D8D8D8] bg-[#FFFFFF]"}`}>
                    <div className='my-[1.5rem]'>
                        <div className={`mx-auto rounded-lg px-[1rem] py-[0.4rem] w-[95%] ${isDarkMode ? "bg-[#101113] text-white" : "bg-[#f5f5f5]"}`}>
                            Lead Details
                        </div>

                        {/* Name */}
                        <div className='w-[95%] mx-auto mt-[1rem] flex flex-wrap justify-between'>
                            <span className={`w-full sm:w-auto mx-[1rem] text-center py-auto text-[0.9rem] ${isDarkMode ? "text-white" : "text-[#515960]"}`}>Name</span>
                            <span className={`w-full sm:w-auto text-center py-[0.4rem] text-[0.9rem] break-words ${isDarkMode ? "text-[#515960]" : "text-black"}`}>Name Text Here</span>
                        </div>

                        {/* Contact No */}
                        <div className='w-[95%] mx-auto mt-[1rem] flex flex-wrap justify-between'>
                            <span className={`w-full sm:w-auto mx-[1rem] text-center py-auto text-[0.9rem] ${isDarkMode ? "text-white" : "text-[#515960]"}`}>Contact No</span>
                            <span className={`w-full sm:w-auto text-center py-[0.4rem] text-[0.9rem] break-words ${isDarkMode ? "text-[#515960]" : "text-black"}`}>Contact Number Here</span>
                        </div>

                        {/* Email ID */}
                        <div className='w-[95%] mx-auto mt-[1rem] flex flex-wrap justify-between'>
                            <span className={`w-full sm:w-auto mx-[1rem] text-center py-auto text-[0.9rem] ${isDarkMode ? "text-white" : "text-[#515960]"}`}>Email ID</span>
                            <span className={`w-full sm:w-auto text-center py-[0.4rem] text-[0.9rem] break-words ${isDarkMode ? "text-[#515960]" : "text-black"}`}>{userInfo.fromEmail}</span>
                        </div>

                        {/* LinkedIn */}
                        <div className='w-[95%] mx-auto mt-[1rem] flex flex-wrap justify-between'>
                            <span className={`w-full sm:w-auto mx-[1rem] text-center py-auto text-[0.9rem] ${isDarkMode ? "text-white" : "text-[#515960]"}`}>LinkedIn</span>
                            <span className={`w-full sm:w-auto text-center py-[0.4rem] text-[0.9rem] break-words ${isDarkMode ? "text-[#515960]" : "text-black"}`}>LinkedIn Profile Here</span>
                        </div>

                        {/* Company Name */}
                        <div className='w-[95%] mx-auto mt-[1rem] flex flex-wrap justify-between'>
                            <span className={`w-full sm:w-auto mx-[1rem] text-center py-auto text-[0.9rem] ${isDarkMode ? "text-white" : "text-[#515960]"}`}>Company Name</span>
                            <span className={`w-full sm:w-auto text-center py-[0.4rem] text-[0.9rem] break-words ${isDarkMode ? "text-[#515960]" : "text-black"}`}>Company Name Here</span>
                        </div>
                    </div>


                    <div>
                        <div className={` mx-auto rounded-lg px-[1rem] py-[0.4rem] w-[95%] ${isDarkMode ? "  bg-[#101113] text-white" : "  bg-[#f5f5f5] "}`}>Activities</div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                </div>
            </div>

        </>

    );
};

export default Thread;
