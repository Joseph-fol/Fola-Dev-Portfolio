import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { IconDeviceFloppy, IconEdit, IconFlame, IconPlus, IconX } from '@tabler/icons-react';
import axios from 'axios';
import Widget from '../Widget';
import usePageTitle from '../../hooks/usePageTitle';
import { useNotifications } from '../../context/NotificationContext';

const STORAGE_KEY = 'portfolioOS_skills';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_SKILLS = [
  {
    category: 'Languages',
    color: '#1a6ef5',
    skills: [
      { name: 'JavaScript', progress: 88 },
      { name: 'TypeScript', progress: 72 },
      { name: 'Python', progress: 68 },
    ],
  },
  {
    category: 'Frontend',
    color: '#e050a0',
    skills: [
      { name: 'React', progress: 90 },
      { name: 'Tailwind CSS', progress: 86 },
      { name: 'Framer Motion', progress: 78 },
    ],
  },
  {
    category: 'Backend',
    color: '#40c8b8',
    skills: [
      { name: 'Node.js', progress: 82 },
      { name: 'Express', progress: 80 },
      { name: 'REST APIs', progress: 84 },
    ],
  },
  {
    category: 'Database',
    color: '#9050d0',
    skills: [
      { name: 'MongoDB', progress: 76 },
      { name: 'PostgreSQL', progress: 62 },
    ],
  },
  {
    category: 'Tools',
    color: '#f97316',
    skills: [
      { name: 'Git', progress: 86 },
      { name: 'Docker', progress: 60 },
      { name: 'Vercel', progress: 78 },
    ],
  },
  {
    category: 'Soft Skills',
    color: '#22c55e',
    skills: [
      { name: 'Communication', progress: 84 },
      { name: 'Problem Solving', progress: 88 },
      { name: 'Teamwork', progress: 82 },
    ],
  },
];

function readSkills() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_SKILLS;
  } catch {
    return DEFAULT_SKILLS;
  }
}

function level(progress) {
  if (progress >= 85) return 'Expert';
  if (progress >= 70) return 'Advanced';
  if (progress >= 45) return 'Intermediate';
  return 'Beginner';
}

