/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last invocation.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait) => {
  let timeoutId = null;

  const debouncedFunction = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  };

  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
};

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every wait milliseconds.
 *
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle
 * @returns {Function} The throttled function
 */
export const throttle = (func, wait) => {
  let lastTime = 0;
  let timeoutId = null;

  return (...args) => {
    const now = Date.now();

    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        func.apply(this, args);
        timeoutId = null;
      }, wait - (now - lastTime));
    }
  };
};

/**
 * Formats a number as currency
 *
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency symbol (default: 'L')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'L') => {
  if (amount === null || amount === undefined) return `${currency}0`;
  return `${currency}${Number(amount).toLocaleString()}`;
};

/**
 * Truncates a string to a specified length
 *
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string with ellipsis if needed
 */
export const truncateText = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Capitalizes the first letter of a string
 *
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generates a unique ID
 *
 * @returns {string} A unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
