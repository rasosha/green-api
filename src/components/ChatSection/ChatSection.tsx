import { FormEvent, useEffect, useState } from 'react';
import useStore, { ZState } from '../../utils/store';
import S from './ChatSection.module.css';
import {
  deleteNotification,
  getChatHistory,
  getMessage,
  receiveNotifications,
  sendMessage,
} from '../../utils/apiCalls';
import useHistoryStore, { HState, IMessage, Notification } from '../../utils/historyStore';
import timeFormat from '../../utils/timeFormat';
import { ReactComponent as Menu } from '../../assets/btns/menu.svg';
import sound from '../../assets/notification.mp3';

interface NewMessage {
  id: number;
  body?: IMessage;
}
const ChatSection = () => {
  const [messageInput, setMessageInput] = useState('');
  const [isBtnMenuOpen, setIsBtnMenuOpen] = useState(false);
  const [newMessage, setNewMessage] = useState<NewMessage>({ id: 0 });
  const { auth, selectedChat, setSelectedChat } = useStore((state: ZState) => state);
  const {
    allChats,
    updateChatHistory,
    addNotificationToChat,
    removeNotificationFromChat,
    removeChat,
  } = useHistoryStore((state: HState) => state);
  const currentChat = allChats.find((item) => item.chatId === selectedChat);
  const getHistory = async () => {
    if (selectedChat) {
      const h = allChats.find((item) => {
        item.chatId === selectedChat;
      });
      if (h === undefined) {
        const his = await getChatHistory(auth, selectedChat, 20);
        updateChatHistory({ chatId: selectedChat, history: his });
        return his;
      } else {
        return h;
      }
    }
  };

  useEffect(() => {
    if (selectedChat) {
      if (currentChat?.history === undefined) {
        getHistory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await sendMessage(auth, selectedChat, messageInput);
    console.log(result);
    setMessageInput('');
  };

  useEffect(() => {
    const getNotifications = async () => {
      console.log('no new messages');
      try {
        const notification: Notification = await receiveNotifications(auth);
        if (notification) {
          if (notification.receiptId !== newMessage.id) {
            const getMsg: IMessage = await getMessage(
              auth,
              notification.body.senderData.chatId,
              notification.body.idMessage,
            );
            setNewMessage({
              id: notification.receiptId,
              body: getMsg,
            });
            if (getMsg.type === 'incoming') {
              const audio = new Audio(sound);
              audio.play();
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (newMessage.id === 0) {
      const intervalId = setInterval(getNotifications, 5000);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      if (newMessage?.body?.chatId === selectedChat) {
        updateChatHistory({
          chatId: newMessage.body.chatId,
          history: [newMessage.body],
        });
        removeNotificationFromChat({ chatId: newMessage.body.chatId });
        deleteNotification(auth, newMessage.id);
        setNewMessage({ id: 0 });
      } else if (newMessage?.body?.chatId) {
        addNotificationToChat({ chatId: newMessage.body.chatId });
      }
    }
  }, [
    newMessage.id,
    newMessage.body,
    auth,
    selectedChat,
    updateChatHistory,
    removeNotificationFromChat,
    addNotificationToChat,
  ]),
    [];

  return (
    <section
      className={S.wrapper}
      onClick={() => isBtnMenuOpen && setIsBtnMenuOpen(false)}
    >
      {selectedChat === '' ? (
        <div className={S.noChat}>
          <p>no chat is selected</p>
        </div>
      ) : (
        <>
          <header className={S.header}>
            <div className={S.info}>
              <img
                src={currentChat?.avatar}
                alt=""
                className={S.avatar}
              />
              <span className={S.name}>{currentChat?.name}</span>
            </div>
            <div className={S.btns}>
              <button
                className={S.button}
                onClick={() => setIsBtnMenuOpen(!isBtnMenuOpen)}
              >
                <Menu />
              </button>
              {isBtnMenuOpen && (
                <div className={S.btnMenuOptions}>
                  <button
                    className={S.buttonOption}
                    onClick={() => setSelectedChat('')}
                  >
                    Закрыть чат
                  </button>
                  <button
                    className={S.buttonOption}
                    onClick={() => {
                      if (currentChat?.chatId) {
                        removeChat({ chatId: currentChat.chatId });
                        setSelectedChat('');
                      }
                    }}
                  >
                    Удалить чат
                  </button>
                </div>
              )}
            </div>
          </header>
          <div className={S.messages}>
            {currentChat?.history?.length !== 0 ? (
              currentChat?.history?.map((msg: IMessage, index: number) => {
                return (
                  <div
                    key={index}
                    className={`${msg?.type === 'outgoing' ? S.outgoing : S.incoming} ${S.message}`}
                  >
                    <p>{msg.textMessage}</p>
                    {!msg.textMessage && <span className={S.typeMessage}>{msg.typeMessage}</span>}
                    {msg.timestamp && <p className={S.time}>{timeFormat(msg.timestamp)}</p>}
                  </div>
                );
              })
            ) : (
              <div className={S.empty}>No message yet.</div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className={S.inputArea}
          >
            <input
              className={S.input}
              type="text"
              placeholder="input"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <input type="submit" />
          </form>
        </>
      )}
    </section>
  );
};

export default ChatSection;
