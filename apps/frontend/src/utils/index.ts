import dayjs from 'dayjs';

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date | null | undefined, format = 'YYYY-MM-DD'): string => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 格式化薪资范围
 */
export const formatSalary = (min: number | null, max: number | null): string => {
  if (!min && !max) return '面议';
  if (min && max) return `${min}k-${max}k`;
  if (min) return `${min}k以上`;
  return `${max}k以下`;
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * 匹配度等级
 */
export const getMatchLevel = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: '极佳匹配', color: 'green' };
  if (score >= 80) return { label: '高度匹配', color: 'blue' };
  if (score >= 70) return { label: '良好匹配', color: 'cyan' };
  if (score >= 60) return { label: '一般匹配', color: 'gold' };
  return { label: '匹配度较低', color: 'red' };
};

/**
 * 防抖
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * 节流
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn(...args);
    }
  };
};
