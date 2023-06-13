import { useNavigate } from 'react-router-dom';
import style from './WelcomePage.module.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <main className={style.wrapper}>
      <div className={style.textBox}>
        <p>Приветствую!</p>
        <p>Это тестовое задание на должность "Фронтенд разработчик React"</p>
        <p>
          Подробнее о задании можно прочитать
          <a
            className={style.link}
            href="https://drive.google.com/file/d/1c3HDbZJuPdfv7FaUYo8kEMzsfM2AkKwI/view"
          >
            по ссылке
          </a>
          <p>
            {
              'Для авторизации необходимо ввести IdInstance и ApiTokenInstance, которые нужно получить на сайте '
            }
          </p>
          <a
            href="https://green-api.com/"
            className={style.link}
          >
            green-api.com
          </a>
          <p>Если у вас уже имеются эти данные, то можете перейти на страницу авторизации</p>
          <button
            className={style.button}
            onClick={() => navigate('/auth')}
          >
            Авторизация
          </button>
        </p>
      </div>
    </main>
  );
};

export default WelcomePage;
