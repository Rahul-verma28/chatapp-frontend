import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { GET_ALL_MESSAGES_ROUTE, HOST } from '@/utils/constants';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (fileUrl) => {
    const response = await fetch(`${HOST}/${fileUrl}`, { method: 'GET' });
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileUrl.split('/').pop();
    link.click();
  };

  const renderDMMessages = (message) => {
    return (
      <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              } border inline-block p-2 px-3 rounded my-1 max-w-[60%] break-words`}>
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              } border inline-block p-2 px-3 rounded my-1 max-w-[60%] break-words`}>
            {checkIfImage(message.fileUrl) ?
              <div className=' relative'>
                <img src={`${HOST}/${message.fileUrl}`} alt="file" height={250} width={300} className="rounded" />
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className=" absolute bottom-0 right-0 p-3 text-2x1 rounded-full hover:bg-gray-900 cursor-pointer transition-all duration-300">
                  <IoMdArrowRoundDown />
                </span>
              </div>
              :
              <div className="flex items-center justify-center gap-2">
                <span className="text-white text-3xl bg-black/28 rounded-full">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className=" p-3 text-2x1 rounded-full hover:bg-gray-900 cursor-pointer transition-all duration-300">
                  <IoMdArrowRoundDown />
                </span>
              </div>
            }
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full'>
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
