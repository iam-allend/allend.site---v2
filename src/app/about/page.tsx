'use client';

import Image from 'next/image';


import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';



export default function AboutPage() {
  // Skills Data
  const coreSkills = [
    { name: 'PHP', category: 'Backend' },
    { name: 'Laravel', category: 'Backend' },
    { name: 'Next.js', category: 'FullStack' },
    { name: 'React.js', category: 'FrontEnd' },
    { name: 'MySQL', category: 'Database' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'Figma', category: 'Design' },
    { name: 'Adobe Illustrator', category: 'Design' },
  ];

  const additionalSkills = [
    'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS',
    'WordPress', 'Flutter', 'Kotlin', 'Java',
    'Adobe Photoshop', 'Adobe Lightroom', 'Git/GitHub',
  ];

  const softSkills = [
    'Communication & Copywriting',
    'Time Management',
    'Leadership & Team Collaboration',
    'Creative Problem Solving',
    'Fast Adaptation',
  ];

  // Experience Data
  const experiences = [
    {
      id: 1,
      title: 'FullStack Web Developer',
      company: 'Ritecs (Internship)',
      period: 'Aug 2025 - Dec 2025',
      current: false,
      description: [
        'Developed Ritecs.org website end-to-end, from UI/UX design to data management',
        'Designed and implemented modules: Book Publishing, Journals, Awarding, Membership, and Services',
        'Built member management system with structured CRUD and access rights',
        'Ensured performance & security through optimized queries and input validation',
        'Connected frontend-backend seamlessly using API/AJAX',
      ],
    },
    {
      id: 2,
      title: 'Graphic Designer & Content Creator',
      company: 'iPhone Service Solution',
      period: 'Jul 2023 - Present',
      current: true,
      description: [
        'Designed promotional materials for social media: feeds, posters, banners, brochures',
        'Produced 350+ feed designs & 350+ video reels for Instagram & TikTok',
        'Contributed to 150% account growth and revenue increase within 1.5 years',
      ],
    },
    {
      id: 3,
      title: 'Freelance Course Tutor',
      company: 'Eduprima Indonesia',
      period: 'Jun 2023 - Present',
      current: true,
      description: [
        'Taught 10+ students in Graphic Design & Web Programming',
        'Provided guidance, mentoring, and regular performance reviews',
        'Achieved an average 9/10 satisfaction rating',
      ],
    },
    {
      id: 4,
      title: 'Frontend Web Developer',
      company: 'Educa Studio - Gamelab (Internship)',
      period: 'Jan 2022 - Mar 2022',
      current: false,
      description: [
        'Built dashboard pages, user management system, and inventory modules',
        'Developed responsive layouts for cross-platform compatibility',
      ],
    },
  ];

  // Education Data
  const education = [
    {
      id: 1,
      title: 'Associate Degree (D3) in Informatics Engineering',
      institution: 'Universitas Dian Nuswantoro',
      period: 'Jul 2023 - Present',
      current: true,
      description: [
        'Focused on Web Development (Laravel, CodeIgniter, API, JSON)',
        'Learning Mobile Development (Kotlin, Java, Flutter)',
        'Active as Head of Multimedia Division, Informatics Engineering Student Association',
      ],
    },
    {
      id: 2,
      title: 'Software Engineering',
      institution: 'SMK Negeri 1 Kandeman',
      period: 'Mar 2020 - Mar 2023',
      current: false,
      description: [
        '1st Place, Augmented Reality Project (2021)',
        'Batang District Delegate, SMK Digital Bootcamp (Bali, 2022)',
        'Outstanding Student Award, Class of 2020/2023',
        '3rd Place, 3D Art Game (2022)',
      ],
    },
  ];

  return (

<>
<CustomCursor />
<AnimatedBackground />
<Header />
<main>

    <div className="min-h-screen pt-20 px-6 py-12 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left - Profile */}
          <div className="flex flex-col justify-center">
            {/* Profile Image */}
            <div className="relative w-64 h-64 mx-auto lg:mx-0 mb-8">
              <div className="glass-strong rounded-full w-full h-full border-4 border-[#00D9FF]/30 flex items-center justify-center text-8xl">
                👨‍💻
              </div>
              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2 glass-strong px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00D9FF] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Available</span>
              </div>
            </div>

            {/* Name & Title */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                Anur <span className="neon-text">Mustakim</span>
              </h1>
              <p className="text-xl text-gray-400 mb-4">
                Web Developer & Graphic Designer
              </p>
              <p className="text-gray-500 flex items-center justify-center lg:justify-start gap-2">
                📍 Semarang, Central Java, Indonesia
              </p>
            </div>

            {/* Download CV */}
            <div className="mt-8 flex gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-[#00D9FF] text-black rounded-lg font-semibold neon-glow hover:scale-105 transition-all">
                Download CV
              </button>
              <button className="px-8 py-4 glass-strong rounded-lg font-semibold hover:scale-105 transition-all">
                Contact Me
              </button>
            </div>
          </div>

          {/* Right - Bio */}
          <div className="glass-strong rounded-3xl p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 text-[#00D9FF]">About Me</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Web Developer & Graphic Designer focusing on <strong>Laravel</strong>, <strong>CodeIgniter 4</strong>, and modern web technologies. 
              Experienced in producing <strong>350+ designs</strong> and <strong>350+ video reels</strong>, 
              contributing to <strong>150% account growth</strong> and revenue increase.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Taught <strong>10+ students</strong> with a <strong>9/10 satisfaction rating</strong>, 
              and developed features such as dashboard, user management, and inventory modules 
              during internships.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Recognized as a skilled problem solver, adaptable, and committed to delivering 
              <strong className="text-[#00D9FF]"> functional and creative digital solutions</strong>.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Skills & <span className="neon-text">Expertise</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Core Skills */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-[#00D9FF]">Core Skills</h3>
              <div className="space-y-3">
                {coreSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="glass px-2 py-1 rounded text-xs text-gray-500">
                      {skill.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Skills */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-[#00D9FF]">Additional Skills</h3>
              <div className="flex flex-wrap gap-2">
                {additionalSkills.map((skill) => (
                  <span key={skill} className="glass px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-[#00D9FF]">Soft Skills</h3>
              <ul className="space-y-2">
                {softSkills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-gray-300">
                    <span className="text-[#00D9FF] mt-1">✓</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Work <span className="neon-text">Experience</span>
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#00D9FF]/30 hidden lg:block"></div>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative lg:pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-[#00D9FF] border-4 border-black hidden lg:block"></div>

                  <div className="glass-strong rounded-2xl p-6 hover-lift">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#00D9FF]">{exp.title}</h3>
                        <p className="text-gray-400">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="glass px-3 py-1 rounded-full text-sm">
                          {exp.period}
                        </span>
                        {exp.current && (
                          <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="text-[#00D9FF] mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Timeline */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="neon-text">Education</span>
          </h2>

          <div className="space-y-8">
            {education.map((edu) => (
              <div key={edu.id} className="glass-strong rounded-2xl p-6 hover-lift">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#00D9FF]">{edu.title}</h3>
                    <p className="text-gray-400">{edu.institution}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="glass px-3 py-1 rounded-full text-sm">
                      {edu.period}
                    </span>
                    {edu.current && (
                      <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <ul className="space-y-2">
                  {edu.description.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="text-[#00D9FF] mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

</main>
<Footer />
</>
  );
}