export default function FeaturedWorkSection() {
  const projects = [
    {
      id: 1,
      type: 'large',
      title: 'Ritecs Website',
      description: 'Full-stack Research Platform',
      fullDescription: 'Community platform with CMS and admin dashboard',
      emoji: '🚀',
      gradient: 'from-[#00D9FF]/20 to-blue-500/20',
      tags: ['Laravel', 'MySQL', 'Bootstrap'],
      gridClass: 'bento-item-1',
    },
    {
      id: 2,
      type: 'small',
      title: 'Lapak Siswa',
      description: 'E-commerce',
      emoji: '🛒',
      iconGradient: 'from-purple-500 to-pink-500',
      tags: ['CI4', 'MySQL'],
      gridClass: 'bento-item-2',
    },
    {
      id: 3,
      type: 'small',
      title: 'Mobile App',
      description: 'Flutter',
      emoji: '📱',
      iconGradient: 'from-green-500 to-emerald-500',
      tags: ['Flutter', 'Firebase'],
      gridClass: 'bento-item-3',
    },
    {
      id: 4,
      type: 'medium',
      title: 'Design Works',
      description: 'Social media & branding',
      emoji: '🎨',
      gradient: 'from-green-500/20 to-emerald-500/20',
      gridClass: 'bento-item-4',
    },
    {
      id: 5,
      type: 'small',
      title: 'Gov Portal',
      description: 'Web Dev',
      emoji: '🏛️',
      iconGradient: 'from-orange-500 to-red-500',
      tags: ['PHP', 'MySQL'],
      gridClass: 'bento-item-5',
    },
    {
      id: 6,
      type: 'more',
      gridClass: 'bento-item-6',
    },
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

        {/* Bento Grid */}
        <div className="bento-grid">
          {projects.map((project) => {
            // Large Featured Project
            if (project.type === 'large') {
              return (
                <div
                  key={project.id}
                  className={`${project.gridClass} glass-strong rounded-2xl overflow-hidden hover-lift project-card group cursor-pointer`}
                >
                  <div className="h-full flex flex-col">
                    <div className={`flex-1 bg-gradient-to-br ${project.gradient} p-8 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-6xl mb-4">{project.emoji}</div>
                        <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-300">{project.description}</p>
                      </div>
                    </div>
                    <div className="p-6 border-t border-white/10">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="glass px-2 py-1 rounded text-xs text-[#00D9FF]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">
                        {project.fullDescription}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            // Small Cards
            if (project.type === 'small') {
              return (
                <div
                  key={project.id}
                  className={`${project.gridClass} glass-strong rounded-2xl p-6 hover-lift project-card cursor-pointer`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.iconGradient} flex items-center justify-center text-2xl`}>
                      {project.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                      <span className="text-xs text-gray-400">
                        {project.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="glass px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            // Medium Card
            if (project.type === 'medium') {
              return (
                <div
                  key={project.id}
                  className={`${project.gridClass} glass-strong rounded-2xl overflow-hidden hover-lift project-card cursor-pointer`}
                >
                  <div className="h-full flex flex-col">
                    <div className={`flex-1 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="text-5xl mb-3">{project.emoji}</div>
                        <h3 className="text-xl font-bold">{project.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/10">
                      <p className="text-sm text-gray-400">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            // More Projects Card
            if (project.type === 'more') {
              return (
                <div
                  key={project.id}
                  className={`${project.gridClass} glass-strong rounded-2xl p-6 hover-lift flex items-center justify-center cursor-pointer group`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                      +5
                    </div>
                    <div className="text-sm text-gray-400">More Projects</div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="magnetic px-8 py-4 glass-strong rounded-lg font-semibold hover:scale-105 transition-all border border-[#00D9FF]/30">
            View All Projects →
          </button>
        </div>
      </div>
    </section>
  );
}