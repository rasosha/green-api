import { useNavigate } from 'react-router-dom';
import style from './WelcomePage.module.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <main className={style.wrapper}>
      <div className={style.textBox}>
        <p>Greetings!</p>
        <p>This is a test task for the "Frontend React Developer" position</p>
        <p>
          You can read more about the task
          <a
            className={style.link}
            href="https://drive.google.com/file/d/1c3HDbZJuPdfv7FaUYo8kEMzsfM2AkKwI/view"
            target="_blank"
          >
            here.
          </a>
        </p>
        <p>
          For authorization, you must enter <span className={style.i}>"IdInstance"</span> and{' '}
          <span className={style.i}>"ApiTokenInstance"</span>
        </p>
        <p>
          To get them go to
          <a
            href="https://green-api.com/"
            className={style.link}
            target="_blank"
          >
            green-api.com
          </a>
        </p>
        <p>If you already have these data, you can go to the authorization page</p>
        <button
          className={style.button}
          onClick={() => navigate('/auth')}
        >
          Authorization
        </button>
      </div>
    </main>
  );
};

export default WelcomePage;
