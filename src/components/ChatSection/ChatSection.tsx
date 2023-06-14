import { FormEvent, useEffect, useState } from 'react';
import useStore, { ZState } from '../../utils/store';
import S from './ChatSection.module.css';
import {
  deleteNotification,
  getChatHistory,
  getMessage,
  readChat,
  receiveNotifications,
  sendMessage,
} from '../../utils/apiCalls';
import useHistoryStore, { ChatInstance, HState, IMessage, Notification } from '../../utils/historyStore';
import timeFormat from '../../utils/timeFormat';
import { ReactComponent as Menu } from '../../assets/btns/menu.svg';
import { ReactComponent as Submit } from '../../assets/btns/submit.svg';
import { ReactComponent as Back } from '../../assets/btns/back.svg';
import sound from '../../assets/notification.mp3';
import Loader from '../Loader/Loader';

const ChatSection = () => {
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnMenuOpen, setIsBtnMenuOpen] = useState(false);
  const { auth, selectedChat, setSelectedChat } = useStore((state: ZState) => state);
  const { allChats, updateChatInstance, removeChat, addChat } = useHistoryStore((state: HState) => state);

  // const currentChat = allChats.find((item) => item.chatId === selectedChat);
  const [currentChat, setCurrentChat] = useState<ChatInstance>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessageInput('');
    const sentMessage = await sendMessage(auth, selectedChat, messageInput);
    const newMessage: IMessage = { chatId: selectedChat, idMessage: sentMessage.idMessage, type: 'outgoing' };
    if (newMessage.chatId) {
      updateChatInstance({ chatId: newMessage.chatId, history: [newMessage] });
    }
  };

  useEffect(() => {
    const requestHistory = async ({ chatId }: { chatId: string }) => {
      const chatInstanceInStore = allChats.find((item) => {
        if (item.chatId === chatId) {
          return item;
        }
      });
      if (chatInstanceInStore) {
        const storedChatHistory = chatInstanceInStore.history;
        if (storedChatHistory) {
          return storedChatHistory;
        } else if (!storedChatHistory) {
          setIsLoading(true);
          const newChatHistory = await getChatHistory(auth, selectedChat, 20);
          updateChatInstance({ chatId: selectedChat, history: newChatHistory });
          setIsLoading(false);
          return newChatHistory;
        }
      }
    };
    if (!selectedChat) {
      setCurrentChat({ chatId: '' });
    }
    if (selectedChat) {
      updateChatInstance({ chatId: selectedChat, notification: false });
      requestHistory({ chatId: selectedChat });
      const currentChat = allChats.find((item) => item.chatId === selectedChat);
      setCurrentChat(currentChat);
      readChat(auth, selectedChat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, updateChatInstance]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const notification: Notification = await receiveNotifications(auth);
        if (notification) {
          const newMessage: IMessage = await getMessage(auth, notification.body.senderData.chatId, notification.body.idMessage);
          if (newMessage.chatId === selectedChat) {
            updateChatInstance({ chatId: newMessage.chatId, history: [newMessage] });
            if (newMessage.type === 'incoming') {
              const audio = new Audio(sound);
              audio.play();
            }
          } else if (newMessage.chatId !== selectedChat) {
            const chatInstance = allChats.find((chatInstance) => chatInstance.chatId === newMessage.chatId);
            if (chatInstance && newMessage.chatId) {
              updateChatInstance({ chatId: newMessage.chatId, notification: true });
              if (chatInstance?.history) {
                updateChatInstance({ chatId: newMessage.chatId, history: [newMessage] });
              }
            } else if (!chatInstance && newMessage.chatId) {
              addChat(auth, { chatId: newMessage.chatId, notification: true });
            }
            const audio = new Audio(sound);
            audio.play();
          }
          deleteNotification(auth, notification.receiptId);
        } else {
          console.log('no new messages');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(getNotifications, 5000);
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, selectedChat]),
    [];

  return (
    <section
      className={`${S.wrapper}${selectedChat ? ` ${S.chatOpened}` : ` ${S.chatClosed}`}`}
      onClick={() => isBtnMenuOpen && setIsBtnMenuOpen(false)}
    >
      {selectedChat === '' ? (
        <div className={S.noChat}>
          <p>no chat is selected</p>
        </div>
      ) : (
        <>
          <header className={S.header}>
            <button
              className={S.backBtn}
              onClick={() => setSelectedChat('')}
            >
              <Back />
            </button>
            <div className={S.info}>
              <img
                src={currentChat?.avatar || './defaultAvatar.png'}
                alt=""
                className={S.avatar}
              />
              <div className={S.nameDiv}>
                <p className={S.name}>{currentChat?.name || currentChat?.chatId}</p>
                {currentChat?.name && <p className={S.chatId}>{currentChat?.chatId}</p>}
              </div>
            </div>
            <div className={S.btnMenu}>
              <button
                className={`${S.button}${!isBtnMenuOpen ? '' : ' ' + S.opened}`}
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
                    Close chat
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
                    Remove chat
                  </button>
                </div>
              )}
            </div>
          </header>
          <div className={S.messages}>
            {isLoading ? (
              <Loader color="white" />
            ) : (
              <>
                {currentChat?.history?.length !== 0 ? (
                  currentChat?.history?.map((msg: IMessage, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`${msg?.type === 'outgoing' ? S.outgoing : S.incoming} ${S.message}`}
                      >
                        <p className={S.messageText}>
                          {msg.textMessage || (
                            <span className={S.loader}>
                              <Loader color="white" />
                            </span>
                          )}
                        </p>
                        {!msg.textMessage && <span className={S.typeMessage}>{msg.typeMessage}</span>}
                        {msg.timestamp && <p className={S.time}>{timeFormat(msg.timestamp)}</p>}
                      </div>
                    );
                  })
                ) : (
                  <div className={S.empty}>No message yet.</div>
                )}
              </>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className={S.inputArea}
          >
            <input
              className={S.input}
              type="text"
              required
              placeholder="Write your message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              className={S.submit}
              disabled={!messageInput.trim()}
            >
              <Submit />
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default ChatSection;
