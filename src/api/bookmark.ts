// 라이브러리
import { supabase } from './supabase';
// 타입
import { Bookmark } from '../types/types';

// 모든 북마크 정보 가져오기
export const fetchAllBookMark = async () => {
  const { data } = await supabase.from('bookmark').select('*');

  return data;
};

// user의 북마크한 store list 가져오기
export const fetchBookMarkStore = async (userId: string) => {
  const { data } = await supabase.from('bookmark').select(`*, store(*)`).eq('user_id', userId);

  return data;
};

// 북마크 토글
export const toggleBookMark = async (bookmark: Bookmark): Promise<void> => {
  const { data: isBookMark } = await supabase
    .from('bookmark')
    .select('*')
    .eq('user_id', bookmark.user_id)
    .eq('store_id', bookmark.store_id);

  if (isBookMark && isBookMark.length > 0) {
    await supabase.from('bookmark').delete().eq('user_id', bookmark.user_id).eq('store_id', bookmark.store_id);
  } else {
    await supabase.from('bookmark').insert([{ user_id: bookmark.user_id, store_id: bookmark.store_id }]);
  }
};

// 전체 북마크 count
export const fetchCount = async () => {
  const { count } = await supabase.from('bookmark').select('count', { count: 'exact', head: true });
  return count;
};

export const fetchPopularStore = async () => {
  const { data } = await supabase.from('popular_stores').select();
  return data;
};
