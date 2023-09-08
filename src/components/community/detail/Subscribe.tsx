// 라이브러리
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { styled } from 'styled-components';
// api
import { createSubscribe, deleteSubscribe, isSubscribe } from '../../../api/subscribe';
// zustand store
import { useCurrentUser } from '../../../store/userStore';
// 타입
import { SubscribeProps } from '../../../types/props';
import { SubscribeType } from '../../../types/types';
//alert
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

const Subscribe = ({ writerId }: SubscribeProps) => {
  // 로그인한 유저 정보 가져오기 (From)
  const currentUser = useCurrentUser();

  // 작성자 && 구독자
  useEffect(() => {});
  const subscribe: SubscribeType = {
    subscribe_from: currentUser?.id,
    subscribe_to: writerId
  };

  // 구독 확인하기
  const { data: subscribed } = useQuery(['subscribe', writerId], async () => {
    if (currentUser) {
      return await isSubscribe(subscribe);
    }
    return null;
  });

  // 구독 하기
  const queryClient = useQueryClient();
  const createMutation = useMutation(createSubscribe, {
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribe']);
    }
  });
  const subButton = async () => {
    if (!currentUser) {
      toast.info('로그인을 해주세요.', {
        className: 'custom-toast',
        theme: 'light'
      });
      return;
    } else {
      const subConfirm = new Promise((resolve) => {
        window.confirm('구독하시겠습니까?') ? resolve(true) : resolve(false);
      });

      const options = {
        // theme: 'light',
        success: (await subConfirm) ? '구독이 완료되었습니다.' : undefined
      };

      const confirm = await toast.promise(subConfirm, options);

      if (confirm) {
        createMutation.mutate(subscribe);
      }
    }
  };

  // 구독 취소
  const deleteMutation = useMutation(deleteSubscribe, {
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribe']);
    }
  });
  const cancelButton = () => {
    if (!currentUser) {
      toast.info('로그인을 해주세요.', {
        className: 'custom-toast',
        theme: 'light'
      });
      // alert('로그인을 해주세요.');
      return;
    } else {
      const confirm = window.confirm('구독을 취소하시겠습니까?');
      if (confirm) {
        deleteMutation.mutate(subscribe);
      }
    }
  };

  return (
    <>
      {subscribe.subscribe_from !== subscribe.subscribe_to && (
        <>
          {subscribed && subscribed.length > 0 ? (
            <Button onClick={cancelButton}>구독 취소</Button>
          ) : (
            <Button onClick={subButton}>구독 하기</Button>
          )}
        </>
      )}
    </>
  );
};

export default Subscribe;

const Button = styled.button`
  width: 120px;
  height: 40px;
  font-weight: 600;
`;
