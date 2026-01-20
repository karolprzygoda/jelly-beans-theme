// JavaScript example with React hooks and async operations

import { useState, useEffect, useCallback } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const processUserData = (users) => {
  return users
    .filter(user => user.isActive)
    .map(user => ({
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
      formattedDate: formatDate(user.createdAt)
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
};

export { useFetch, formatDate, processUserData };
