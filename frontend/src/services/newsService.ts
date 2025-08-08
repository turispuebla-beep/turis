import api from './api';
import { News, NewsResponse } from '../types/news';

export const getNews = async (page = 1, limit = 10): Promise<NewsResponse> => {
  const response = await api.get(`/news?page=${page}&limit=${limit}`);
  return response.data;
};

export const getNewsById = async (id: string): Promise<News> => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

export const createNews = async (data: Omit<News, 'id'>): Promise<News> => {
  const response = await api.post('/news', data);
  return response.data;
};

export const updateNews = async (id: string, data: Partial<News>): Promise<News> => {
  const response = await api.put(`/news/${id}`, data);
  return response.data;
};

export const deleteNews = async (id: string): Promise<void> => {
  await api.delete(`/news/${id}`);
};