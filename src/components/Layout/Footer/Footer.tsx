import { Link } from 'react-router-dom';
import style from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={style.footer}>
      <p>Footer</p>
      <div className={style.links}>
        <Link
          to={'/'}
          className={style.link}
        >
          Welcome Page
        </Link>
        <Link
          to={'auth'}
          className={style.link}
        >
          Auth Page
        </Link>
        <Link
          to={'main'}
          className={style.link}
        >
          Main Page
        </Link>
        <Link
          to={Math.ceil(Math.random() * 10).toString()}
          className={style.link}
        >
          404 Page
        </Link>
      </div>
      <p>2023</p>
    </footer>
  );
};

export default Footer;
