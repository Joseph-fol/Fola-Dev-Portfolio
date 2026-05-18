import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Widget from '../Widget';
import useGitHub from '../../hooks/useGitHub';
import usePageTitle from '../../hooks/usePageTitle';
import { CONFIG } from '../../config';
import {
  IconAlertCircle,
  IconArrowUpRight,
  IconBrandGithub,
  IconExternalLink,
  IconInbox,
  IconStarFilled,
} from '@tabler/icons-react';

// Language color mapping
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#239120',
  Go: '#00ADD8',
  Rust: '#ce422b',
  React: '#61dafb',
  Vue: '#2c3e50',
  CSS: '#563d7c',
  HTML: '#e34c26',
  default: '#858585',
};

// Skeleton Card Component
function SkeletonCard() {
  return (
    <div
      className="p-3 rounded-lg animate-pulse"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        border: '0.5px solid rgba(255, 255, 255, 0.6)',
      }}
    >
      <div
        className="h-4 rounded mb-2 bg-gray-300 bg-opacity-30 w-2/3"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
      <div
        className="h-3 rounded bg-gray-300 bg-opacity-30 w-1/2"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
    </div>
  );
}

// Format time difference
const getTimeDifference = (timestamp) => {
  const now = new Date();
  const eventDate = new Date(timestamp);
  const diffMs = now - eventDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  if (diffMins > 0) {
    return `${diffMins}m ago`;
  }
  return 'now';
};

// Repo Card Component
function RepoCard({ repo }) {
  const language = repo.language || 'Unknown';
  const color = LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-lg transition-all hover:shadow-md"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        border: '0.5px solid rgba(255, 255, 255, 0.6)',
        textDecoration: 'none',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4
            className="font-semibold truncate"
            style={{
              fontSize: '13px',
              color: '#1a3870',
              margin: 0,
            }}
          >
            {repo.name}
          </h4>
        </div>
        <div
          className="flex items-center gap-1 flex-shrink-0"
          style={{
            fontSize: '12px',
            color: '#1a6ef5',
          }}
        >
          <IconStarFilled size={12} />
          {repo.stargazers_count}
        </div>
      </div>

      {repo.description && (
        <p
          className="text-xs mb-2 line-clamp-2"
          style={{
            color: '#6b92b8',
            margin: 0,
            lineHeight: '1.3',
          }}
        >
          {repo.description}
        </p>
      )}

      {repo.language && (
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
          ></div>
          <span
            className="text-xs"
            style={{
              color: '#6b92b8',
            }}
          >
            {repo.language}
          </span>
        </div>
      )}
    </a>
  );
}

// Activity Item Component
function ActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-white border-opacity-10 last:border-0">
      <IconArrowUpRight
        size={14}
        className="flex-shrink-0"
        style={{
          color: '#40c8b8',
          marginTop: '2px',
        }}
      />
      <div className="min-w-0 flex-1">
        <p
          className="text-xs"
          style={{
            color: '#1a3870',
            margin: 0,
            wordBreak: 'break-word',
          }}
        >
          <span className="font-semibold">Pushed to</span>{' '}
          <span
            style={{
              color: '#1a6ef5',
              fontFamily: 'monospace',
            }}
          >
            {activity.repo.split('/')[1]}
          </span>
        </p>
        <p
          className="text-xs mt-0.5"
          style={{
            color: '#6b92b8',
            margin: 0,
          }}
        >
          {getTimeDifference(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default function GitHubWidget() {
  usePageTitle('github', 'GitHub');

  const { repos, topRepos, recentActivity, totalRepos, loading, error } = useGitHub();
  const username = CONFIG.github.username;
  const profileUrl = `https://github.com/${username}`;

  // Memoize skeleton cards
  const skeletonCards = useMemo(
    () => [
      <SkeletonCard key="skeleton-1" />,
      <SkeletonCard key="skeleton-2" />,
      <SkeletonCard key="skeleton-3" />,
    ],
    []
  );

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            backgroundPosition: 200% 0;
          }
          100% {
            backgroundPosition: -200% 0;
          }
        }
      `}</style>
      <Widget
        id="github"
        title="GitHub"
        icon={IconBrandGithub}
        iconBg="#40c8b8"
        defaultPosition={{ x: 600, y: 400 }}
        width={350}
      >
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="text-center py-2">
                <div
                  className="inline-block h-8 w-24 rounded-lg animate-pulse"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite',
                  }}
                />
              </div>
              {skeletonCards}
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg text-xs text-center"
              style={{
                background: 'rgba(240, 80, 160, 0.1)',
                color: '#e050a0',
              }}
            >
              <IconAlertCircle size={18} className="mx-auto mb-2" />
              <p className="font-semibold mb-1">Unable to load GitHub data</p>
              <p className="opacity-75">{error}</p>
            </motion.div>
          )}

          {/* Loaded State */}
          {!loading && !error && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Profile Link */}
              <div className="text-center py-2">
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'rgba(64, 200, 184, 0.15)',
                    color: '#40c8b8',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '12px',
                  }}
                >
                  <IconExternalLink size={14} />
                  Visit Profile
                </a>
              </div>

              {/* Total Repos Count */}
              <div
                className="p-3 rounded-lg text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  border: '0.5px solid rgba(255, 255, 255, 0.6)',
                }}
              >
                <p
                  className="font-bold"
                  style={{
                    fontSize: '18px',
                    color: '#1a6ef5',
                    margin: 0,
                  }}
                >
                  {totalRepos}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{
                    color: '#6b92b8',
                    margin: 0,
                  }}
                >
                  Public Repositories
                </p>
              </div>

              {/* Top 3 Repos */}
              {topRepos.length > 0 && (
                <div>
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{
                      color: '#6b92b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    Top Repositories
                  </p>
                  <div className="space-y-2">
                    {topRepos.map((repo) => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {recentActivity.length > 0 && (
                <div>
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{
                      color: '#6b92b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    Recent Activity
                  </p>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '0.5px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                  >
                    {recentActivity.map((activity, idx) => (
                      <ActivityItem key={idx} activity={activity} />
                    ))}
                  </div>
                </div>
              )}

              {/* No Activity Message */}
              {recentActivity.length === 0 && totalRepos > 0 && (
                <div
                  className="p-3 rounded-lg text-xs text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#6b92b8',
                  }}
                >
                  <IconInbox size={18} className="mx-auto mb-1" />
                  <p>No recent push activity</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Widget>
    </>
  );
}
