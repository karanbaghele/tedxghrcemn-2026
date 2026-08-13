"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink, Menu, X, MapPin, CalendarDays, Clock3, ChevronDown, Search, MousePointer2 } from "lucide-react";
import { activities, faqs, navItems, schedule, secondaryNav, siteConfig, speakers, teamGroups } from "../data/site";

const reveal = { hidden: { opacity: 0, y: 42, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } };

function Brand() {
  return <a className="brand" href="/" aria-label="GHRCEMN home"><span>GHRCEMN</span></a>;
}

function RegisterButton({ label = "Register Now", compact = false }: { label?: string; compact?: boolean }) {
  return <motion.a whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: .97 }} transition={{ type: "spring", stiffness: 420, damping: 24 }} className={`button primary ${compact ? "compact" : ""}`} href={siteConfig.registrationUrl} target="_blank" rel="noreferrer" aria-label={`${label}, opens external registration platform`}>{label}<ExternalLink size={16} aria-hidden="true" /></motion.a>;
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><motion.i animate={{ scaleX: progress }} transition={{ duration: .08, ease: "linear" }} /></div>;
}

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);
  return <>
    <header className={`site-header ${scrolled || open ? "scrolled" : ""}`}>
      <Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(([label, href]) => <a key={href} className={path === href ? "active" : ""} href={href}>{label}</a>)}
      </nav>
      <div className="header-actions"><RegisterButton label="Register" compact /><button ref={menuButton} className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button></div>
    </header>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mobile-links">{[...navItems, ...secondaryNav].map(([label, href], index) => <motion.a initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .025 }} key={href} href={href}>{String(index + 1).padStart(2, "0")}<span>{label}</span></motion.a>)}</div>
      <RegisterButton label="Register on external platform" />
    </motion.nav>}</AnimatePresence>
  </>;
}

function Footer() {
  return <footer className="footer"><div className="footer-top"><div><Brand /><p>Ideas, curiosity and human connection—gathered in Nagpur for the second edition.</p></div><div className="footer-links">{[...navItems, ...secondaryNav].map(([l,h]) => <a key={h} href={h}>{l}</a>)}</div><div><p className="eyebrow">EVENT</p><p>{siteConfig.date} • {siteConfig.dateStatus}</p><p>{siteConfig.venue}</p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div></div><div className="footer-bottom"><p>{siteConfig.disclaimer}</p><p>Registration, payment, cancellation and refund matters are handled by the external ticketing provider.</p><p>© 2026 TEDxGHRCEMN</p></div></footer>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} variants={reveal} initial={reduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true, amount: .12 }} transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}

function SectionIntro({ label, title, copy }: { label: string; title: React.ReactNode; copy?: string }) {
  return <Reveal className="section-intro"><p className="eyebrow">{label}</p><h2>{title}</h2>{copy && <p className="lede">{copy}</p>}</Reveal>;
}

function PlaceholderArt({ index = 1, label = "Image coming soon" }: { index?: number; label?: string }) {
  return <div className={`placeholder-art art-${index % 4}`} role="img" aria-label={label}><span>{String(index).padStart(2, "0")}</span><i /></div>;
}

type HeroDot = { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; size: number; phase: number; depth: number };

