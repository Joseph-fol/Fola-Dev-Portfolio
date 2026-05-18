import { useMemo } from 'react';
import Widget from '../Widget';
import useProjects from '../../hooks/useProjects';
import usePageTitle from '../../hooks/usePageTitle';
import { IconBrandGithub, IconBriefcase, IconExternalLink, IconInbox, IconStarFilled } from '@tabler/icons-react';

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
      {/* Thumbnail Skeleton */}
      <div
        className="w-full h-24 rounded mb-2 bg-gray-300 bg-opacity-30"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
      {/* Title Skeleton */}
      <div
        className="h-4 rounded mb-2 bg-gray-300 bg-opacity-30 w-3/4"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
      {/* Description Skeleton */}
      <div
        className="h-3 rounded mb-3 bg-gray-300 bg-opacity-30 w-full"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
      {/* Tags Skeleton */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-5 rounded-full bg-gray-300 bg-opacity-30 flex-1"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }) {
  // Truncate description to 2 lines
  const truncateText = (text, lines = 2) => {
    const lineArray = text.split('\n');
    return lineArray.slice(0, lines).join('\n');
  };

  // Get color for thumbnail placeholder
  const colors = ['#e050a0', '#60b8f0', '#9050d0', '#40c8b8', '#90c850', '#5090f0'];
  const colorIndex = project._id ? project._id.charCodeAt(0) % colors.length : 0;
  const placeholderColor = colors[colorIndex];

  return (
    <div
      className="p-3 rounded-lg transition-all hover:shadow-md"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        border: '0.5px solid rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="w-full h-24 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-semibold overflow-hidden"
        style={{
          background: project.thumbnail
            ? `url(${project.thumbnail}) center / cover`
            : placeholderColor,
        }}
      >
        {!project.thumbnail && 'No Image'}
      </div>

      {/* Featured Badge */}
      {project.featured && (
        <div
          className="absolute top-2 right-2 text-sm"
          style={{ color: '#ffd700' }}
        >
          <IconStarFilled size={16} />
        </div>
      )}

      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <h4
          className="font-semibold flex-1"
          style={{
            fontSize: '13px',
            color: '#1a3870',
            margin: 0,
          }}
        >
          {project.title}
        </h4>
      </div>

      {/* Description */}
      <p
        className="text-xs mt-1 line-clamp-2"
        style={{
          color: '#6b92b8',
          margin: 0,
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </p>

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-xs whitespace-nowrap"
              style={{
                background: 'rgba(26, 110, 245, 0.1)',
                color: '#1a6ef5',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs transition-all hover:bg-opacity-50"
            style={{
              background: 'rgba(26, 110, 245, 0.15)',
              color: '#1a6ef5',
            }}
          >
            <IconExternalLink size={14} />
            Live
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs transition-all hover:bg-opacity-50"
            style={{
              background: 'rgba(64, 200, 184, 0.15)',
              color: '#40c8b8',
            }}
          >
            <IconBrandGithub size={14} />
            Repo
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProjectsWidget() {
  usePageTitle('projects', 'Projects');

  const { projects, loading, error } = useProjects();

  // Memoize skeleton cards
  const skeletonCards = useMemo(() => [
    <SkeletonCard key="skeleton-1" />,
    <SkeletonCard key="skeleton-2" />,
    <SkeletonCard key="skeleton-3" />,
  ], []);

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
        id="projects"
        title="Projects"
        icon={IconBriefcase}
        iconBg="#9050d0"
        defaultPosition={{ x: 400, y: 100 }}
        width={350}
      >
        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {skeletonCards}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="p-4 rounded-lg text-xs text-center"
            style={{
              background: 'rgba(240, 80, 160, 0.1)',
              color: '#e050a0',
            }}
          >
            <p className="font-semibold mb-1">Failed to load projects</p>
            <p className="text-xs opacity-75">{error}</p>
          </div>
        )}

        {/* Projects List */}
        {!loading && !error && projects.length > 0 && (
          <div
            className="space-y-3 max-h-96 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(26, 110, 245, 0.3) transparent',
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div
            className="p-4 rounded-lg text-xs text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#6b92b8',
            }}
          >
            <IconInbox size={24} className="mx-auto mb-2" />
            <p>No projects yet</p>
          </div>
        )}
      </Widget>
    </>
  );
}
