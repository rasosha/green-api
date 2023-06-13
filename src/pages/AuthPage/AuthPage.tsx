import { FormEvent, useState } from 'react';
import S from './AuthPage.module.css';
import useStore, { ZState } from '../../utils/store';
import { getStateInstance, setSettings } from '../../utils/apiCalls';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const AuthPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, setAuth } = useStore((state: ZState) => state);
  const [authInput, setAuthInput] = useState(
    localStorage.auth ? JSON.parse(localStorage.auth) : auth,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const stateInstance = await getStateInstance(authInput);
    if (stateInstance === 'authorized') {
      const auth = {
        stateInstance,
        idInstance: authInput.idInstance,
        apiTokenInstance: authInput.apiTokenInstance,
      };
      setAuth(auth);
      localStorage.auth = JSON.stringify(authInput);
      await setSettings(auth);
      navigate('/main');
    } else setError(stateInstance);
    setIsLoading(false);
  };

  return (
    <main>
      <section>
        {isLoading ? (
          <Loader color="white" />
        ) : (
          <form
            className={S.form}
            onSubmit={handleSubmit}
          >
            <p>Authentication</p>
            <input
              type="text"
              id="IdInstance"
              className={S.input}
              placeholder="IdInstance"
              required
              pattern="[0-9]{10}"
              value={authInput?.idInstance}
              onChange={(e) => setAuthInput({ ...authInput, idInstance: e.target.value })}
            />
            <input
              type="text"
              id="ApiTokenInstance"
              placeholder="ApiTokenInstance"
              required
              pattern="[a-z0-9]{20-60}"
              className={S.input}
              value={authInput?.apiTokenInstance}
              onChange={(e) => setAuthInput({ ...authInput, apiTokenInstance: e.target.value })}
            />
            <input
              type="submit"
              className={S.button}
            />
            {error && <p className={S.error}>{error}</p>}
          </form>
        )}
      </section>
    </main>
  );
};

export default AuthPage;