function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 0, height = 0, frame = 0, animation = 0;
    let dots: HeroDot[] = [];
    const pointer = { x: -999, y: -999, active: false };
    const pulses: { x: number; y: number; life: number }[] = [];

    const makeDots = () => {
      const count = width < 700 ? 82 : Math.min(175, Math.round(width / 9));
      dots = Array.from({ length: count }, (_, index) => {
        const ring = index < count * .74;
        const angle = Math.random() * Math.PI * 2;
        const layer = .48 + Math.random() * .58;
        const centreX = width < 700 ? width * .58 : width * .74;
        const centreY = height * .47;
        const radiusX = Math.min(width * .31, 430) * layer;
        const radiusY = Math.min(height * .42, 410) * layer;
        const baseX = ring ? centreX + Math.cos(angle) * radiusX : Math.random() * width;
        const baseY = ring ? centreY + Math.sin(angle) * radiusY : Math.random() * height;
        return { x: baseX, y: baseY, baseX, baseY, vx: 0, vy: 0, size: .55 + Math.random() * 1.65, phase: Math.random() * Math.PI * 2, depth: .35 + Math.random() * .9 };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = rect.width; height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * ratio)); canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      makeDots();
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(width * .72, height * .47, 20, width * .72, height * .47, Math.min(width, height) * .55);
      glow.addColorStop(0, "rgba(230,43,30,.10)"); glow.addColorStop(.34, "rgba(255,255,255,.025)"); glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow; context.fillRect(0, 0, width, height);

      dots.forEach((dot) => {
        const driftX = reduced ? 0 : Math.sin(frame * .006 * dot.depth + dot.phase) * 7 * dot.depth;
        const driftY = reduced ? 0 : Math.cos(frame * .004 * dot.depth + dot.phase) * 5 * dot.depth;
        let targetX = dot.baseX + driftX, targetY = dot.baseY + driftY;
        const dx = pointer.x - dot.x, dy = pointer.y - dot.y, distance = Math.hypot(dx, dy);
        if (pointer.active && distance < 190) {
          const force = (1 - distance / 190) * dot.depth;
          targetX += dx * force * .18; targetY += dy * force * .18;
        }
        dot.vx += (targetX - dot.x) * .018; dot.vy += (targetY - dot.y) * .018;
        dot.vx *= .88; dot.vy *= .88; dot.x += dot.vx; dot.y += dot.vy;
      });

      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const a = dots[i], b = dots[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 82) {
            const pointerDistance = Math.min(Math.hypot(a.x - pointer.x, a.y - pointer.y), Math.hypot(b.x - pointer.x, b.y - pointer.y));
            const alive = pointer.active && pointerDistance < 150;
            context.strokeStyle = alive ? `rgba(230,43,30,${(1 - distance / 82) * .48})` : `rgba(245,245,242,${(1 - distance / 82) * .13})`;
            context.lineWidth = alive ? .8 : .45; context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
          }
        }
      }

      dots.forEach((dot) => {
        const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
        const active = pointer.active && distance < 145;
        context.fillStyle = active ? "rgba(240,58,45,.96)" : `rgba(245,245,242,${.36 + dot.depth * .48})`;
        context.shadowBlur = active ? 15 : 0; context.shadowColor = "#e62b1e";
        context.beginPath(); context.arc(dot.x, dot.y, dot.size * (active ? 1.7 : 1), 0, Math.PI * 2); context.fill();
      });
      context.shadowBlur = 0;

      pulses.forEach((pulse) => {
        pulse.life -= .018; const radius = (1 - pulse.life) * 130;
        context.strokeStyle = `rgba(230,43,30,${pulse.life * .5})`; context.lineWidth = 1;
        context.beginPath(); context.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2); context.stroke();
      });
      for (let i = pulses.length - 1; i >= 0; i -= 1) if (pulses[i].life <= 0) pulses.splice(i, 1);
      if (!reduced) animation = requestAnimationFrame(draw);
    };

    const point = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top; pointer.active = true;
      if (reduced) draw();
    };
    const leave = () => { pointer.active = false; };
    const pulse = (event: PointerEvent) => { point(event); pulses.push({ x: pointer.x, y: pointer.y, life: 1 }); };
    resize(); draw(); window.addEventListener("resize", resize); canvas.addEventListener("pointermove", point); canvas.addEventListener("pointerleave", leave); canvas.addEventListener("pointerdown", pulse);
    return () => { cancelAnimationFrame(animation); window.removeEventListener("resize", resize); canvas.removeEventListener("pointermove", point); canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("pointerdown", pulse); };
  }, [reduced]);
  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

