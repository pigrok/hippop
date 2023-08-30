import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import Detail from '../pages/Detail';
// import Login from '../pages/Login';
import MyPage from '../pages/MyPage';
import Search from '../pages/Search';
import Review from '../pages/Review';
import Mate from '../pages/Mate';
import About from '../pages/About';
import Header from '../components/common/Header';
import RDetail from '../pages/RDetail';
import MDetail from '../pages/MDetail';
import Footer from '../pages/Footer';

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/auth/signin" element={<Login />} /> */}
        {/* <Route path="/mypage/:id" element={<MyPage />} /> */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/review" element={<Review />} />
        <Route path="/mate" element={<Mate />} />
        <Route path="/rdetail/:id" element={<RDetail />} />
        <Route path="/mdetail/:id" element={<MDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};
export default Router;
