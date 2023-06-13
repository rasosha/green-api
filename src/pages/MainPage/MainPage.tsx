import { useEffect, useState } from 'react';
import ChatList from '../../components/ChatList/ChatList';
import ChatSection from '../../components/ChatSection/ChatSection';
import S from './MainPage.module.css';
import useStore, { ZState } from '../../utils/store';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Add } from '../../assets/btns/add.svg';
import { ReactComponent as Menu } from '../../assets/btns/menu.svg';
import useHistoryStore, { HState } from '../../utils/historyStore';

const MainPage = () => {
  const { auth, setAuth, setIsModal, selectedChat, setSelectedChat } = useStore(
    (state: ZState) => state,
  );
  const { allChats, removeChat } = useHistoryStore((state: HState) => state);
  const navigate = useNavigate();
  const [isBtnMenuOpen, setIsBtnMenuOpen] = useState(false);

  const exit = () => {
    setAuth({ stateInstance: 'notAuthorized', apiTokenInstance: '', idInstance: '' });
    setSelectedChat('');
  };
  const clearAuth = () => {
    localStorage.removeItem('auth');
  };
  const clearChats = () => {
    localStorage.removeItem('allChats');
    allChats.map((item) => removeChat({ chatId: item.chatId }));
    setSelectedChat('');
    console.log('selectedChat :>> ', selectedChat);
  };

  useEffect(() => {
    if (!(auth.stateInstance === 'authorized')) {
      navigate('/auth');
    }
  }, [navigate, auth]);

  return (
    <main
      className={S.wrapper}
      onClick={() => isBtnMenuOpen && setIsBtnMenuOpen(false)}
    >
      <section className={S.section}>
        <header className={S.header}>
          <div className={S.avatar} />
          <p className={S.user}>Instance: {auth.idInstance}</p>
          <div className={S.btnMenu}>
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
                  onClick={() => exit()}
                >
                  Exit
                </button>
                <button
                  className={S.buttonOption}
                  onClick={() => clearChats()}
                >
                  Clear chats
                </button>
                <button
                  className={S.buttonOption}
                  onClick={() => clearAuth()}
                >
                  Clear auth data
                </button>
                <button
                  className={S.buttonOption}
                  onClick={() => {
                    clearChats();
                    clearAuth();
                    exit();
                  }}
                >
                  Clear all data and exit
                </button>
              </div>
            )}
          </div>
        </header>
        <ChatList />
        <button
          className={S.createBtn}
          title="Create new chat"
          onClick={() => setIsModal(true)}
        >
          <Add className={S.createBtnIcon} />
        </button>
      </section>

      <ChatSection />
    </main>
  );
};

export default MainPage;