function Hero() {
  const reduced = useReducedMotion();
  return <section className="hero"><InteractiveDots /><div className="hero-grid" aria-hidden="true" /><div className="hero-content"><motion.p className="eyebrow" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .75 }}>TEDxGHRCEMN • AUGUST 2026</motion.p><motion.p className="status-pill" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>{siteConfig.themeStatus}</motion.p><h1 aria-label="Beyond the Dots"><motion.span initial={reduced ? false : { y: "115%" }} animate={{ y: 0 }} transition={{ delay: .15, duration: 1, ease: [0.16,1,0.3,1] }}>Beyond</motion.span><motion.span initial={reduced ? false : { y: "115%" }} animate={{ y: 0 }} transition={{ delay: .25, duration: 1, ease: [0.16,1,0.3,1] }}>the <em>Dots.</em></motion.span></h1><motion.p className="hero-copy" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .8 }}>Every point holds a possibility. Look closer, move through the connections, and discover what exists beyond the obvious.</motion.p><motion.div className="hero-actions" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7, duration: .7 }}><RegisterButton /><motion.a whileHover={{ y: -3 }} whileTap={{ scale: .97 }} className="button ghost" href="#event-intro">Explore Event<ArrowRight size={17} /></motion.a></motion.div><motion.div className="hero-meta" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .85 }}><p><CalendarDays size={17} />{siteConfig.date} <span>• {siteConfig.dateStatus}</span></p><p><MapPin size={17} />{siteConfig.venue}</p></motion.div></div><div className="interaction-note"><MousePointer2 size={14}/><span>Move to reveal connections<br/>Tap to send a signal</span></div><a className="scroll-cue" href="#event-intro"><span>Scroll to go beyond</span><i /></a></section>;
}

function Home() {
  return <>
    <Hero />
    <main id="main-content">
      <section id="event-intro" className="section intro-grid"><SectionIntro label="ABOUT / 01" title={<>One room. Many fields.<br />A shared <em>curiosity.</em></>} copy="TEDxGHRCEMN returns for its second edition—bringing students, professionals and curious minds together around ideas worth examining. The first edition began the conversation; this chapter looks further." /><div className="focus-orbit"><span>AN IDEA</span><i /><i /><i /></div></section>
      <section className="section day-section"><SectionIntro label="THE EXPERIENCE / 02" title={<>Two days.<br />One unfolding <em>story.</em></>} /><div className="day-panels"><Reveal className="day-panel day-one"><div><p className="eyebrow">DAY 01 • PRE-FEST</p><h3>Learn by doing.</h3><p>Workshops, interactive activities and a student competition create space to experiment before the main stage opens.</p><p className="tiny">[PRE_FEST_DATE_TIME] • Tentative</p><a href="/activities">Explore activities <ArrowRight size={16} /></a></div></Reveal><Reveal className="day-panel day-two"><div><p className="eyebrow">DAY 02 • MAIN EVENT</p><h3>Ideas take the stage.</h3><p>TEDx talks, audience engagement and open conversation across disciplines and lived experience.</p><p className="tiny">[MAIN_EVENT_DATE_TIME] • Tentative</p><a href="/event">View event <ArrowRight size={16} /></a></div></Reveal></div></section>
      <section className="section speakers-section"><SectionIntro label="SPEAKERS / 03" title={<>The voices are<br /><em>coming soon.</em></>} copy="Approximately eight speakers are planned. Names, fields and talk themes will be revealed only after official confirmation." /><div className="speaker-tease">{speakers.slice(0,4).map((speaker,index)=><Reveal key={speaker.id} className="speaker-card"><PlaceholderArt index={index+1} label={`${speaker.name} portrait coming soon`} /><p className="eyebrow">{speaker.name}</p><h3>{speaker.talk}</h3><p>{speaker.field}</p></Reveal>)}</div><a className="text-link" href="/speakers">Meet all speakers <ArrowRight size={17}/></a></section>
      <section className="section activity-home"><div className="activity-visual idea-lab" aria-label="Interactive abstract field showing an idea moving beyond a single dot"><div className="idea-lab-rings" /><div className="idea-lab-core"><span>ONE DOT</span><strong>∞</strong><span>NEW DIRECTIONS</span></div>{Array.from({length:18},(_,i)=><i key={i} style={{"--i":i} as React.CSSProperties}/>)}</div><div><SectionIntro label="PRE-FEST / 04" title={<>Ideas become<br /><em>practice.</em></>} copy="Three working activity placeholders are ready to be replaced with the final programme without changing the layout." />{activities.slice(0,3).map((a,i)=><a className="activity-row" href="/activities" key={a.title}><span>0{i+1}</span><div><p className="eyebrow">{a.category}</p><h3>{a.title}</h3><p>{a.description}</p></div><ArrowRight /></a>)}</div></section>
      <section className="section why"><SectionIntro label="WHY ATTEND / 05" title={<>Come for an idea.<br />Leave with <em>connections.</em></>} /><div className="why-list">{["Listen to ideas with real human context.","Learn through practical workshops.","Explore innovation and entrepreneurship.","Connect with professionals and students.","Take part in an interdisciplinary experience."].map((item,i)=><Reveal className="why-item" key={item}><span>0{i+1}</span><p>{item}</p></Reveal>)}</div></section>
      <section className="stat-strip">{[["02","day experience"],["≈ 08","speakers planned"],["150–200","Pre-Fest participants"],["≈ 120","Main Event attendees"],["01","in-person event"]].map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</section>
      <section className="section highlights"><SectionIntro label="FIRST EDITION / 06" title={<>A conversation<br /><em>already begun.</em></>} copy="A considered gallery of approved first-edition moments will live here. No attendance, award or outcome claims have been added." /><div className="highlight-grid"><PlaceholderArt index={1} label="First-edition highlight coming soon" /><PlaceholderArt index={2} label="First-edition highlight coming soon" /><PlaceholderArt index={3} label="First-edition highlight coming soon" /></div><a className="text-link" href="/gallery">Open the gallery <ArrowRight size={17}/></a></section>
      <section className="final-cta"><div className="cta-field" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{"--i":i} as React.CSSProperties}/>)}</div><Reveal><p className="eyebrow">AUGUST 2026 • TENTATIVE</p><h2>Go beyond<br />the <em>obvious.</em></h2><p>Join a room built for questions, connections and ideas that refuse to remain isolated dots.</p><RegisterButton label="Register on External Platform" /></Reveal></section>
    </main>
  </>;
}

