import { FormEvent, useEffect, useState } from 'react';
import useStore, { ZState } from '../../utils/store';
import style from './Modal.module.css';
import useHistoryStore, { HState } from '../../utils/historyStore';
import { checkWhatsapp, getContacts } from '../../utils/apiCalls';
import Loader from '../Loader/Loader';

const Modal = () => {
  const { setIsModal, auth, contacts, setContacts } = useStore((state: ZState) => state);
  const { allChats, addChat } = useHistoryStore((state: HState) => state);
  const [phoneInput, setPhoneInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getConts = async () => {
    if (contacts.length === 0) {
      const cont = await getContacts(auth);
      setContacts(cont);
    }
  };

  useEffect(() => {
    getConts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    if (allChats.some((obj) => obj.chatId === phoneInput + '@c.us')) {
      setError('User already exists');
    } else {
      const isWhatsapp = await checkWhatsapp(auth, +phoneInput);
      if (isWhatsapp.existsWhatsapp) {
        addChat(auth, { chatId: phoneInput + '@c.us' });
        setError('');
        setIsModal(false);
      } else {
        setError(`user ${phoneInput} does not have WhatsApp`);
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      className={style.modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsModal(false);
        }
      }}
    >
      <form
        className={style.form}
        onSubmit={handleSubmit}
      >
        <label htmlFor="phone">Enter phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={style.input}
          pattern="[0-9]{8,12}"
          required
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
        />
        <small>Format: 1234567890</small>
        <button type="submit">Добавить</button>
        {isLoading && <Loader color="white" />}
        {error && <p className={style.error}>{error}</p>}
        <div
          className={style.closeBtn}
          onClick={() => setIsModal(false)}
        >
          <p>✕</p>
        </div>
        <div className={style.contacts}>
          {phoneInput &&
            contacts &&
            contacts
              .filter(
                (contact) =>
                  (contact.id.includes(phoneInput) ||
                    contact.name.toLowerCase().includes(phoneInput.toLowerCase())) &&
                  contact.type === 'user',
              )
              .map((contact) => (
                <div
                  key={contact.id}
                  className={style.names}
                  onClick={() => setPhoneInput(contact.id.substring(0, contact.id.length - 5))}
                >{`${contact.name} (${contact.id.substring(0, contact.id.length - 5)})`}</div>
              ))}
        </div>
      </form>
    </div>
  );
};

export default Modal;
