import { useState, useEffect, useCallback } from 'react';
import { getStories } from '../services/api';

export function useStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchStories = useCallback(
    async (p = page, s = searchTerm, so = sort) => {
      console.log('[FETCH]', { page: p, search: s.trim() || '-', sort: so });
      setLoading(true);
      setError(null);

      try {
        const params = { page: p, limit, sort: so };
        if (s.trim()) params.search = s.trim();

        const responseData = await getStories(params);

        setStories(responseData?.data?.stories || []);
        setTotalPages(responseData?.data?.pagination?.totalPages || 1);
      } catch (err) {
        setError(err.message || 'Failed to load stories');
        console.error('Fetch error:', err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchStories(page, searchTerm, sort);
  }, [page, searchTerm, sort, fetchStories]);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const changeSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const changeSort = (newSort) => {
    console.log('[SORT CHANGE]', { from: sort, to: newSort });
    if (newSort !== sort) {
      setSort(newSort);
      setPage(1);
    }
  };

  return {
    stories,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    sort,
    setSort: changeSort,
    setSearchTerm: changeSearch,
    setPage: changePage,
    refetch: () => fetchStories(page, searchTerm, sort),
  };
}