function PageHero({ label, title, copy }: { label: string; title: string; copy: string }) {
  const reduced = useReducedMotion();
  return <section className="page-hero"><div className="page-orbit" aria-hidden="true"><i/><i/><i/></div><motion.p className="eyebrow" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>{label}</motion.p><h1><motion.span initial={reduced ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }}>{title}<b>.</b></motion.span></h1><motion.p initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .75 }}>{copy}</motion.p></section>;
}

function AboutPage() { return <main id="main-content"><PageHero label="ABOUT / OUR STORY" title="Ideas need a place to meet" copy="A locally organised TEDx experience, built around curiosity, context and conversation."/><section className="section editorial-story">{[["01","What is TEDx?","TEDx brings the spirit of ideas worth spreading to independently organised local events. Final approved programme wording will be added here."],["02","About TEDxGHRCEMN","The event creates a shared stage for ideas across learning, culture, technology, entrepreneurship and everyday human experience."],["03","The first edition","The first edition began TEDxGHRCEMN’s local story. Approved photographs and a factual recap will be added without invented outcomes."],["04","The second edition","This edition expands into a two-day experience: a practical Pre-Fest followed by the Main Event."],["05","Our objectives","Encourage interdisciplinary thinking, make room for considered dialogue and connect new ideas with people ready to explore them."],["06","The institution","G.H. Raisoni College of Engineering & Management, Nagpur, and the Department of Computer Science & Engineering provide the event’s academic setting. Final approved institutional copy is pending." ]].map(([n,t,c],i)=><Reveal className="story-row" key={t}><span>{n}</span><h2>{t}</h2><p>{c}</p><PlaceholderArt index={i+1} /></Reveal>)}</section><section className="disclaimer-block"><p className="eyebrow">OFFICIAL DISCLAIMER</p><p>{siteConfig.disclaimer}</p></section></main>; }

