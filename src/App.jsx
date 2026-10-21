import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Phone, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

function lerpAngle(start, end, factor) {
  let delta = end - start;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return start + delta * factor;
}

const workExperience = [
  {
    role: "AI Evaluation and Training Data Intern",
    company: "Sovrano AI",
    date: "Jul 2026 - Present",
    desc: "Building evaluation datasets and translating client requirements into build-ready technical specs for production models."
  },
  {
    role: "Transformation and Banking Operations Manager",
    company: "Telangana Grameena Bank",
    date: "Apr 2023 - Aug 2025",
    desc: "Coordinated operations workstream for 60 branches during core banking migration. Designed V-KYC, cutting onboarding by 40%."
  },
  {
    role: "Customer Service Associate",
    company: "Union Bank of India",
    date: "Jun 2022 - Mar 2023",
    desc: "Operated enterprise core banking platforms and built VBA reconciliation models that cut errors by 30%."
  }
];

export default function App() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);
  const centerImageRef = useRef(null);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  // Mouse tracking state for canvas
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentAngleRef = useRef(0);

  // Mouse tracking state for DOM cursor
  const domCursorDotPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const domCursorRingPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const domCursorTarget = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const loadImages = async () => {
      const loadImg = (src) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });

      const promises = [];
      for (let i = 0; i < 64; i++) {
        promises.push(loadImg(`/frames/${String(i).padStart(4, '0')}.webp`));
      }
      
      try {
        const imgs = await Promise.all(promises);
        imagesRef.current = imgs;
        centerImageRef.current = await loadImg('/frames/center.webp');
        setImagesLoaded(true);
      } catch (err) {
        console.error("Error loading images", err);
      }
    };
    
    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    
    const render = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      // Calculate face center robustly even during scroll
      let faceCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        faceCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
      
      const dx = mouseRef.current.x - faceCenter.x;
      const dy = mouseRef.current.y - faceCenter.y;
      
      const dist = Math.sqrt(dx*dx + dy*dy);
      const deadzoneRadius = window.innerWidth * 0.12;
      
      let targetAngle = Math.atan2(dy, dx); 
      if (targetAngle < 0) targetAngle += Math.PI * 2;

      currentAngleRef.current = lerpAngle(currentAngleRef.current, targetAngle, 0.26);
      if (currentAngleRef.current < 0) currentAngleRef.current += Math.PI * 2;
      currentAngleRef.current = currentAngleRef.current % (Math.PI * 2);

      ctx.fillStyle = '#dfd2c1';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let imgToDraw = centerImageRef.current;
      
      if (dist > deadzoneRadius) {
         let frameIndex = Math.round((currentAngleRef.current / (Math.PI * 2)) * 64) % 64;
         if (frameIndex < 0) frameIndex = 0;
         if (frameIndex >= 64) frameIndex = 63;
         imgToDraw = imagesRef.current[frameIndex];
      }

      if (imgToDraw) {
        const imgRatio = imgToDraw.width / imgToDraw.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          drawHeight = canvas.height;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        }
        ctx.drawImage(imgToDraw, drawX, drawY, drawWidth, drawHeight);
      }

      // Cursor lerping
      domCursorDotPos.current.x += (domCursorTarget.current.x - domCursorDotPos.current.x) * 0.4;
      domCursorDotPos.current.y += (domCursorTarget.current.y - domCursorDotPos.current.y) * 0.4;
      
      domCursorRingPos.current.x += (domCursorTarget.current.x - domCursorRingPos.current.x) * 0.15;
      domCursorRingPos.current.y += (domCursorTarget.current.y - domCursorRingPos.current.y) * 0.15;
      
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${domCursorDotPos.current.x}px, ${domCursorDotPos.current.y}px, 0)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${domCursorRingPos.current.x}px, ${domCursorRingPos.current.y}px, 0)`;
      }

      requestAnimationFrame(render);
    };

    const rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [imagesLoaded]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      domCursorTarget.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="w-full bg-[#dfd2c1]">
      {/* Loading Overlay */}
      {!imagesLoaded && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#dfd2c1] z-[100] text-[#2d2422] font-sans tracking-widest text-sm">
          LOADING...
        </div>
      )}

      {/* Floating Header */}
      <header className="fixed top-0 left-0 w-full flex justify-center mt-6 z-50 pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-12 px-10 py-4 rounded-full bg-white/20 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(45,36,34,0.08)] transition-transform hover:scale-[1.02]">
          <a href="#work" className="text-xs font-bold tracking-[0.2em] text-[#2d2422] hover:text-[#1a2e35] transition-colors" onMouseEnter={() => setIsHoveringButton(true)} onMouseLeave={() => setIsHoveringButton(false)}>[WORK]</a>
          <a href="#about" className="text-xs font-bold tracking-[0.2em] text-[#2d2422] hover:text-[#1a2e35] transition-colors" onMouseEnter={() => setIsHoveringButton(true)} onMouseLeave={() => setIsHoveringButton(false)}>[ABOUT]</a>
          <a href="#contact" className="text-xs font-bold tracking-[0.2em] text-[#2d2422] hover:text-[#1a2e35] transition-colors" onMouseEnter={() => setIsHoveringButton(true)} onMouseLeave={() => setIsHoveringButton(false)}>[CONTACT]</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative w-full h-screen overflow-hidden" ref={containerRef}>
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full block" 
          style={{ zIndex: 0 }}
        />
        
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end p-12 lg:p-24 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pointer-events-auto max-w-md"
          >
            <p className="text-xl font-medium tracking-widest text-[#4a3f3c] mb-2">
              Hi, I'm
            </p>
            <h1 
              className="text-8xl md:text-9xl mb-6 text-[#2d2422] drop-shadow-sm" 
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Sujith
            </h1>
            <p className="text-[#4a3f3c] leading-relaxed text-sm md:text-base mb-10 max-w-[400px]">
              Transformation and AI Operations professional with a background in Computer Science. Bridging the gap between applied artificial intelligence, strategy, and full-stack development to build high-impact solutions.
            </p>
            
            <div className="flex flex-wrap items-center gap-5">
              <a 
                href="/Siva_Resume.pdf" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#2d2422] text-[#dfd2c1] font-bold text-xs tracking-wider hover:scale-105 transition-transform shadow-xl"
                onMouseEnter={() => setIsHoveringButton(true)} 
                onMouseLeave={() => setIsHoveringButton(false)}
              >
                RESUME
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#contact"
                className="flex items-center justify-center px-8 py-4 rounded-full bg-white/20 backdrop-blur-xl border border-white/50 text-[#2d2422] font-bold text-xs tracking-wider hover:bg-white/40 transition-colors shadow-lg"
                onMouseEnter={() => setIsHoveringButton(true)} 
                onMouseLeave={() => setIsHoveringButton(false)}
              >
                LET'S TALK
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="w-full min-h-screen relative z-10 bg-[#1a2e35] text-[#dfd2c1] flex flex-col justify-center px-8 md:px-24 py-32">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold tracking-[0.4em] text-[#a5b4b7] mb-16">[ SELECTED WORK ]</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {workExperience.map((job, idx) => (
                <div key={idx} className="group border-t border-[#dfd2c1]/20 pt-8 transition-colors hover:border-[#dfd2c1]">
                  <p className="text-[#a5b4b7] text-xs font-mono mb-4">{job.date}</p>
                  <h3 className="text-2xl font-light mb-2 text-[#e8ecec] group-hover:text-white transition-colors">{job.role}</h3>
                  <p className="text-lg font-medium text-[#8b9c9f] mb-6">{job.company}</p>
                  <p className="text-sm leading-relaxed text-[#a5b4b7] group-hover:text-[#dfd2c1] transition-colors">
                    {job.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full min-h-screen relative z-10 bg-[#f4f0ec] text-[#2d2422] flex flex-col justify-center px-8 md:px-24 py-32">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold tracking-[0.4em] text-[#8a7d77] mb-12">[ ABOUT ME ]</h2>
            <h3 className="text-4xl md:text-5xl font-light leading-tight mb-8">
              Engineer by training.<br/>Strategist by trade.<br/>AI innovator by passion.
            </h3>
            <p className="text-lg text-[#5a4f4c] leading-relaxed mb-6">
              With over five years of professional experience across pharmaceutical manufacturing, public sector banking, and applied AI, I specialize in navigating complex digital transformations.
            </p>
            <p className="text-lg text-[#5a4f4c] leading-relaxed">
              I am currently completing an International MBA at IE Business School in Madrid, complementing my B.Tech in Computer Science. My unique background allows me to bridge the gap between deep technical implementation and high-level business strategy.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-white p-12 rounded-3xl shadow-2xl shadow-[#e0d9d3]">
              <h4 className="text-sm font-bold tracking-[0.2em] text-[#1a2e35] mb-8">EDUCATION & CERTIFICATIONS</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#1a2e35] shrink-0" />
                  <div>
                    <p className="font-bold">IE Business School</p>
                    <p className="text-sm text-[#5a4f4c]">International MBA, Strategy (Dec 2026)</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#1a2e35] shrink-0" />
                  <div>
                    <p className="font-bold">JNAFA University</p>
                    <p className="text-sm text-[#5a4f4c]">B.Tech, Computer Science & Game Development</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#1a2e35] shrink-0" />
                  <div>
                    <p className="font-bold">Generative AI & Agentic AI</p>
                    <p className="text-sm text-[#5a4f4c]">Harvard Business Impact, Vanderbilt, upGrad</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full relative z-10 bg-[#2d2422] text-[#dfd2c1] flex flex-col items-center justify-center px-8 py-40 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h2 className="text-5xl md:text-7xl font-light mb-8">Let's build something extraordinary.</h2>
          <p className="text-xl text-[#a89b96] mb-16 max-w-xl mx-auto">
            Available starting December 2026. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6">
            <a 
              href="mailto:sujith@student.ie.edu"
              className="flex items-center gap-3 px-8 py-5 rounded-full bg-[#dfd2c1] text-[#2d2422] font-bold text-sm tracking-wider hover:bg-white hover:scale-105 transition-all shadow-xl"
              onMouseEnter={() => setIsHoveringButton(true)} 
              onMouseLeave={() => setIsHoveringButton(false)}
            >
              <Mail className="w-5 h-5" />
              sujith@student.ie.edu
            </a>
            <a 
              href="tel:+34610455690"
              className="flex items-center gap-3 px-8 py-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[#dfd2c1] font-bold text-sm tracking-wider hover:bg-white/20 transition-colors shadow-lg"
              onMouseEnter={() => setIsHoveringButton(true)} 
              onMouseLeave={() => setIsHoveringButton(false)}
            >
              <Phone className="w-5 h-5" />
              +34 610 455 690
            </a>
            <a 
              href="https://linkedin.com/in/sujith1999"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-8 py-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[#dfd2c1] font-bold text-sm tracking-wider hover:bg-white/20 transition-colors shadow-lg"
              onMouseEnter={() => setIsHoveringButton(true)} 
              onMouseLeave={() => setIsHoveringButton(false)}
            >
              <ExternalLink className="w-5 h-5" />
              LinkedIn
            </a>
          </div>
        </motion.div>
        
        <div className="absolute bottom-10 text-xs tracking-widest text-[#a89b96] font-semibold">
          © {new Date().getFullYear()} SIVA SUJITH REDDY BANDA
        </div>
      </section>

      {/* Custom Cursor Ring */}
      <div 
        ref={cursorRingRef}
        className="pointer-events-none fixed top-0 left-0 z-[110] flex items-center justify-center mix-blend-difference"
        style={{ width: '40px', height: '40px', margin: '-20px 0 0 -20px' }}
      >
        <div className={clsx(
          "absolute w-10 h-10 border border-[#dfd2c1] rounded-full transition-all duration-500 ease-out",
          isHoveringButton ? "scale-150 opacity-0" : "scale-100 opacity-100"
        )} />
      </div>

      {/* Custom Cursor Dot */}
      <div 
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[111] flex items-center justify-center mix-blend-difference"
        style={{ width: '40px', height: '40px', margin: '-20px 0 0 -20px' }}
      >
        <div className={clsx(
          "w-2 h-2 bg-[#dfd2c1] rounded-full transition-all duration-300 ease-out",
          isHoveringButton ? "scale-[4] opacity-80" : "scale-100 opacity-100"
        )} />
      </div>
    </main>
  );
}
