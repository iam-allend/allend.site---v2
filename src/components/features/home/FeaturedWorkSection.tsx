import GlassCard from '@/components/shared/GlassCard';

export default function FeaturedWorkSection() {
  const projects = [
    {
      id: 1,
      title: 'Ritecs Website',
      description: 'Full-stack Research Platform',
      emoji: '🚀',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      tags: ['Laravel', 'MySQL', 'Bootstrap'],
      span: 'lg:col-span-8 lg:row-span-2',
    },
    {
      id: 2,
      title: 'Lapak Siswa',
      description: 'E-commerce',
      emoji: '🛒',
      gradient: 'from-purple-500 to-pink-500',
      tags: ['CI4', 'MySQL'],
      span: 'lg:col-span-4',
    },
    // Add more projects...
  ];

  return (
    <section id="work" className="relative px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Featured <span className="neon-text">Work</span>
          </h2>
          <p className="text-gray-400 text-lg">
            A curated selection of my best projects
          </p>
        </div>

        {/* Bento Grid - Simple version for now */}
        <div className="grid lg:grid-cols-12 gap-6">
          {projects.map((project) => (
            <GlassCard
              key={project.id}
              variant="strong"
              hover
              className={`${project.span} p-6`}
            >
              <div className="text-4xl mb-3">{project.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="glass px-2 py-1 rounded text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}