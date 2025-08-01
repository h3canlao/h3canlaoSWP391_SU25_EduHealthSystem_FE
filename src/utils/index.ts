export * from "./axiosCustomize";

/**
 * Format a date string to localized date time format (Vietnamese locale)
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format a date string to localized date format (Vietnamese locale)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format a time string from HH:MM:SS to HH:MM
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  // If it's already in HH:MM:SS format, return just HH:MM
  if (timeString.includes(':')) {
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
  }
  
  return timeString;
};
