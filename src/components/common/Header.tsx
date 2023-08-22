import React, { useEffect, useState, useRef } from 'react';

import { Link } from 'react-router-dom';

import styled from 'styled-components';
import Login from '../../pages/Login';
import { UserInfo } from '../../types/types';
import { handleLogOut } from '../../pages/Login';
import { supabase } from '../../api/supabase';

function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const storeUser: UserInfo = {
          avatar_url: session.user.user_metadata.avatar_url,
          name: session.user.user_metadata.name // 세션 정보에서 사용자 이름 가져오기
        };
        setUser(storeUser);
        sessionStorage.setItem('user', JSON.stringify(storeUser));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        sessionStorage.removeItem('user');
      }
    });

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleToggle = () => {
    if (user) {
      handleLogOut();
      setUser(null);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalOutsideClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderTag>
      <div className="logo-wrapper">
        <Link to="/">
          <img src="/asset/test-logo.png" className="test-logo" alt="test-img" />
        </Link>
        Header tap
      </div>
      <div>
        <Link to="/about">About</Link>
      </div>
      <div>
        <Link to="/review">Review</Link>
      </div>
      <div>
        <Link to="/mate">Mate</Link>
      </div>
      <div>
        <Link to="/search">Search</Link>
      </div>
      <div>
        <div className="user-info">
          {user ? (
            <>
              <div className="user-dropdown" onClick={handleMenuToggle} ref={menuRef}>
                <div className="info-mate">
                  <div className="welcome-mate">
                    <p>반갑습니다!</p>
                    <p>{user.name} 님</p>
                  </div>
                  <img src={user.avatar_url} alt="User Avatar" />
                </div>
                <div className="dropdown-content" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                  <Link to="/mypage">My Page</Link>
                  <div onClick={handleToggle}>Logout</div>
                </div>
              </div>
            </>
          ) : (
            <button onClick={handleToggle}>Login</button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ModalWrapper onClick={handleModalOutsideClick}>
          <Login closeModal={closeModal} />
        </ModalWrapper>
      )}
    </HeaderTag>
  );
}

export default Header;

const HeaderTag = styled.header`
  width: 100%;
  height: 10vh;
  border: 1px dotted gray;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo-wrapper {
    display: flex;
    align-items: center;

    .test-logo {
      width: 80px;
    }
  }
  .user-info {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 60px;
      border-radius: 50%;
    }
    .user-dropdown {
      position: relative;
      cursor: pointer;
      .info-mate {
        display: flex;
        align-items: center;
        text-align: right;
        .welcome-mate {
          margin-right: 8px;
          p {
            margin: 4px 0;
          }
        }
      }
      .dropdown-content {
        position: absolute;
        bottom: -70px; /* 하단에서 조정 */
        right: 0;
        width: 120px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        display: none;
        z-index: 1;

        a,
        div {
          display: block;
          padding: 8px 10px;
          text-align: center;
          text-decoration: none;
          color: #333;

          &:hover {
            background-color: #f1f1f1;
          }
        }
      }
    }
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
