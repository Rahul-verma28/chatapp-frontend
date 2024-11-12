import { useEffect, useRef, useState } from 'react';
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '@/context/socketContext';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { UPLOAD_FILES_ROUTE } from '@/utils/constants';

const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket(); // Corrected hook
    const { selectedChatData, selectedChatType, userInfo } = useAppStore();
    const [message, setMessage] = useState('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiRef]);

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    const handleSendMessage = async () => {
        try {
            if (selectedChatType === "contact" && socket) { // Check if socket is available
                socket.emit("sendMessage", {
                    sender: userInfo.id,
                    content: message,
                    recipient: selectedChatData._id,
                    messageType: "text",
                    fileUrl: undefined,
                });
                setMessage(''); // Clear input after sending
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async () => {
        try {
            const file = fileInputRef.current.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await apiClient.post(UPLOAD_FILES_ROUTE, formData, {
                    withCredentials: true
                });

                if (response.status == 200 && response.data) {
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                        });
                    }
                }

            }
            console.log(file.name);
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <div className='w-full flex justify-center items-center p-2 gap-2 mb-12 sm:mb-0'>
            <div className='flex-1 flex bg-gray-900 rounded-md items-center gap-5 pr-5'>
                <input type="text"
                    placeholder='Enter message here..'
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' />

                <button onClick={handleAttachmentClick} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <GrAttachment className="text-lg" />
                </button>
                <input className='hidden' type='file' ref={fileInputRef} onChange={handleAttachmentChange} />
                <div className="relative">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={() => setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className="text-lg" />
                    </button>
                    {emojiPickerOpen && (
                        <div className="absolute bottom-16 right-0" ref={emojiRef}>
                            <EmojiPicker
                                theme="dark"
                                onEmojiClick={handleAddEmoji}
                                autoFocusSearch={false}
                            />
                        </div>
                    )}
                </div>
            </div>
            <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
                onClick={handleSendMessage}>
                <IoSend className="text-lg" />
            </button>
        </div>
    );
};

export default MessageBar;