function Schedule() { const [day,setDay]=useState<"day1"|"day2">("day1"); return <section className="section"><SectionIntro label="PROVISIONAL SCHEDULE" title={<>A clear rhythm for<br /><em>both days.</em></>} copy="All sessions and times below are dummy programme content and remain provisional."/><div className="day-tabs" role="tablist" aria-label="Schedule day"><button role="tab" aria-selected={day==="day1"} onClick={()=>setDay("day1")}>Day 1 • Pre-Fest</button><button role="tab" aria-selected={day==="day2"} onClick={()=>setDay("day2")}>Day 2 • Main Event</button></div><div className="schedule"><div className="schedule-head"><span>Time</span><span>Session</span><span>Speaker / trainer</span><span>Venue</span></div>{schedule[day].map((row,i)=><div className="schedule-row" key={row[0]}><strong>{row[0]}</strong><span><small>SESSION</small>{row[1]}</span><span><small>SPEAKER / TRAINER</small>{row[2]}</span><span><small>VENUE</small>{row[3]}</span></div>)}</div></section>; }

function EventPage(){return <main id="main-content"><PageHero label="EVENT / TWO DAYS" title="From practice to perspective" copy="A two-day in-person gathering with a Pre-Fest and a main TEDx conference."/><section className="facts"><div><CalendarDays/><span>Date</span><strong>{siteConfig.date}</strong><small>{siteConfig.dateStatus}</small></div><div><Clock3/><span>Timings</span><strong>To Be Announced</strong><small>[CONFIRMED_DATE_TIME]</small></div><div><MapPin/><span>Venue</span><strong>GHRCEM, Nagpur</strong><small>{siteConfig.mode}</small></div><div><ExternalLink/><span>Registration</span><strong>External platform</strong><small>Link to be configured</small></div></section><section className="section event-days"><article><p className="eyebrow">DAY 01 • PRE-FEST</p><h2>Make, test, question.</h2><p>Workshops, interactive activities and a student competition for active participation across disciplines.</p><ul><li>Date & time: [PRE_FEST_DATE_TIME]</li><li>Eligibility: To Be Announced</li><li>Venue: To Be Announced</li><li>Entry: To Be Announced</li></ul><a className="text-link" href="/activities">View all activities <ArrowRight size={17}/></a></article><article><p className="eyebrow">DAY 02 • MAIN EVENT</p><h2>Listen, reflect, connect.</h2><p>Speaker sessions, audience engagement and networking opportunities in one focused TEDx programme.</p><ul><li>Date & time: [MAIN_EVENT_DATE_TIME]</li><li>Pass: [PASS_PRICE] • To Be Announced</li><li>Venue: Auditorium • Tentative</li><li>Speakers: Coming Soon</li></ul><RegisterButton /></article></section><Schedule/></main>}

