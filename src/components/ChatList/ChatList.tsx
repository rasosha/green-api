import S from './ChatList.module.css';
import useStore, { ZState } from '../../utils/store';
import useHistoryStore, { HState } from '../../utils/historyStore';
import React from 'react';

const ChatList: React.FC = () => {
  const { isLoading } = useStore((state: ZState) => state);
  const { allChats } = useHistoryStore((state: HState) => state);
  const { selectedChat, setSelectedChat } = useStore((state: ZState) => state);
  const handleClick = (chatId: string) => {
    if (!isLoading) {
      if (selectedChat === chatId) {
        console.log('already selected');
      } else {
        setSelectedChat(chatId);
      }
    }
  };

  return (
    <>
      {allChats.map((item, index) => {
        return (
          <div
            key={index}
            className={`${S.chatItem}${selectedChat === item.chatId ? ` ${S.active}` : ''}`}
            onClick={() => handleClick(item.chatId)}
          >
            <img
              src={item.avatar || './src/assets/defaultAvatar.png'}
              alt="person img"
              className={S.avatar}
              style={{ backgroundColor: '#005C4B' }}
            />
            <p>{item.name ? item.name : item.chatId}</p>
            {item.notification && <div className={S.newMsg}></div>}
          </div>
        );
      })}
    </>
  );
};

export default ChatList;
