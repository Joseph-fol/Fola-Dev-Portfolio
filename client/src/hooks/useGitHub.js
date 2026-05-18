import { useState, useEffect } from 'react';
import { CONFIG } from '../config';

const GITHUB_API = 'https://api.github.com';

export default function useGitHub() {
  const [data, setData] = useState({
    repos: [],
    events: [],
    totalRepos: 0,
    topRepos: [],
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        const username = CONFIG.github.username;

        // Fetch repos
        const reposResponse = await fetch(
          `${GITHUB_API}/users/${username}/repos?sort=stars&per_page=100&type=owner`
        );

        if (reposResponse.status === 404) {
          setError('GitHub user not found');
          setLoading(false);
          return;
        }

        if (reposResponse.status === 403) {
          setError('GitHub API rate limit exceeded. Try again in 1 hour.');
          setLoading(false);
          return;
        }

        if (!reposResponse.ok) {
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }

        const repos = await reposResponse.json();

        // Get top 3 repos by stars
        const topRepos = repos
          .filter((repo) => !repo.fork) // Exclude forks
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 3);

        // Fetch events
        const eventsResponse = await fetch(
          `${GITHUB_API}/users/${username}/events?per_page=30`
        );

        if (!eventsResponse.ok) {
          console.warn('Could not fetch events');
          setData({
            repos,
            events: [],
            totalRepos: repos.length,
            topRepos,
            recentActivity: [],
          });
          setLoading(false);
          return;
        }

        const events = await eventsResponse.json();

        // Process push events
        const pushEvents = events
          .filter((event) => event.type === 'PushEvent')
          .slice(0, 5)
          .map((event) => ({
            repo: event.repo.name,
            timestamp: event.created_at,
          }));

        setData({
          repos,
          events,
          totalRepos: repos.length,
          topRepos,
          recentActivity: pushEvents,
        });
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err.message || 'Failed to fetch GitHub data');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  return {
    ...data,
    loading,
    error,
  };
}
