/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios';

import { env, isFeatureEnabled } from '@/common/libs/env';
import { BlogItemProps } from '@/common/types/blog';

type BlogParamsProps = {
  page?: number;
  per_page?: number;
  categories?: number | undefined;
  search?: string;
};

interface BlogDetailResponseProps {
  status: number;
  data: any;
}

const BLOG_URL = env.BLOG_API_URL ?? '';

/**
 * Empty payload returned when the blog integration is unconfigured. Shaped
 * to satisfy `extractData`'s consumers so the UI can render an empty state
 * without optional-chaining every field.
 */
const emptyBlogList = {
  posts: [] as BlogItemProps[],
  page: 1,
  per_page: 0,
  total_pages: 0,
  total_posts: 0,
  categories: 0,
};

const handleAxiosError = (
  error: AxiosError<any>,
): { status: number; data: any } => {
  if (error?.response) {
    return { status: error?.response?.status, data: error?.response?.data };
  } else {
    return { status: 500, data: { message: 'Internal Server Error' } };
  }
};

const extractData = (
  response: AxiosResponse,
): {
  posts: BlogItemProps[];
  page: number;
  per_page: number;
  total_pages: number;
  total_posts: number;
  categories: number;
} => {
  const { headers, data } = response;
  return {
    posts: data,
    page: response?.config?.params?.page || 1,
    per_page: response?.config?.params?.per_page || 6,
    total_pages: Number(headers['x-wp-totalpages']) || 0,
    total_posts: Number(headers['x-wp-total']) || 0,
    categories: response?.config?.params?.categories,
  };
};

export const getBlogList = async ({
  page = 1,
  per_page = 6,
  categories,
  search,
}: BlogParamsProps): Promise<{ status: number; data: any }> => {
  // Blog integration is optional. If BLOG_API_URL isn't configured, return a
  // shaped-but-empty payload so callers can render an empty state instead of
  // sending a request to `undefinedposts` and bubbling up a network error.
  if (!isFeatureEnabled.blog) {
    return { status: 200, data: { ...emptyBlogList, per_page } };
  }
  try {
    const params = { page, per_page, categories, search };
    const response = await axios.get(`${BLOG_URL}posts`, { params });
    return { status: response?.status, data: extractData(response) };
  } catch (error) {
    return handleAxiosError(error as AxiosError<any>);
  }
};

export const getBlogDetail = async (
  id: number,
): Promise<BlogDetailResponseProps> => {
  // Mirror getBlogList: when blog is unconfigured we return a 404-shaped
  // response so `getServerSideProps` in /blog/[slug] redirects to /404
  // gracefully instead of throwing during SSR.
  if (!isFeatureEnabled.blog) {
    return { status: 404, data: { message: 'Blog is not configured' } };
  }
  try {
    const response = await axios.get(`${BLOG_URL}posts/${id}`);
    return { status: response?.status, data: response?.data };
  } catch (error) {
    return handleAxiosError(error as AxiosError<any>);
  }
};
