'use client';

import { Field } from '@/types/project';

interface ProjectFilterProps {
  fields: Field[];
  activeField: string;
  onFieldChange: (fieldId: string) => void;
  projectCounts?: Record<string, number>;
}

export default function ProjectFilter({
  fields,
  activeField,
  onFieldChange,
  projectCounts = {},
}: ProjectFilterProps) {
  const allCount = Object.values(projectCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="sticky top-20 z-40 glass rounded-2xl p-2 mb-12 flex flex-wrap gap-2 justify-center">
      {/* All Projects */}
      <button
        onClick={() => onFieldChange('all')}
        className={`px-6 py-3 rounded-xl font-medium transition-all ${
          activeField === 'all'
            ? 'bg-[#00D9FF] text-black'
            : 'text-gray-400 hover:text-white hover:glass-strong'
        }`}
      >
        All Projects
        {allCount > 0 && (
          <span className="ml-2 text-xs opacity-70">({allCount})</span>
        )}
      </button>

      {/* Field Categories */}
      {fields.map((field) => {
        const count = projectCounts[field.title] || 0;
        
        return (
          <button
            key={field.id}
            onClick={() => onFieldChange(field.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeField === field.id
                ? 'bg-[#00D9FF] text-black'
                : 'text-gray-400 hover:text-white hover:glass-strong'
            }`}
          >
            {field.title}
            {count > 0 && (
              <span className="ml-2 text-xs opacity-70">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}