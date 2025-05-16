/**
 * Formats a date to a readable string
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'No due date';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Returns true if the date is in the past
 */
export const isOverdue = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } catch (error) {
    return false;
  }
};

/**
 * Returns true if the date is today
 */
export const isToday = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  } catch (error) {
    return false;
  }
};

/**
 * Returns a date string in YYYY-MM-DD format
 */
export const toDateInputValue = (dateString?: string): string => {
  try {
    const date = dateString ? new Date(dateString) : new Date();
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

/**
 * Returns the relative time for a date
 */
export const getRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No due date';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) {
      return `${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''} ago`;
    } else if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
    }
  } catch (error) {
    return 'Invalid date';
  }
};