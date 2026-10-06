import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import './index.css';

/* ─────────── Animated Text (char-by-char) ─────────── */
const AnimatedText = ({ text, className = '', delay = 0, stagger = 0.03, style = {}, useAnimate = false }) => {
  const chars = text.split('');
  return (
    <span className={className} style={{ display: 'inline-block', ...style }}>
      {chars.map((char, i) => {
        const animProps = useAnimate
          ? { animate: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' } }
          : {
              whileInView: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' },
              viewport: { once: false, amount: 0.05 },
            };
        return (
          <motion.span
            key={i}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            initial={{ opacity: 0, y: 25, rotateX: -30, filter: 'blur(4px)' }}
            {...animProps}
            transition={{
              delay: delay + i * stagger,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
};

/* ─────────── Magnetic hover ─────────── */
const MagneticWrap = ({ children, strength = 0.3 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────── Cursor follower ─────────── */
const CursorFollower = () => {
  const cx = useMotionValue(-200);
  const cy = useMotionValue(-200);
  const sx = useSpring(cx, { stiffness: 50, damping: 20 });
  const sy = useSpring(cy, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const move = (e) => { cx.set(e.clientX); cy.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return <motion.div className="cursor-follower" style={{ left: sx, top: sy }} />;
};

/* ─────────── Ambient orb ─────────── */
const AmbientOrb = ({ size, top, left, delay = 0, color = 'var(--accent)' }) => (
  <motion.div
    className="floating-shape"
    style={{
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      width: size, height: size, top, left,
    }}
    animate={{
      y: [0, -30, 15, -25, 0],
      x: [0, 15, -8, 20, 0],
      scale: [1, 1.2, 0.9, 1.1, 1],
    }}
    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ─────────── Line draw ─────────── */
const LineDraw = ({ delay = 0, color = 'var(--fg-dim)' }) => (
  <motion.div
    style={{
      width: '50px', height: '1px', background: color,
      margin: '1.5rem auto', transformOrigin: 'left',
    }}
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: false, amount: 0.05 }}
  />
);

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="scroll-container" ref={containerRef}>
      <CursorFollower />

      {/* Progress bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, height: '2px',
          background: 'var(--accent)', width: progressWidth,
          zIndex: 10000, transformOrigin: 'left',
        }}
      />

      {/* ═══════════════════════════════════════
          1. HERO — Dark, centered, dramatic
          ═══════════════════════════════════════ */}
      <section className="section section--hero">
        <motion.div
          className="grid-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 3 }}
        />
        <AmbientOrb size="400px" top="15%" left="5%" color="rgba(196,168,130,0.06)" />
        <AmbientOrb size="300px" top="55%" left="70%" delay={4} color="rgba(196,168,130,0.04)" />

        <motion.div
          style={{ zIndex: 10, textAlign: 'center', perspective: '1000px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ rotateX: -40, opacity: 0, filter: 'blur(8px)' }}
            animate={{ rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h1 className="huge-text">
              <AnimatedText text="SEJAL" stagger={0.07} useAnimate />
            </h1>
          </motion.div>

          <motion.div
            initial={{ rotateX: -40, opacity: 0, filter: 'blur(8px)' }}
            animate={{ rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h1 className="huge-text">
              <AnimatedText text="CHAUDHARY" delay={0.35} stagger={0.04} useAnimate />
            </h1>
          </motion.div>

          <LineDraw delay={0.9} />

          <motion.h2
            className="sub-text"
            initial={{ opacity: 0, letterSpacing: '0.8em', filter: 'blur(6px)' }}
            animate={{ opacity: 1, letterSpacing: '0.3em', filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            SOFTWARE DEVELOPER
          </motion.h2>

          <motion.div
            className="contact-links"
            style={{ justifyContent: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {[
              { label: 'EMAIL', href: 'mailto:sejalc489@gmail.com' },
              { label: 'LINKEDIN', href: 'https://linkedin.com/in/sejal-chaudhary-85a566236' },
              { label: 'GITHUB', href: 'https://github.com/sejal2928' },
            ].map(({ label, href }, i) => (
              <MagneticWrap key={label} strength={0.4}>
                <motion.a
                  href={href}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.a>
              </MagneticWrap>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          2. ABOUT — Inverted cream, word-cascade
          ═══════════════════════════════════════ */}
      <section className="section section--about">
        <div className="dot-bg" />
        <motion.div
          className="marquee-bg"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
        >
          ABOUT · ABOUT · ABOUT · ABOUT · ABOUT · ABOUT · ABOUT ·
        </motion.div>

        <motion.div style={{ zIndex: 10, maxWidth: '750px', textAlign: 'left' }}>
          <motion.span
            className="section-label"
            style={{ display: 'block' }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.05 }}
          >
            01 — About
          </motion.span>

          <LineDraw delay={0.1} color="rgba(26,24,22,0.15)" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.05 }}
            style={{ marginTop: '1rem' }}
          >
            {'Software Developer with hands-on experience in React.js, React Native, JavaScript, and REST API integration, seeking to contribute to scalable and user-focused applications.'
              .split(' ')
              .map((word, i) => (
                <motion.span
                  key={i}
                  className="about-word"
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: 'blur(3px)' },
                    visible: {
                      opacity: 1, y: 0, filter: 'blur(0px)',
                      transition: {
                        delay: 0.2 + i * 0.04,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          3. EDUCATION — Dark, timeline layout
          ═══════════════════════════════════════ */}
      <section className="section section--education">
        <AmbientOrb size="300px" top="10%" left="75%" delay={2} color="rgba(196,168,130,0.05)" />

        <motion.div style={{ zIndex: 10, width: '100%', maxWidth: '800px' }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.05 }}
          >
            02 — Education
          </motion.span>

          <motion.h2
            className="huge-text"
            style={{ textAlign: 'left', marginBottom: '3rem', fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.05 }}
          >
            EDUCATION
          </motion.h2>

          <div className="timeline">
            {[
              {
                school: 'University of Petroleum and Energy Studies',
                location: 'Dehradun, Uttarakhand · 2021 — 2025',
                detail: 'Bachelor in Computer Science Engineering — CGPA: 7.5 / 10',
              },
              {
                school: 'Vidya Mandir Public School',
                location: 'Faridabad, Haryana · 2020 — 2021',
                detail: 'Class XII · PCM — Percentage: 91%',
              },
            ].map((edu, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: false, amount: 0.05 }}
              >
                <h3>{edu.school}</h3>
                <h4>{edu.location}</h4>
                <p>{edu.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          4. EXPERIENCE — Cream, 2×2 grid cards
          ═══════════════════════════════════════ */}
      <section className="section section--experience">
        <div className="dot-bg" />

        <motion.div style={{ zIndex: 10, width: '100%', maxWidth: '1000px', textAlign: 'center' }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.05 }}
          >
            03 — Experience
          </motion.span>

          <motion.h2
            className="huge-text"
            style={{ marginBottom: '3rem', fontSize: 'clamp(2rem, 5vw, 4.5rem)', color: 'var(--fg-dark)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.05 }}
          >
            EXPERIENCE
          </motion.h2>

          <div className="exp-grid">
            {[
              {
                role: 'Frontend Developer',
                company: '61C Studios',
                date: 'Feb 2026 — Present',
                desc: 'Developed responsive web interfaces using React.js, JavaScript, HTML, CSS. Integrated REST APIs.',
              },
              {
                role: 'Associate Software Developer',
                company: 'Genefied.ai',
                date: 'Jan 2025 — Feb 2026',
                desc: 'Contributed to web and mobile applications for clients including Borosil, Bisleri, CG, Century Ply.',
              },
              {
                role: 'Developer Intern',
                company: 'IBM',
                date: 'June 2024 — July 2024',
                desc: 'Developed cloud-based smart parking system as part of a smart city model.',
              },
              {
                role: 'AWS Developer Intern',
                company: 'Corizo',
                date: 'June 2023 — July 2023',
                desc: 'Static website on S3, chatbot for hotel booking using Amazon Lex.',
              },
            ].map((job, i) => (
              <motion.div
                key={i}
                className="exp-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: false, amount: 0.05 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <div className="exp-number">0{i + 1}</div>
                <h3>{job.role}</h3>
                <h4>{job.company} · {job.date}</h4>
                <p>{job.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          5. PROJECTS — Dark, large-numbered list
          ═══════════════════════════════════════ */}
      <section className="section section--projects">
        <AmbientOrb size="350px" top="65%" left="5%" delay={3} color="rgba(196,168,130,0.04)" />

        <motion.div style={{ zIndex: 10, width: '100%', maxWidth: '800px' }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.05 }}
          >
            04 — Projects
          </motion.span>

          <motion.h2
            className="huge-text"
            style={{ textAlign: 'left', marginBottom: '2.5rem', fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            initial={{ opacity: 0, filter: 'blur(12px)', scale: 1.1 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.05 }}
          >
            PROJECTS
          </motion.h2>

          {[
            {
              title: 'Home Plant Monitoring System',
              subtitle: 'IoT · Aug 2023 — Dec 2023',
              desc: 'IoT-based system to monitor plant and environmental conditions using sensor data.',
            },
            {
              title: 'Heart Disease Prediction',
              subtitle: 'Machine Learning · Feb 2024 — April 2024',
              desc: 'Machine learning model to predict heart disease risk using Random Forest and Gradient Boosting.',
            },
          ].map((proj, i) => (
            <motion.div
              key={i}
              className="project-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15 + i * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: false, amount: 0.05 }}
              whileHover={{ x: 10, transition: { duration: 0.3 } }}
            >
              <span className="project-number">0{i + 1}</span>
              <div className="project-content">
                <h3>{proj.title}</h3>
                <h4>{proj.subtitle}</h4>
                <p>{proj.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          6. SKILLS — Split layout with table rows
          ═══════════════════════════════════════ */}
      <section className="section section--skills">
        <div className="skills-split">
          <motion.div
            className="skills-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.05 }}
          >
            <span className="section-label" style={{ marginBottom: '1rem' }}>
              05 — Skills
            </span>
            <h2 className="huge-text" style={{ textAlign: 'left', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
              SKILLS
            </h2>
            <p className="body-text" style={{ marginTop: '1.5rem', maxWidth: '350px', color: 'var(--fg-muted)' }}>
              A curated stack refined through production experience across web, mobile, and cloud platforms.
            </p>
          </motion.div>

          <motion.div
            className="skills-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.05 }}
          >
            {[
              { cat: 'Languages', tech: 'JavaScript, C++, SQL, HTML5, CSS3' },
              { cat: 'Frameworks', tech: 'React.js, React Native, Next.js, VUE' },
              { cat: 'APIs', tech: 'REST APIs, API Integration, JSON, Responsive Web' },
              { cat: 'Databases', tech: 'MySQL, MongoDB' },
              { cat: 'Cloud', tech: 'AWS (EC2, S3, Lambda, IAM, RDS), GCP' },
              { cat: 'DevOps', tech: 'Git, GitHub, Linux, CI/CD, Jenkins, Docker' },
              { cat: 'Practices', tech: 'Component Architecture, State Management, Agile/Scrum, Performance Optimization' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="skill-row"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + i * 0.06,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: false, amount: 0.05 }}
              >
                <strong>{item.cat}</strong>
                <span>{item.tech}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. ACHIEVEMENTS — Cream, editorial list
          ═══════════════════════════════════════ */}
      <section className="section section--achievements">
        <div className="dot-bg" />

        <motion.div style={{ zIndex: 10, width: '100%', maxWidth: '700px' }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.05 }}
          >
            06 — Achievements
          </motion.span>

          <motion.h2
            className="huge-text"
            style={{
              textAlign: 'left', marginBottom: '3rem',
              fontSize: 'clamp(2rem, 5vw, 4.5rem)', color: 'var(--fg-dark)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.05 }}
          >
            <AnimatedText text="ACHIEVEMENTS" stagger={0.03} />
          </motion.h2>

          <div className="achievement-list">
            {[
              'AWS Academy: Cloud Developing & Cloud Architecting',
              'CloudThat: Cloud Operations on AWS',
              'Spanish Language: A1 & A2 Certified',
            ].map((cert, i) => (
              <motion.div
                key={i}
                className="achievement-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: false, amount: 0.05 }}
              >
                <motion.div
                  className="ach-marker"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 300 }}
                  viewport={{ once: false, amount: 0.05 }}
                />
                <span className="ach-text">{cert}</span>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            style={{
              marginTop: '4rem', display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start', gap: '0.5rem',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            viewport={{ once: false, amount: 0.05 }}
          >
            <LineDraw delay={0.6} color="rgba(26,24,22,0.12)" />
            <span className="mono" style={{
              fontSize: '0.65rem', letterSpacing: '0.15em',
              color: 'rgba(26,24,22,0.3)', textTransform: 'uppercase',
            }}>
              Sejal Chaudhary © 2025
            </span>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
