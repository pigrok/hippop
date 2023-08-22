import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CommentProps } from '../../../types/props';
import { createComment, deleteComment, getComments, updateComment } from '../../../api/comment';
import { Comment } from '../../../types/types';

const Comments = ({ post }: CommentProps) => {
  // post_id 가져오기
  const { id } = post;
  const queryClient = useQueryClient();
  const [body, setBody] = useState<string>('');
  const [edit, setEdit] = useState<string>('');
  const [isEditId, setIsEditId] = useState<number | null>(null);
  const onChangeBody = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };
  const onChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdit(e.target.value);
  };

  // Comment 조회
  const { data: comments, isLoading, isError } = useQuery<Comment[] | null>(['comment', id], () => getComments(id));

  // Comment 추가
  const createMutation = useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comment', id]);
    }
  });
  const createButton = () => {
    // 유효성 검사
    if (!body) {
      return alert('댓글을 입력해주세요.');
    }
    // 새로운 댓글 객체 선언
    const newComment = {
      post_id: id,
      body
    };
    createMutation.mutate(newComment);
    // 입력값 초기화
    setBody('');
  };

  // Commnet 삭제
  const deleteMutation = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comment', id]);
    }
  });
  const deleteButton = (id: number) => {
    // 삭제 확인
    const confirm = window.confirm('댓글을 삭제하시겠습니까?');
    if (confirm) {
      // DB 수정
      deleteMutation.mutate(id);
    }
    // 삭제 완료
    alert('삭제되었습니다!');
  };

  // Commnet 수정
  const updateMutation = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comment', id]);
    }
  });
  const editButton = (comment: Comment) => {
    // 선택한 댓글 찾기
    if (isEditId === comment.id) {
      // 수정 댓글 선언
      const editComment = {
        ...comment,
        body: edit
      };
      // DB 수정
      updateMutation.mutate(editComment);
      setIsEditId(null);
    } else {
      // 수정 모드로 변경
      setIsEditId(comment.id);
      setEdit(comment?.body);
    }
  };

  if (isLoading) {
    return <div>로딩중입니다.</div>;
  }
  if (isError) {
    return <div>오류가 발생했습니다.</div>;
  }
  return (
    <>
      {/* 댓글 입력창 */}
      <div style={{ width: '90%', border: '1px solid black', padding: '20px', margin: '10px' }}>
        댓글 :{' '}
        <input
          value={body}
          onChange={onChangeBody}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              createButton();
            }
          }}
          placeholder="댓글을 입력해주세요."
          style={{ width: '50%' }}
        />
        <button onClick={createButton}>등록</button>
      </div>
      {/* 댓글 목록 */}
      {comments?.map((comment) => {
        return (
          <div key={comment.id} style={{ width: '92.5%', border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>작성자</div>
            <div>작성일자: {comment.created_at}</div>
            {isEditId === comment.id ? (
              <input value={edit} onChange={onChangeEdit} style={{ width: '50%' }} />
            ) : (
              <div style={{ width: '50%' }}>{comment.body}</div>
            )}
            <button onClick={() => deleteButton(comment.id)}>삭제</button>
            <button onClick={() => editButton(comment)}>{isEditId ? '저장' : '수정'}</button>
          </div>
        );
      })}
    </>
  );
};

export default Comments;