function RadarChart({ groups }) {
  const size = 160;
  const center = size / 2;
  const radius = 58;
  const points = groups.map((group, index) => {
    const average = group.skills.reduce((sum, skill) => sum + Number(skill.progress || 0), 0) / Math.max(group.skills.length, 1);
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / groups.length;
    const distance = radius * (average / 100);
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
  });
  const frame = groups.map((_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / groups.length;
    return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <polygon points={frame.join(' ')} fill="rgba(255,255,255,0.28)" stroke="rgba(26,56,112,0.18)" />
      {[0.33, 0.66].map((scale) => (
        <polygon
          key={scale}
          points={groups.map((_, index) => {
            const angle = -Math.PI / 2 + (Math.PI * 2 * index) / groups.length;
            return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(26,56,112,0.12)"
        />
      ))}
      <motion.polygon
        points={points.join(' ')}
        fill="rgba(26,110,245,0.24)"
        stroke="var(--accent-color)"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.82, transformOrigin: 'center' }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      />
    </svg>
  );
}

export default function SkillsWidget() {
  usePageTitle('skills', 'Skills');
  const { notify } = useNotifications();
  const [editMode, setEditMode] = useState(false);
  const [savedSkills, setSavedSkills] = useState(readSkills);
  const [draftSkills, setDraftSkills] = useState(savedSkills);
  const skills = editMode ? draftSkills : savedSkills;

  const averages = useMemo(() => skills.map((group) => ({
    ...group,
    average: Math.round(group.skills.reduce((sum, skill) => sum + Number(skill.progress || 0), 0) / Math.max(group.skills.length, 1)),
  })), [skills]);

  const updateGroup = (groupIndex, patch) => {
    setDraftSkills((prev) => prev.map((group, index) => (index === groupIndex ? { ...group, ...patch } : group)));
  };

  const updateSkill = (groupIndex, skillIndex, patch) => {
    setDraftSkills((prev) => prev.map((group, index) => {
      if (index !== groupIndex) return group;
      return {
        ...group,
        skills: group.skills.map((skill, innerIndex) => (innerIndex === skillIndex ? { ...skill, ...patch } : skill)),
      };
    }));
  };

  const addSkill = (groupIndex) => {
    setDraftSkills((prev) => prev.map((group, index) => (
      index === groupIndex ? { ...group, skills: [...group.skills, { name: 'New Skill', progress: 50 }] } : group
    )));
  };

  const deleteSkill = (groupIndex, skillIndex) => {
    setDraftSkills((prev) => prev.map((group, index) => (
      index === groupIndex ? { ...group, skills: group.skills.filter((_, innerIndex) => innerIndex !== skillIndex) } : group
    )));
  };

  const addCategory = () => {
    setDraftSkills((prev) => [...prev, { category: 'New Category', color: '#1a6ef5', skills: [{ name: 'New Skill', progress: 50 }] }]);
  };

  const saveSkills = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftSkills));
    setSavedSkills(draftSkills);
    setEditMode(false);
    try {
      await axios.put(`${API_BASE}/skills`, { skills: draftSkills });
      notify('Skills saved successfully.', { duration: 3000 });
    } catch {
      notify('Skills saved locally. Backend sync failed.', { duration: 4000 });
    }
  };

  const cancelEdit = () => {
    setDraftSkills(savedSkills);
    setEditMode(false);
  };

  return (
    <Widget
      id="skills"
      title="Skills"
      icon={IconFlame}
      iconBg="#e050a0"
      headerActions={
        <button
          type="button"
          className="flex h-6 items-center gap-1 rounded-md bg-white/45 px-2 text-xs font-semibold text-[#1a3870]"
          onClick={() => {
            setDraftSkills(savedSkills);
            setEditMode((prev) => !prev);
          }}
        >
          <IconEdit size={13} />
          Edit
        </button>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-white/35 p-4">
          <RadarChart groups={averages} />
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {averages.map((group) => (
              <div key={group.category} className="flex items-center justify-between rounded bg-white/35 px-2 py-1">
                <span>{group.category}</span>
                <strong>{group.average}%</strong>
              </div>
            ))}
          </div>
        </div>

        {skills.map((group, groupIndex) => (
          <section key={`${group.category}-${groupIndex}`} className="rounded-xl bg-white/32 p-4">
            <div className="mb-3 flex items-center justify-between">
              {editMode ? (
                <input
                  value={group.category}
                  onChange={(event) => updateGroup(groupIndex, { category: event.target.value })}
                  className="rounded bg-white/70 px-2 py-1 text-sm font-semibold outline-none"
                />
              ) : (
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: group.color }}>{group.category}</h3>
              )}
              <span className="text-xs text-[#587397]">{group.skills.length} skills</span>
            </div>

            <div className="space-y-3">
              {group.skills.map((skill, skillIndex) => (
                <div key={`${skill.name}-${skillIndex}`} className="border-t border-white/35 pt-3 first:border-t-0 first:pt-0">
                  {editMode ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={skill.name}
                        onChange={(event) => updateSkill(groupIndex, skillIndex, { name: event.target.value })}
                        className="min-w-0 flex-1 rounded bg-white/70 px-2 py-1 text-xs outline-none"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.progress}
                        onChange={(event) => updateSkill(groupIndex, skillIndex, { progress: Number(event.target.value) })}
                        className="w-24 accent-[var(--accent-color)]"
                      />
                      <span className="w-9 text-right text-xs">{skill.progress}%</span>
                      <button type="button" onClick={() => deleteSkill(groupIndex, skillIndex)} className="rounded bg-white/40 p-1">
                        <IconX size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1a3870]">{skill.name}</span>
                        <span className="text-[#587397]">{level(skill.progress)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/55">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: group.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.progress}%` }}
                          transition={{ duration: 0.8, delay: skillIndex * 0.08, ease: 'easeOut' }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <button type="button" onClick={() => addSkill(groupIndex)} className="mt-3 flex items-center gap-1 rounded-lg bg-white/45 px-3 py-2 text-xs font-semibold">
                <IconPlus size={14} />
                Add Skill
              </button>
            )}
          </section>
        ))}

        {editMode && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addCategory} className="flex items-center gap-1 rounded-lg bg-white/45 px-3 py-2 text-xs font-semibold">
              <IconPlus size={14} />
              Add Category
            </button>
            <button type="button" onClick={saveSkills} className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-white" style={{ background: 'var(--accent-color)' }}>
              <IconDeviceFloppy size={14} />
              Save
            </button>
            <button type="button" onClick={cancelEdit} className="rounded-lg bg-white/45 px-3 py-2 text-xs font-semibold">
              Cancel
            </button>
          </div>
        )}
      </div>
    </Widget>
  );
}
