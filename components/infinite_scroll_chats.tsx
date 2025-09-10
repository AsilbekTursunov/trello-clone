// Chatwindow

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import styles from '../style/chat.module.scss';
// import { Input, Button, Avatar, Empty } from 'antd';
// import { ArrowDownOutlined, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
// import ChatMessage from './ChatMessage';
// import dayjs from 'dayjs';
// import { useRouter } from 'next/router';
// import useChat from '../api/useChat';
// import InfiniteScroll from "react-infinite-scroll-component";
// import { useSelector } from 'react-redux';
// import { ClipLoader } from 'react-spinners';
// import axiosInstance from '../../api/freeleanceApi';

// const ChatWindow = ({ chatId, goBack }) => {
//     const [newMessage, setNewMessage] = useState('');
//     const [edit, setEdit] = useState(null);
//     const [openDownIcon, setOpenDownIcon] = useState(false);
//     const { user } = useSelector(state => state.auth);
//     const messagesContainerRef = useRef(null);
//     const router = useRouter();

//     const { messages, chat, sendMessage, updateMessage, fetchNextPage, hasNextPage } = useChat(chatId);


//     const scrollToBottom = useCallback(() => {
//         if (messagesContainerRef.current) {
//             messagesContainerRef.current.scrollTop =
//                 messagesContainerRef.current.scrollHeight;
//         }
//     }, []);

//     const handlScroll = () => {

//         if (messagesContainerRef.current.scrollTop < -500) {
//             setOpenDownIcon(true);
//         } else {
//             setOpenDownIcon(false);
//         }
//     };


//     // edit qilishda
//     useEffect(() => {
//         if (edit) {
//             setNewMessage(edit.content);
//         }
//     }, [edit]);

//     // useEffect(() => {
//     //     scrollToBottom();
//     // }, [messages.length]);

//     // yangi xabar yozilganda
//     const handleSend = useCallback(() => {

//         if (!newMessage.trim()) return;

//         if (edit) {
//             updateMessage(newMessage, edit.id);
//             setEdit(null);
//         } else {
//             // scrollToBottom();
//             sendMessage(newMessage);
//         }
//         setNewMessage('');
//     }, [newMessage, edit]);

//     if (!chatId) {
//         return (
//             <div
//                 className={`${styles.chat_window} d-flex align-items-center justify-content-center`}>
//                 <Empty
//                     description="Chatni tanlang"
//                     image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 />
//             </div>
//         );
//     }




//     return (
//         <div className={styles.chat_window}>
//             {/* header */}
//             <div className={styles.chat_user}>
//                 {goBack && (
//                     <ArrowLeftOutlined
//                         style={{ cursor: 'pointer' }}
//                         onClick={goBack}
//                     />
//                 )}
//                 <Avatar
//                     size={50}
//                     src={
//                         <img
//                             src={
//                                 chat?.opponent?.photo_url ||
//                                 '/static/img/ozodbek.png'
//                             }
//                             alt="user img"
//                         />
//                     }
//                     onClick={() => router.push(`seller/${chat?.opponent?.id}`)}
//                     style={{ cursor: 'pointer' }}
//                 />
//                 <div className={styles.user_box}>
//                     <div className={styles.user_names}>
//                         <h4
//                             onClick={() =>
//                                 router.push(`seller/${chat?.opponent?.id}`)
//                             }
//                             style={{ cursor: 'pointer' }}>
//                             {chat?.opponent?.name}
//                         </h4>
//                     </div>
//                     <span>{chat?.opponent?.last_seen}</span>
//                 </div>
//             </div>

//             {/* messages */}
//             <div onScroll={handlScroll} ref={messagesContainerRef} id="scrollableDiv" style={{ width: "100%", height: "100vh", overflowY: "scroll", display: "flex", flexDirection: "column-reverse", margin: "auto", border: "1px solid red", overflowX: "hidden", position: "relative" }} className={`${styles.chat_messages}  p-3`}>

//                 <InfiniteScroll
//                     dataLength={messages.length}
//                     next={fetchNextPage}
//                     hasMore={hasNextPage}
//                     loader={<div className="d-flex justify-content-center align-items-center py-2">
//                         <ClipLoader color='#00A44F' size={20} />
//                     </div>}
//                     style={{ display: "flex", flexDirection: "column-reverse", overflow: "visible" }}
//                     scrollableTarget="scrollableDiv"
//                     inverse={true}

//                 >
//                     <div>
//                         {messages?.length > 0 ? (
//                             messages.map(msg => (
//                                 <ChatMessage
//                                     pushUser={() =>
//                                         router.push(
//                                             `seller/${chat?.chat?.opponent?.id}`
//                                         )
//                                     }
//                                     key={msg.id}
//                                     msg={msg}
//                                     onEdit={setEdit}
//                                 />
//                             ))
//                         ) : (
//                             <Empty
//                                 description="Hozircha xabarlar yo'q"
//                                 image={Empty.PRESENTED_IMAGE_SIMPLE}
//                             />
//                         )}
//                     </div>
//                 </InfiniteScroll>
//             </div>
//             <span onClick={scrollToBottom} className={styles.chat_down_icon} style={{ transform: openDownIcon ? 'translateX(0)' : 'translateX(100px)' }}>
//                 <ArrowDownOutlined size={20} />
//             </span>

//             {/* input */}
//             <div className={styles.chat_input_box}>
//                 <Input
//                     value={newMessage}
//                     onChange={e => setNewMessage(e.target.value)}
//                     onPressEnter={handleSend}
//                     placeholder={
//                         edit ? 'Xabarni tahrir qilyapsiz...' : 'Xabar yozing...'
//                     }
//                     className={styles.chat_input}
//                 />
//                 <Button
//                     style={{ background: edit ? '#f59e0b' : '#00A44F' }}
//                     type="primary"
//                     onClick={handleSend}>
//                     <SendOutlined style={{ fontSize: '20px' }} />
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default ChatWindow;

