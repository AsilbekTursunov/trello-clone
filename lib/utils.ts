import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getDate = (date: string) => {
  return moment(date).format('MMM DD, YYYY')
}
