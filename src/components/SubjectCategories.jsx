import React from 'react';
import { 
  Code, Calculator, Database, Cpu, Terminal, 
  BrainCircuit, TrendingUp, Sparkles, Binary, Network, LineChart,
  BookMarked, ArrowUpRight
} from 'lucide-react';

export const CATEGORIES_DATA = [
  {
    id: 'ds',
    name: 'Data Science',
    filterSubject: 'Data Science',
    icon: <Database size={26} />,
    color: '#C9C17C', bg: 'rgba(201, 193, 124, 0.15)',
    topics: ['Statistical Modeling', 'Exploratory Analysis', 'Pipelines', 'Predictive Modeling'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    filterSubject: 'Machine Learning',
    icon: <Sparkles size={26} />,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    topics: ['Supervised Learning', 'Neural Networks', 'Model Evaluation', 'Deep Architectures'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'algo',
    name: 'Algorithms & Data Structures',
    filterSubject: 'Algorithms and Data Structures',
    icon: <Binary size={26} />,
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
    topics: ['Algorithm Design', 'Dynamic Programming', 'Graph Theory', 'Optimization'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    filterSubject: 'Artificial Intelligence',
    icon: <BrainCircuit size={26} />,
    color: '#d946ef',
    bg: 'rgba(217, 70, 239, 0.12)',
    topics: ['Edge AI Systems', 'AI Auditing', 'Ethics & Philosophy', 'Cognitive Computing'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'python',
    name: 'Python Programming',
    filterSubject: 'Python Programming',
    icon: <Code size={26} />,
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
    topics: ['Python 3 Foundations', 'Computational Problem Solving', 'Scientific Stacks', 'Automations'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'analysis',
    name: 'Data Analysis & Mining',
    filterSubject: 'Data Analysis and Data Mining',
    icon: <LineChart size={26} />,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    topics: ['Advanced Data Analysis', 'Mining Paradigms', 'Elementary Principles', 'Data Wrangling'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'cpp',
    name: 'C and C++',
    filterSubject: 'C and C++',
    icon: <Cpu size={26} />,
    color: '#C9C17C', bg: 'rgba(201, 193, 124, 0.15)',
    topics: ['High Performance Systems', 'Memory Management', 'Modern C++20', 'Concurrency'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'js',
    name: 'JavaScript & Web',
    filterSubject: 'JavaScript',
    icon: <TrendingUp size={26} />,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    topics: ['Modern JavaScript', 'Frontend Paradigms', 'Async Event Loop', 'Fullstack Node.js'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'stats',
    name: 'Statistics',
    filterSubject: 'Statistics',
    icon: <Network size={26} />,
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
    topics: ['Bayesian Inference', 'Probability Theory', 'Hypothesis Testing', 'Statistical Learning'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'math',
    name: 'Mathematics',
    filterSubject: 'Mathematics',
    icon: <Calculator size={26} />,
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.12)',
    topics: ['Linear Algebra', 'Multivariate Calculus', 'Discrete Mathematics', 'Numerical Methods'],
    count: 'FreeComputerBooks'
  },
  {
    id: 'linux',
    name: 'Linux and Unix',
    filterSubject: 'Linux and Unix',
    icon: <Terminal size={26} />,
    color: '#84cc16',
    bg: 'rgba(132, 204, 22, 0.12)',
    topics: ['Kernel Internals', 'Shell Scripting', 'POSIX Administration', 'System Calls'],
    count: 'FreeComputerBooks'
  }
];

export default function SubjectCategories({ onSelectSubject, selectedSubject }) {
  const handleCategoryClick = (subjectName) => {
    if (onSelectSubject) {
      onSelectSubject(subjectName);
    }
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="categories-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-block">
          <div className="section-badge">
            <BookMarked size={14} />
            <span>Academic Curricula</span>
          </div>
          <h2 className="section-title">Explore Academic Disciplines</h2>
          <p className="section-subtitle">
            Curated textbook collections aligned with university course syllabi, open-access curricula, and foundational scientific study.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-cards-grid">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedSubject === cat.filterSubject;

            return (
              <div
                key={cat.id}
                className={`category-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleCategoryClick(cat.filterSubject)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCategoryClick(cat.filterSubject);
                }}
              >
                <div className="category-card-top">
                  <div
                    className="category-icon-box"
                    style={{ color: cat.color, backgroundColor: cat.bg }}
                  >
                    {cat.icon}
                  </div>
                  <span className="category-volume-count">{cat.count}</span>
                </div>

                <h3 className="category-card-title">{cat.name}</h3>

                <div className="category-topics-pills">
                  {cat.topics.map((t, idx) => (
                    <span key={idx} className="category-mini-pill">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="category-card-footer">
                  <span className="view-text">Explore Textbooks</span>
                  <ArrowUpRight size={16} className="arrow-icon" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

