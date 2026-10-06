import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import './index.css';

/* ═══════════════════════════════════════════
   CONTENT (from resume)
   ═══════════════════════════════════════════ */

const EMAIL = 'sejalc489@gmail.com';
const PHONE = '+91-8595551921';
const GITHUB = 'https://github.com/sejal2928';
const LINKEDIN = 'https://linkedin.com/in/sejal-chaudhary-85a566236';
const RESUME = '/resume.pdf';

// Opens Gmail's compose window (in the browser) instead of the default mail app
const gmailLink = ({ subject = '', body = '' } = {}) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}` +
  (subject ? `&su=${encodeURIComponent(subject)}` : '') +
  (body ? `&body=${encodeURIComponent(body)}` : '');

const PAGES = [
  { id: 'home', file: 'home.jsx', color: 'var(--blue)' },
  { id: 'skills', file: 'skills.json', color: 'var(--yellow)' },
  { id: 'experience', file: 'experience.md', color: 'var(--green)' },
  { id: 'projects', file: 'projects.js', color: 'var(--orange)' },
  { id: 'certifications', file: 'certs.pem', color: 'var(--cyan)' },
  { id: 'contact', file: 'contact.sh', color: 'var(--purple)' },
];

const ROLES = ['Software Engineer', 'React.js & Next.js Developer', 'Node.js API Builder', 'AWS Cloud Developer'];

const SKILLS = [
  { key: 'programming_languages', items: ['C++', 'JavaScript', 'SQL', 'HTML5', 'CSS3'] },
  { key: 'frameworks_libraries', items: ['React.js', 'React Native', 'Next.js', 'Vue.js'] },
  { key: 'software_development', items: ['Data Structures & Algorithms', 'Problem Solving', 'Debugging', 'Software Development'] },
  { key: 'apis_web', items: ['REST APIs', 'API Integration', 'JSON', 'Responsive Web Development'] },
  { key: 'databases', items: ['MySQL', 'MongoDB', 'AWS RDS'] },
  { key: 'dev_tools', items: ['Git', 'GitHub'] },
  {
    key: 'cloud_deployment',
    wide: true,
    items: ['AWS EC2', 'S3', 'Lambda', 'IAM', 'AMI', 'RDS', 'Load Balancing', 'Microsoft Azure', 'CI/CD'],
  },
];

const MARQUEE = ['React.js', 'Next.js', 'Node.js', 'React Native', 'Vue.js', 'JavaScript', 'C++', 'SQL', 'REST APIs', 'MongoDB', 'MySQL', 'AWS EC2', 'AWS S3', 'Lambda', 'RDS', 'Microsoft Azure', 'CI/CD', 'Git', 'HTML5', 'CSS3'];

const EXPERIENCE = [
  {
    role: 'Associate Software Developer',
    company: '61C Studios',
    date: 'Feb 2026 — Present',
    hash: 'a3f9c21',
    current: true,
    stack: ['Next.js', 'React', 'Node.js', 'MongoDB', 'AWS S3'],
    points: [
      'Built dynamic Films, Design & Photography modules using Next.js and reusable React components, reducing duplicate effort by 30%.',
      'Optimized media delivery with Next.js image optimization and lazy loading, reducing average image payload by 40%.',
      'Developed Node.js REST APIs and MongoDB CRUD workflows for a custom CMS and dynamic content management.',
      'Integrated AWS S3 for media storage and built scroll-triggered animations for interactive content experiences.',
    ],
  },
  {
    role: 'Associate Software Developer',
    company: 'Genefied.ai',
    date: 'Jan 2025 — Feb 2026',
    hash: '7be04d8',
    stack: ['React', 'Node.js', 'AWS RDS', 'AWS', 'REST APIs'],
    points: [
      'Developed retailer loyalty modules across client back panels — Gift Catalogue, SKU Usage Statistics, KYC and Campaign — supporting end-to-end client and gifting operations used by 30,000+ active users.',
      'Integrated REST APIs with Node.js and RDS, enabling real-time retailer, points and reward updates across applications while reducing data inconsistencies by 25%.',
      'Built responsive dashboards and reusable UI components across client panels, improving portal usability and reducing recurring UI defects by 20%.',
      'Deployed and optimized production applications on AWS, improving API-driven portal responsiveness by 25% and development turnaround by 20% with cross-functional teams.',
    ],
  },
  {
    role: 'Developer Intern',
    company: 'IBM',
    date: 'Jun 2024 — Jul 2024',
    hash: 'e51a6f0',
    stack: ['C++', 'APIs', 'Cloud Deployment'],
    points: [
      'Contributed to a cloud-based Smart Parking model — C++, API integration, cloud deployment and real-time data handling — enabling dynamic parking availability and improving data-update responsiveness by 25%.',
      'Implemented data validation, API testing, debugging and integration workflows, analyzing real-time data inconsistencies and update failures to improve reliability and reduce integration errors by 15%.',
    ],
  },
];

const PROJECTS = [
  {
    name: 'HomePlant-Monitoring-System',
    repo: 'https://github.com/sejal2928/HomePlant-Monitoring-System',
    title: 'Home Plant Monitoring System',
    label: 'IoT',
    date: 'Aug 2023 — Dec 2023',
    lang: 'C/C++',
    langColor: 'var(--green)',
    desc: 'IoT-based system using Arduino and sensors to collect and monitor real-time plant and environmental conditions, enabling automated tracking of plant health.',
    tags: ['Arduino', 'Sensors', 'C/C++', 'IoT'],
  },
  {
    name: 'Heart-Disease-Prediction-Model',
    repo: 'https://github.com/sejal2928/Heart-Disease-Prediction-Model',
    title: 'Heart Disease Prediction',
    label: 'Machine Learning',
    date: 'Feb 2024 — Apr 2024',
    lang: 'Python',
    langColor: 'var(--blue)',
    desc: 'Python-based machine learning model that predicts heart disease risk from patient health data using Random Forest and Gradient Boosting algorithms.',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Random Forest', 'Gradient Boosting'],
  },
];

const CERTIFICATIONS = [
  {
    id: 'aws',
    title: 'Cloud Operations on AWS',
    issuer: 'CloudThat · AWS',
    file: 'cloudthat-aws.crt',
    tags: ['AWS', 'Cloud Operations'],
    color: 'var(--orange)',
    url: 'https://drive.google.com/file/d/1L9CJ5QeYyQukw8M3LLrgcfSv2mc0nN3o/view',
  },
  {
    id: 'ibm',
    title: 'IBM Developer Internship',
    issuer: 'IBM',
    file: 'ibm.crt',
    tags: ['Cloud', 'C++', 'APIs'],
    color: 'var(--blue)',
    url: 'https://drive.google.com/file/d/1bOQISdyeEcAwL2X856N84VGY4OdNveo5/view',
  },
  {
    id: 'devops',
    title: 'Introduction to DevOps',
    issuer: 'IBM · Coursera',
    file: 'ibm-devops.crt',
    tags: ['DevOps', 'CI/CD', 'Agile'],
    color: 'var(--green)',
    url: 'https://drive.google.com/file/d/1Mjzhe0Y5LMl07ttYdArVjMqHbdIIi09D/view',
  },
  {
    id: 'aws-academy',
    title: 'Cloud Developing & Cloud Architecting',
    issuer: 'AWS Academy',
    file: 'aws-academy.crt',
    tags: ['AWS', 'Architecture'],
    color: 'var(--yellow)',
    url: 'https://drive.google.com/file/d/1i8MsRAR5k1KeXEmpl-OhsdTF7MdB2FBe/view?usp=sharing',
  },
];

const EDUCATION = [
  {
    school: 'University of Petroleum and Energy Studies',
    detail: 'Bachelor in Computer Science Engineering · CGPA 7.5/10',
    place: 'Dehradun, Uttarakhand',
    date: '2021 — 2025',
  },
];

/* Highlights metrics like 30%, 30,000+ inside bullet text */
const withMetrics = (text) =>
  text.split(/(\d[\d,]*\+?%?)/g).map((part, i) =>
    /^\d[\d,]*\+?%?$/.test(part) && (part.includes('%') || part.includes('+'))
      ? <span key={i} className="metric">{part}</span>
      : part
  );

const EASE = [0.16, 1, 0.3, 1];
const VIEW = { once: true, amount: 0.2 };

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════ */

/* ─────────── Apple-style inertia scrolling ───────────
   Wheel/trackpad input is eased toward its target with a frame-rate
   independent lerp. Native scroll position is still used, so sticky
   sections, keyboard, scrollbar and touch keep working. */
const smooth = { to: null };

function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || touch) return;

    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = null;
    let last = 0;
    const max = () => root.scrollHeight - window.innerHeight;
    const clamp = (v) => Math.max(0, Math.min(max(), v));

    const tick = (t) => {
      const dt = last ? Math.min(t - last, 50) : 16.7;
      last = t;
      const ease = 1 - Math.pow(1 - 0.085, dt / 16.7);
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.4) current = target;
      window.scrollTo(0, current);
      if (current !== target) raf = requestAnimationFrame(tick);
      else { raf = null; last = 0; }
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onWheel = (e) => {
      if (e.ctrlKey) return; // pinch-zoom
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal gestures
      const el = e.target instanceof Element ? e.target.closest('textarea, [data-native-scroll]') : null;
      if (el && el.scrollHeight > el.clientHeight) return;
      e.preventDefault();
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 40;
      else if (e.deltaMode === 2) d *= window.innerHeight;
      if (!raf) current = window.scrollY;
      target = clamp(target + d);
      start();
    };
    // keep in sync when scrolling by keyboard / scrollbar / find-in-page
    const onScroll = () => { if (!raf) target = current = window.scrollY; };

    smooth.to = (y) => { if (!raf) current = window.scrollY; target = clamp(y); start(); };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      smooth.to = null;
      root.style.scrollBehavior = prevBehavior;
    };
  }, []);
}

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - (id === 'home' ? 0 : 52);
  if (smooth.to) smooth.to(y);
  else window.scrollTo({ top: y, behavior: 'smooth' });
};

/* Scroll-scrubbed reveal: progress is tied to the scroll position
   (like apple.com) rather than firing once. */
const Reveal = ({ children, y = 70, x = 0, scale = 0.96, className = '', start = 'start 98%', end = 'start 62%' }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: [start, end] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const ty = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const tx = useTransform(scrollYProgress, [0, 1], [x, 0]);
  const sc = useTransform(scrollYProgress, [0, 1], [scale, 1]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { opacity, y: ty, x: tx, scale: sc }}
    >
      {children}
    </motion.div>
  );
};

/* Word-by-word highlight tied to scroll (apple.com "statement" effect) */
const ScrollWord = ({ children, progress, range, accent }) => {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ['blur(3px)', 'blur(0px)']);
  return (
    <motion.span className={`sw ${accent ? 'grad' : ''}`} style={{ opacity, filter: blur }}>
      {children}{' '}
    </motion.span>
  );
};

const STATEMENT = 'I build *reliable,* *scalable* applications with a strong focus on *quality* and *performance* — clean code, continuous learning and impactful software, built together with great teams.';

const Statement = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = STATEMENT.split(' ');
  const labelOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const exitScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.94]);
  const exitOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0.3]);

  return (
    <section className="statement" ref={ref}>
      <div className="statement-sticky">
        <motion.div className="container statement-inner" style={{ scale: exitScale, opacity: exitOpacity }}>
          <motion.p className="statement-label" style={{ opacity: labelOpacity }}>
            <span className="tk-c">/* about.md */</span>
          </motion.p>
          <p className="statement-text">
            {words.map((w, i) => {
              const accent = w.startsWith('*');
              const clean = w.replace(/\*/g, '');
              const a = 0.06 + (i / words.length) * 0.62;
              return (
                <ScrollWord key={i} progress={scrollYProgress} range={[a, a + 0.08]} accent={accent}>
                  {clean}
                </ScrollWord>
              );
            })}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const SectionHead = ({ num, title, comment }) => (
  <Reveal className="section-head" y={90} scale={0.92}>
    <div className="section-title">
      <span className="section-num">{num}.</span>
      <h2>{title}</h2>
      <motion.span
        className="section-rule"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
        viewport={VIEW}
      />
    </div>
    <p className="section-comment">// {comment}</p>
  </Reveal>
);

/* Typing effect that cycles through roles */
const Typewriter = ({ words }) => {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    let t;
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && text === '') {
      setDeleting(false);
      setI((n) => n + 1);
    } else {
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? 40 : 85
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, i, words]);

  return (
    <span className="typewriter">
      {text}
      <span className="caret" />
    </span>
  );
};

const Icon = {
  github: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════
   NAV — editor tab bar
   ═══════════════════════════════════════════ */

const Nav = ({ active, go }) => (
  <motion.header
    className="editor-bar"
    initial={{ y: -60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: EASE }}
  >
    <div className="traffic">
      <span /><span /><span />
    </div>
    <nav className="tabs">
      {PAGES.map((p) => (
        <button key={p.id} className={`tab ${active === p.id ? 'active' : ''}`} onClick={() => go(p.id)}>
          <span className="tab-dot" style={{ background: p.color }} />
          {p.file}
        </button>
      ))}
    </nav>
    <a className="resume-btn" href={RESUME} download="Sejal_Chaudhary_Resume.pdf">
      {Icon.download} resume.pdf
    </a>
  </motion.header>
);

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

const CodeLine = ({ n, children, delay }) => (
  <motion.div
    className="code-line"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <span className="ln">{n}</span>
    <span>{children}</span>
  </motion.div>
);

function useIsWide(min = 900) {
  const [wide, setWide] = useState(typeof window !== 'undefined' ? window.innerWidth >= min : true);
  useEffect(() => {
    const on = () => setWide(window.innerWidth >= min);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [min]);
  return wide;
}

const Hero = ({ go }) => {
  const ref = useRef(null);
  const wide = useIsWide(1025);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Scene 1 (pinned): text drifts away while the code window glides to centre and zooms
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textX = useTransform(scrollYProgress, [0, 0.45], [0, -120]);
  const textScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.9]);
  const codeX = useTransform(scrollYProgress, [0, 0.55], ['0vw', '-22vw']);
  const codeScale = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1.28, 1.36]);
  const codeOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const pinned = wide && !reduce;

  const k = (t) => <span className="tk-k">{t}</span>;
  const p = (t) => <span className="tk-p">{t}</span>;
  const s = (t) => <span className="tk-s">'{t}'</span>;
  const b = (t) => <span className="tk-b">{t}</span>;

  return (
    <section id="home" className={`hero ${pinned ? 'hero--pinned' : ''}`} ref={ref}>
      <div className="hero-sticky">
        <motion.div className="hero-grid" style={pinned ? { scale: gridScale } : undefined} />
        <div className="hero-glow" />

        <div className="hero-inner">
          <motion.div
            className="hero-text"
            style={pinned ? { opacity: textOpacity, x: textX, scale: textScale } : undefined}
          >
            <motion.p className="hero-hello" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <span className="prompt">~/portfolio $</span> whoami
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            >
              Sejal <span className="grad">Chaudhary</span>
            </motion.h1>

            <motion.div className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <span className="tk-k">&gt;</span> <Typewriter words={ROLES} />
            </motion.div>

            <motion.p
              className="hero-intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: EASE }}
            >
              Software Engineer building reliable, scalable applications and solving complex technical
              problems — with a strong focus on quality, performance and clean code.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
            >
              <button className="btn btn-primary" onClick={() => go('contact')}>
                {Icon.mail} Contact me
              </button>
              <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">{Icon.github} GitHub</a>
              <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">{Icon.linkedin} LinkedIn</a>
            </motion.div>
          </motion.div>

          <motion.div
            className="code-wrap"
            style={pinned ? { x: codeX, scale: codeScale, opacity: codeOpacity } : undefined}
          >
            <motion.div
              className="code-window"
              initial={{ opacity: 0, scale: 0.95, rotateY: -12 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
            >
              <div className="cw-bar">
                <div className="traffic"><span /><span /><span /></div>
                <span className="cw-title">sejal.js</span>
              </div>
              <div className="cw-body">
                <CodeLine n={1} delay={1.0}>{k('const')} {b('developer')} {p('=')} {p('{')}</CodeLine>
                <CodeLine n={2} delay={1.1}>&nbsp;&nbsp;name: {s('Sejal Chaudhary')},</CodeLine>
                <CodeLine n={3} delay={1.2}>&nbsp;&nbsp;role: {s('Software Engineer')},</CodeLine>
                <CodeLine n={4} delay={1.3}>&nbsp;&nbsp;stack: [{s('Next.js')}, {s('React')}, {s('Node.js')}, {s('AWS')}],</CodeLine>
                <CodeLine n={5} delay={1.4}>&nbsp;&nbsp;currently: {s('Associate SDE @ 61C Studios')},</CodeLine>
                <CodeLine n={6} delay={1.5}>&nbsp;&nbsp;openToWork: {k('true')},</CodeLine>
                <CodeLine n={7} delay={1.6}>&nbsp;&nbsp;{b('hire')}: () {p('=>')} {b('scrollTo')}({s('#contact')}),</CodeLine>
                <CodeLine n={8} delay={1.7}>{p('};')}</CodeLine>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          className="scroll-cue"
          onClick={() => go('skills')}
          style={pinned ? { opacity: cueOpacity } : undefined}
        >
          <span>scroll</span>
          <span className="mouse"><span /></span>
        </motion.button>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   MARQUEE
   ═══════════════════════════════════════════ */

const Marquee = () => (
  <div className="marquee" aria-hidden="true">
    {[0, 1].map((row) => (
      <div key={row} className={`marquee-row ${row ? 'reverse' : ''}`}>
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-sym">{row ? '#' : '<>'}</span>
              {t}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   SKILLS
   ═══════════════════════════════════════════ */

const Skills = () => (
  <section id="skills" className="section">
    <div className="container">
      <SectionHead num="02" title="Technical Skills" comment="tools I use to turn ideas into products" />

      <div className="skills-layout">
        <Reveal className="json-card" x={-60} y={0} scale={1}>
          <div className="cw-bar">
            <div className="traffic"><span /><span /><span /></div>
            <span className="cw-title">skills.json</span>
          </div>
          <pre className="json-body">
            <span className="tk-p">{'{'}</span>{'\n'}
            {SKILLS.map((sk, i) => (
              <React.Fragment key={sk.key}>
                {'  '}<span className="tk-b">"{sk.key}"</span><span className="tk-p">:</span> <span className="tk-n">{sk.items.length}</span>
                {i < SKILLS.length - 1 ? ',' : ''}{'\n'}
              </React.Fragment>
            ))}
            <span className="tk-p">{'}'}</span>
          </pre>
        </Reveal>

        <div className="skills-grid">
          {SKILLS.map((sk, i) => (
            <Reveal
              key={sk.key}
              className={`skill-card ${sk.wide ? 'wide' : ''}`}
              y={80 + (i % 2) * 40}
              end="start 70%"
            >
              <div className="skill-head">
                <span className="tk-b">{sk.key}</span>
                <span className="skill-count">[{sk.items.length}]</span>
              </div>
              <ul className="chips">
                {sk.items.map((it, j) => (
                  <motion.li
                    key={it}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + j * 0.05 }}
                    viewport={VIEW}
                  >
                    {it}
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   EXPERIENCE — pinned horizontal scroll
   ═══════════════════════════════════════════ */


const ExpCard = ({ job, i }) => (
  <article className="exp-card">
    <div className="exp-top">
      <span className="commit">
        <span className="tk-y">commit</span> {job.hash}
      </span>
      {job.current ? <span className="badge-live">● current</span> : <span className="exp-idx">0{i + 1}/0{EXPERIENCE.length}</span>}
    </div>
    <h3>{job.role}</h3>
    <p className="exp-company">
      <span className="tk-k">@</span>{job.company} <span className="exp-date">· {job.date}</span>
    </p>
    <ul className="exp-points">
      {job.points.map((pt) => <li key={pt}>{withMetrics(pt)}</li>)}
    </ul>
    <div className="exp-stack">
      {job.stack.map((s) => <span key={s}>{s}</span>)}
    </div>
  </article>
);

const Experience = () => {
  const wide = useIsWide();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!wide) return;
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 64));
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('load', measure);
      window.removeEventListener('resize', measure);
    };
  }, [wide]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const xRaw = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const lineScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  if (!wide) {
    return (
      <section id="experience" className="section">
        <div className="container">
          <SectionHead num="03" title="Work Experience" comment="git log --oneline --author=sejal" />
          <div className="exp-stack-mobile">
            {EXPERIENCE.map((job, i) => (
              <Reveal key={job.company}>
                <ExpCard job={job} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="exp-pin-wrap"
      ref={sectionRef}
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="exp-sticky">
        <div className="container">
          <SectionHead num="03" title="Work Experience" comment="git log --oneline --author=sejal   (keep scrolling →)" />
        </div>

        <div className="exp-rail">
          <motion.div className="exp-rail-fill" style={{ scaleX: lineScale }} />
        </div>

        <motion.div className="exp-track" ref={trackRef} style={{ x: xRaw }}>
          {EXPERIENCE.map((job, i) => (
            <div key={job.company} className="exp-slot">
              <span className="exp-node" />
              <ExpCard job={job} i={i} />
            </div>
          ))}
          <div className="exp-end">
            <span className="tk-c">// that's the log so far</span>
            <span className="tk-g">HEAD → main</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   PROJECTS + CERTIFICATIONS
   ═══════════════════════════════════════════ */

const Projects = () => (
  <section id="projects" className="section">
    <div className="container">
      <SectionHead num="04" title="Projects & Education" comment="things I've built and where I learned" />

      <div className="repo-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} className="repo-card" y={100 + i * 50} scale={0.9} end="start 65%">
            <a className="repo-stretch" href={p.repo} target="_blank" rel="noreferrer" aria-label={`${p.title} on GitHub`} />
            <div className="repo-top">
              <span className="repo-name">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.06 1.06A2.49 2.49 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.49 2.49 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.09a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                </svg>
                sejal2928/<strong>{p.name}</strong>
              </span>
              <span className="repo-badge">{p.label}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="repo-tags">
              {p.tags.map((t) => <span key={t}>#{t.toLowerCase().replace(/[^a-z0-9+/]+/g, '-')}</span>)}
            </div>
            <div className="repo-foot">
              <span><span className="lang-dot" style={{ background: p.langColor }} />{p.lang}</span>
              <span>{p.date}</span>
              <a className="repo-link" href={p.repo} target="_blank" rel="noreferrer">{Icon.github} View repo ↗</a>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="edu-card edu-wide" y={60}>
        <span className="edu-label">// education</span>
        {EDUCATION.map((e) => (
          <div key={e.school} className="edu-item">
            <div>
              <h4>{e.school}</h4>
              <p>{e.detail}</p>
              <p className="edu-place">{e.place}</p>
            </div>
            <span>{e.date}</span>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   CERTIFICATIONS — clickable credential cards
   ═══════════════════════════════════════════ */

const CertCard = ({ c }) => {
  const Tag = c.url ? 'a' : 'div';
  const linkProps = c.url ? { href: c.url, target: '_blank', rel: 'noreferrer' } : {};
  return (
    <Tag className={`cert-card ${c.url ? 'is-link' : ''}`} style={{ '--c': c.color }} {...linkProps}>
      <div className="cert-top">
        <span className="cert-seal" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="9" r="6" /><path d="m8.5 13.5-1.5 8 5-3 5 3-1.5-8" /><path d="m9.5 9 1.7 1.7L14.5 7.5" />
          </svg>
        </span>
        <span className="cert-file">{c.file}</span>
      </div>
      <p className="cert-issuer">{c.issuer}</p>
      <h3>{c.title}</h3>
      <div className="cert-tags">
        {c.tags.map((t) => <span key={t}>{t}</span>)}
      </div>
      <div className="cert-foot">
        {c.url ? (
          <>
            <span className="tk-g">✔ verified</span>
            <span className="cert-view">View certificate <span className="arrow">↗</span></span>
          </>
        ) : (
          <span className="tk-c">// link coming soon</span>
        )}
      </div>
    </Tag>
  );
};

const Certifications = () => (
  <section id="certifications" className="section">
    <div className="container">
      <SectionHead num="05" title="Certifications" comment="openssl verify ./certs/*.crt — click a card to view" />
      <div className="cert-grid">
        {CERTIFICATIONS.map((c, i) => (
          <Reveal key={c.id} y={90 + (i % 2) * 40} scale={0.92} end="start 70%">
            <CertCard c={c} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   CONTACT — terminal-style form (FormSubmit)
   ═══════════════════════════════════════════ */

const FORM_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

const ContactForm = () => {
  const empty = { name: '', email: '', subject: '', message: '' };
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || '—',
          message: form.message,
          _subject: `Portfolio enquiry: ${form.subject || `from ${form.name}`}`,
          _replyto: form.email,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === 'false') {
        throw new Error(data.message || 'Something went wrong.');
      }
      setStatus('sent');
      setForm(empty);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <form className="terminal term-form" onSubmit={submit}>
      <div className="cw-bar">
        <div className="traffic"><span /><span /><span /></div>
        <span className="cw-title">zsh — ./send-message.sh</span>
      </div>
      <div className="term-body">
        <p className="tk-c"># fill in the fields and hit enter ↵</p>
        <div className="tf-row">
          <label className="tf-field">
            <span><span className="tk-g">?</span> name:</span>
            <input required value={form.name} onChange={set('name')} placeholder="Jane Doe" />
          </label>
          <label className="tf-field">
            <span><span className="tk-g">?</span> email:</span>
            <input required type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
          </label>
        </div>
        <label className="tf-field">
          <span><span className="tk-g">?</span> subject:</span>
          <input value={form.subject} onChange={set('subject')} placeholder="Job opportunity / freelance project" />
        </label>
        <label className="tf-field">
          <span><span className="tk-g">?</span> message:</span>
          <textarea required rows={4} value={form.message} onChange={set('message')} placeholder="Tell me what you have in mind…" />
        </label>

        <div className="tf-foot">
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {status === 'sending' ? 'sending…' : '$ send --message ↵'}
          </motion.button>
        </div>

        {status === 'sent' && (
          <p className="term-out ok"><span className="tk-g">✔</span> Message sent! I’ll get back to you soon.</p>
        )}
        {status === 'error' && (
          <p className="term-out err">
            <span className="tk-r">✖</span> Couldn’t send ({error}).{' '}
            <a
              href={gmailLink({
                subject: `Portfolio enquiry: ${form.subject || `from ${form.name}`}`,
                body: `${form.message}\n\n— ${form.name}\n${form.email}`,
              })}
              target="_blank"
              rel="noreferrer"
            >
              Send it via Gmail instead
            </a>
          </p>
        )}
      </div>
    </form>
  );
};

const Contact = () => (
  <section id="contact" className="section contact-section">
    <div className="container">
      <SectionHead num="06" title="Enquire / Contact Me" comment="let's build something together" />

      <div className="contact-layout">
        <Reveal className="contact-info" x={-60} y={20} end="start 88%">
          <h3>
            Have a project or a role in mind? <span className="grad">Let’s talk.</span>
          </h3>
          <p>Open to full-time roles, freelance projects and collaborations. I usually reply within a day or two.</p>
          <ul className="contact-list">
            <li>
              <span className="cl-key">email</span>
              <a href={gmailLink()} target="_blank" rel="noreferrer">{EMAIL}</a>
            </li>
            <li>
              <span className="cl-key">phone</span>
              <a href={`tel:${PHONE.replace(/-/g, '')}`}>{PHONE}</a>
            </li>
            <li>
              <span className="cl-key">linkedin</span>
              <a href={LINKEDIN} target="_blank" rel="noreferrer">in/sejal-chaudhary</a>
            </li>
            <li>
              <span className="cl-key">github</span>
              <a href={GITHUB} target="_blank" rel="noreferrer">@sejal2928</a>
            </li>
          </ul>
        </Reveal>

        <Reveal x={60} y={20} end="start 88%">
          <ContactForm />
        </Reveal>
      </div>

      <footer className="footer">
        <span><span className="tk-k">&lt;/&gt;</span> with React & Framer Motion</span>
        <span>© {new Date().getFullYear()} Sejal Chaudhary</span>
      </footer>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */

export default function App() {
  const [active, setActive] = useState('home');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useSmoothScroll();
  const go = scrollToId;

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current = 'home';
      PAGES.forEach((p) => {
        const el = document.getElementById(p.id);
        if (el && el.getBoundingClientRect().top <= mid) current = p.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Nav active={active} go={go} />
      <main>
        <Hero go={go} />
        <Statement />
        <Marquee />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}
