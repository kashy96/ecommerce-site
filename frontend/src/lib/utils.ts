import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment";
import { APP_URL } from "./constants";
import { RootState } from '../app/store'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (path: string) => {
  return `${APP_URL}${path}`;
};

export const formatDate = (date: string): string => {
  return moment(date).fromNow();
};

export const getUserIdFromState = (state: RootState): string => {
  const userId = state.auth?.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
};
