import Edit from '../write/Edit';
import Comment from './Comment';

import { useState } from 'react';
import { styled } from 'styled-components';
import { useMutation } from '@tanstack/react-query';

import { DetailProps } from '../../../types/props';
import { deletePost } from '../../../api/post';

const Detail = ({ post, setPost }: DetailProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 창 닫기 버튼
  const closeDetail = () => {
    setPost(null);
  };

  // Post 삭제
  const deleteMutation = useMutation(deletePost);
  const deleteButton = (id: number) => {
    // 삭제 확인
    const confirm = window.confirm('게시물을 삭제하시겠습니까?');
    if (confirm) {
      // DB 수정
      deleteMutation.mutate(id);

      // 상세페이지 모달 창 닫기
      alert('삭제되었습니다!');
      setPost(null);
    }
  };

  const editButton = () => {
    setIsEdit(!isEdit);
  };

  return (
    <ModalContainer>
      <ModalBox>
        <button onClick={closeDetail}>창 닫기</button>
        <button onClick={() => deleteButton(post.id)}>삭제</button>
        {isEdit ? (
          <Edit post={post} setPost={setPost} isEdit={isEdit} setIsEdit={setIsEdit} />
        ) : (
          <>
            <button onClick={editButton}>수정</button>
            <div>카테고리 : {(post.ctg_index === 1 && '팝업후기') || (post.ctg_index === 2 && '팝업메이트')}</div>
            <div>팝업스토어 이름</div>
            <div>제목 : {post.title}</div>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </>
        )}
        {isEdit ? <></> : <Comment />}
      </ModalBox>
    </ModalContainer>
  );
};

export default Detail;

const ModalContainer = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
`;

const ModalBox = styled.div`
  background-color: #fff;
  padding: 20px;
  width: 800px;
  height: 800px;
  border-radius: 10px;
  position: relative;
  overflow: auto;
`;