function SpeakersPage(){const [active,setActive]=useState<(typeof speakers)[number]|null>(null); useEffect(()=>{if(!active)return; const close=(e:KeyboardEvent)=>e.key==="Escape"&&setActive(null);document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[active]);return <main id="main-content"><PageHero label="SPEAKERS / COMING SOON" title="Eight perspectives, not one answer" copy="Official speaker announcements will appear here as they are confirmed."/><section className="section speaker-directory">{speakers.map((s,i)=><button className="speaker-card" onClick={()=>setActive(s)} key={s.id} aria-haspopup="dialog"><PlaceholderArt index={i+1} label={`${s.name} portrait coming soon`}/><p className="eyebrow">{s.name}</p><h2>{s.talk}</h2><p>{s.field}</p><span>View placeholder profile <ArrowRight size={15}/></span></button>)}</section><AnimatePresence>{active&&<motion.div className="dialog-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={()=>setActive(null)}><motion.div className="speaker-dialog" role="dialog" aria-modal="true" aria-labelledby="speaker-dialog-title" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:30,stiffness:280}} onMouseDown={e=>e.stopPropagation()}><button className="dialog-close" onClick={()=>setActive(null)} aria-label="Close speaker profile"><X/></button><p className="eyebrow">SPEAKER DETAILS • PLACEHOLDER</p><h2 id="speaker-dialog-title">{active.name}</h2><p className="dialog-field">{active.field}</p><hr/><h3>{active.talk}</h3><p>{active.bio}</p><p>{active.timing}</p><p className="tiny">Designation, organisation and approved profile links • To Be Announced</p></motion.div></motion.div>}</AnimatePresence></main>}

function ActivitiesPage(){return <main id="main-content"><PageHero label="ACTIVITIES / PRE-FEST" title="Ideas become practical" copy="Hands-on workshops and a student competition before the main event."/><section className="section"><SectionIntro label="WORKSHOPS" title={<>Learn by <em>making.</em></>} /> <div className="activity-grid">{activities.map((a,i)=><article key={a.title}><span>0{i+1}</span><p className="eyebrow">{a.category}</p><h2>{a.title}</h2><p>{a.description}</p><dl><dt>Trainer</dt><dd>{a.trainer}</dd><dt>Outcomes</dt><dd>{a.outcomes}</dd><dt>Eligibility</dt><dd>{a.eligibility}</dd><dt>Date & time</dt><dd>[PRE_FEST_DATE_TIME]</dd><dt>Venue</dt><dd>{a.venue}</dd><dt>Capacity</dt><dd>To Be Announced</dd></dl><RegisterButton label="Workshop registration" /></article>)}</div></section><section className="section competition"><p className="eyebrow">STUDENT COMPETITION</p><h2>[COMPETITION_TITLE]</h2><p>A structured student challenge for teams to examine a meaningful problem and present a thoughtful response.</p><div className="competition-grid"><div><h3>Eligibility & team</h3><p>Eligibility and team size • To Be Announced</p></div><div><h3>Rules</h3><ol><li>Original work only.</li><li>Submission format • To Be Announced.</li><li>Final rules will appear before registration opens.</li></ol></div><div><h3>Judging</h3><p>Clarity, relevance, originality and feasibility • Provisional criteria</p></div><div><h3>Important dates</h3><p>Registration, submission and final dates • To Be Announced</p></div><div><h3>Prizes</h3><p>First, second and third prize values • To Be Announced</p></div></div><RegisterButton label="Competition registration" /></section></main>}

function TeamPage(){return <main id="main-content"><PageHero label="TEAM / PUBLIC DIRECTORY" title="The people shaping the room" copy="Only approved public names, roles and photographs will be shown here."/><section className="section team-groups">{teamGroups.map((g,i)=><Reveal className="team-group" key={g}><div><span>{String(i+1).padStart(2,"0")}</span><h2>{g}</h2></div><div className="team-members">{Array.from({length:i<4?1:3},(_,j)=><article key={j}><div className="monogram">TM</div><p>Team Member {String(j+1).padStart(2,"0")}</p><small>{g}</small></article>)}</div></Reveal>)}</section></main>}

function PartnersPage(){return <main id="main-content"><PageHero label="PARTNERS / COLLABORATE" title="Support an exchange of ideas" copy="Partner categories are ready; names and logos will appear only after confirmation."/><section className="section partner-list">{["Hosted by / Institutional Support","Sponsors","Knowledge Partners","Community Partners","Media Partners","Hospitality Partners"].map((p,i)=><div key={p}><span>{String(i+1).padStart(2,"0")}</span><h2>{p}</h2><p>Partners to Be Announced</p></div>)}</section><section className="partner-cta"><p className="eyebrow">PARTNER WITH US</p><h2>Help create space for<br/><em>ideas and people.</em></h2><p>Partnership formats and approved enquiry details will be shared soon.</p><a className="button primary" href="/contact">Start an enquiry <ArrowRight size={17}/></a></section></main>}

function GalleryPage(){const [active,setActive]=useState<number|null>(null);const items=Array.from({length:9},(_,i)=>i+1);return <main id="main-content"><PageHero label="GALLERY / FIRST EDITION" title="Moments, held in light" copy="Approved media from the first edition will appear here, followed by the second edition in 2026."/><section className="section"><div className="filter-pills" aria-label="Gallery categories"><button className="selected">All</button>{["Speaker sessions","Workshops","Audience","Team","Behind the scenes"].map(x=><button key={x}>{x}</button>)}</div><div className="gallery-grid">{items.map((item)=><button key={item} onClick={()=>setActive(item)} aria-label={`Open gallery placeholder ${item}`}><PlaceholderArt index={item} label="Gallery image coming soon"/><span>First-edition highlight • Image coming soon</span></button>)}</div></section><AnimatePresence>{active&&<motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button onClick={()=>setActive(null)} aria-label="Close lightbox"><X/></button><PlaceholderArt index={active}/><p>First-edition highlight {String(active).padStart(2,"0")} • Approved image and caption coming soon</p></motion.div>}</AnimatePresence></main>}

function FAQsPage(){const [query,setQuery]=useState("");const filtered=useMemo(()=>faqs.filter(([q,a])=>(q+a).toLowerCase().includes(query.toLowerCase())),[query]);return <main id="main-content"><PageHero label="FAQS / USEFUL ANSWERS" title="Before you arrive" copy="Clear answers now, honest To Be Announced states where details are still being finalised."/><section className="section faq-wrap"><label className="search"><Search/><span className="sr-only">Search frequently asked questions</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search questions"/></label><div className="faq-list">{filtered.map(([q,a],i)=><details key={q} open={i===0&&!query}><summary><span>{q}</span><ChevronDown/></summary><p>{a}</p></details>)}</div>{filtered.length===0&&<p className="empty-state">No matching questions. Try a broader search.</p>}</section></main>}

function ContactPage(){const [submitted,setSubmitted]=useState(false);return <main id="main-content"><PageHero label="CONTACT / GENERAL ENQUIRIES" title="Let’s continue the conversation" copy="For general or partnership questions. Ticket-related support remains with the external provider."/><section className="section contact-grid"><div><p className="eyebrow">VISIT</p><h2>{siteConfig.venue}</h2><div className="map-placeholder"><MapPin/><span>[MAP_EMBED_URL]</span><small>Map will appear once configured</small></div><p className="eyebrow">WRITE</p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p className="tiny">Official social links • To Be Announced</p></div><form onSubmit={e=>{e.preventDefault();setSubmitted(true)}}><label>Name<input required name="name" autoComplete="name"/></label><label>Email<input required type="email" name="email" autoComplete="email"/></label><label>Enquiry type<select name="type"><option>General enquiry</option><option>Partnership enquiry</option></select></label><label>Message<textarea required name="message" rows={5}/></label><label className="honeypot" aria-hidden="true">Leave blank<input name="company_website" tabIndex={-1}/></label><button className="button primary" type="submit">Prepare enquiry <ArrowRight/></button>{submitted&&<p className="form-note" role="status">The form endpoint is not configured yet, so no message was sent. Please use {siteConfig.email} when the official address is published.</p>}<p className="tiny">This form does not handle tickets, payments, cancellations or refunds.</p></form></section></main>}

function NotFound(){return <main id="main-content" className="not-found"><p className="eyebrow">404 / LOST BETWEEN IDEAS</p><h1>This path<br/><em>fades into dark.</em></h1><p>The page you’re looking for does not exist.</p><div><a className="button primary" href="/">Return home</a><a className="button ghost" href="/event">Explore event</a></div></main>}

export function SiteShell({ path }: { path: string }) {
  const slug = path.replace(/^\//, "");
  const page = slug === "about" ? <AboutPage/> : slug === "event" ? <EventPage/> : slug === "speakers" ? <SpeakersPage/> : slug === "activities" ? <ActivitiesPage/> : slug === "team" ? <TeamPage/> : slug === "partners" ? <PartnersPage/> : slug === "gallery" ? <GalleryPage/> : slug === "faqs" ? <FAQsPage/> : slug === "contact" ? <ContactPage/> : <NotFound/>;
  return <><a className="skip-link" href="#main-content">Skip to content</a><ScrollProgress/><Header path={path}/><motion.div key={path} className="page-transition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .55 }}>{path === "/" ? <Home/> : page}<Footer/></motion.div></>;
}
