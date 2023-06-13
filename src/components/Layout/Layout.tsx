import { Outlet } from 'react-router-dom';
// import Footer from './Footer/Footer';
// import Header from './Header/Header';
import style from './Layout.module.css';
import Modal from '../Modal/Modal';
import useStore, { ZState } from '../../utils/store';

const Layout = () => {
  const { isModal } = useStore((state: ZState) => state);

  return (
    <div className={style.appWrapper}>
      {/* <Header /> */}
      <Outlet />
      {/* <Footer /> */}
      {isModal && <Modal />}
    </div>
  );
};

export default Layout;
