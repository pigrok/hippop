// 라이브러리
import { Outlet } from 'react-router-dom';
// component
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import TopButton from '../components/common/TopButton';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// 컴포넌트

const Layout = () => {
  return (
    <>
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={1500}
        // hideProgressBar={true}
        newestOnTop={true}
        // closeOnClick={true}
        // rtl={true}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        limit={1}
        style={{ zIndex: 9999 }}
      />
      <div style={{ marginTop: '5rem' }}>
        <Outlet />
      </div>
      <TopButton />
      <Footer />
    </>
  );
};

export default Layout;
