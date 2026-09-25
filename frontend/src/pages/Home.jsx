import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { gsap, ScrollTrigger } from "../gsapSetup";
import { CATEGORY_IMAGES, DEFAULT_CATEGORY_IMAGE, FALLBACK_BLURBS } from "../utils/categoryData";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const catSectionRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    api.get("/listings/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(".node-art-wrapper", {
      rotationY: x * 40,
      rotationX: -y * 40,
      x: x * 20,
      y: y * 20,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.8
    });
  };

  const handleMouseLeave = () => {
    gsap.to(".node-art-wrapper", {
      rotationY: 0,
      rotationX: 0,
      x: 0,
      y: 0,
      ease: "power3.out",
      duration: 1.5
    });
  };

  // Hero entrance — runs once, immediately on mount (above the fold, no scroll needed)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-eyebrow", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
        .fromTo(".hero h1", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(".hero-desc", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35")
        .fromTo(".search-bar", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(".hero-actions .btn", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, "-=0.25")
        .fromTo(".node-art-wrapper", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: "center", duration: 0.6 }, "-=0.5")
        .fromTo(".node-art circle, .node-art line", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.03 }, "-=0.4")
        .add(() => {
          // 1. Sleek, slow 360-degree continuous rotation (Constellation effect)
          gsap.to(".node-art", {
            rotation: 360,
            duration: 45, // Very slow and elegant
            repeat: -1,
            ease: "none",
            transformOrigin: "center"
          });
          
          // 2. Gentle breathing pulse on all nodes to make them look alive
          gsap.to(".node-circle", {
            scale: 1.15,
            transformOrigin: "center",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
              amount: 2.5,
              from: "random"
            }
          });

          // 3. Clean Data Flow Animation inside the rotating SVG
          const targets = [
            { x: 70, y: 60 },
            { x: 330, y: 50 },
            { x: 90, y: 280 },
            { x: 320, y: 260 },
          ];

          const animateParticle = (cls) => {
            const target = targets[Math.floor(Math.random() * targets.length)];
            const duration = 1.2 + Math.random() * 1; 
            const delay = Math.random() * 2; 

            const pTl = gsap.timeline({
              delay: delay,
              onComplete: () => animateParticle(cls)
            });
            
            pTl.fromTo(cls, 
              { cx: 200, cy: 170, opacity: 0, scale: 1 }, 
              { opacity: 1, duration: 0.2 }
            )
            .to(cls, { cx: target.x, cy: target.y, duration: duration, ease: "power1.inOut" })
            .to(cls, { opacity: 0, scale: 0, duration: 0.2 }, "-=0.2");
          };

          animateParticle(".p1");
          animateParticle(".p2");
          animateParticle(".p3");
          animateParticle(".p4");
        });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Category cards — animate in once, the first time this section scrolls into view
  useEffect(() => {
    if (!categories.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".cat-card", 
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: catSectionRef.current, start: "top 80%", once: true },
        }
      );
    }, catSectionRef);
    return () => ctx.revert();
  }, [categories]);

  // How-it-works steps
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".step", 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: stepsRef.current, start: "top 80%", once: true },
        }
      );
    }, stepsRef);
    return () => ctx.revert();
  }, []);

  // CTA band
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-band", 
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%", once: true },
        }
      );
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  const goToCategory = (name) => navigate(`/browse?category=${encodeURIComponent(name)}`);

  return (
    <>
      <section className="hero" ref={heroRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div className="container hero-grid">
          <div style={{ zIndex: 2 }}>
            <p className="hero-eyebrow">Tech & IT services marketplace</p>
            <h1>Find the right tech<br />partner, verified.</h1>
            <p className="hero-desc">
              BizSphere connects businesses with vetted developers, agencies,
              and IT vendors — from a first search to a signed deal.
            </p>
            <div className="search-bar" style={{ marginBottom: 22 }}>
              <input
                placeholder="Search services, e.g. 'AI chatbot'"
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/browse?keyword=${encodeURIComponent(e.target.value)}`);
                }}
              />

            </div>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">Join as buyer</Link>
              <Link to="/register" className="btn btn-outline">List your business</Link>
            </div>
          </div>
          <div className="node-art-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <svg className="node-art" viewBox="0 0 400 340" fill="none" style={{ width: "100%", height: 340, overflow: "visible" }}>
              {/* Lines */}
              <line className="line1" x1="70" y1="60" x2="200" y2="170" stroke="#E4E7F0" strokeWidth="1.5" />
              <line className="line2" x1="330" y1="50" x2="200" y2="170" stroke="#E4E7F0" strokeWidth="1.5" />
              <line className="line3" x1="90" y1="280" x2="200" y2="170" stroke="#E4E7F0" strokeWidth="1.5" />
              <line className="line4" x1="320" y1="260" x2="200" y2="170" stroke="#E4E7F0" strokeWidth="1.5" />
              <line className="line5" x1="70" y1="60" x2="90" y2="280" stroke="#E4E7F0" strokeWidth="1.5" />
              <line className="line6" x1="330" y1="50" x2="320" y2="260" stroke="#E4E7F0" strokeWidth="1.5" />
              
              {/* Nodes with glows */}
              <circle className="node-circle c0" cx="200" cy="170" r="34" fill="#10142B" style={{ filter: "drop-shadow(0 0 16px rgba(16,20,43,0.3))" }} />
              <circle className="node-circle c1" cx="70" cy="60" r="16" fill="#3A4CE0" style={{ filter: "drop-shadow(0 0 12px rgba(58,76,224,0.5))" }} />
              <circle className="node-circle c2" cx="330" cy="50" r="12" fill="#FFB020" style={{ filter: "drop-shadow(0 0 10px rgba(255,176,32,0.5))" }} />
              <circle className="node-circle c3" cx="90" cy="280" r="14" fill="#3A4CE0" style={{ filter: "drop-shadow(0 0 12px rgba(58,76,224,0.5))" }} />
              <circle className="node-circle c4" cx="320" cy="260" r="18" fill="#10142B" opacity="0.15" />
              
              {/* Data Particles */}
              <circle className="particle p1" cx="200" cy="170" r="4" fill="#3A4CE0" opacity="0" style={{ filter: "drop-shadow(0 0 4px #3A4CE0)" }} />
              <circle className="particle p2" cx="200" cy="170" r="4" fill="#FFB020" opacity="0" style={{ filter: "drop-shadow(0 0 4px #FFB020)" }} />
              <circle className="particle p3" cx="200" cy="170" r="4" fill="#3A4CE0" opacity="0" style={{ filter: "drop-shadow(0 0 4px #3A4CE0)" }} />
              <circle className="particle p4" cx="200" cy="170" r="4" fill="#10142B" opacity="0" />
            </svg>
          </div>
        </div>
      </section>

      <section className="section" ref={catSectionRef}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Browse by service</h2>
              <p>Every category below is live in our directory — click one to see current listings.</p>
            </div>
            <Link to="/services" className="btn btn-outline btn-sm">View all →</Link>
          </div>
          <div className="cat-grid">
            {(categories.length ? categories : Object.keys(FALLBACK_BLURBS).map((name) => ({ name }))).slice(0, 9).map((c, i) => (
              <button
                key={c._id || c.name}
                className="cat-card"
                style={{ textAlign: "left", cursor: "pointer" }}
                onClick={() => goToCategory(c.name)}
              >
                <img src={CATEGORY_IMAGES[c.name] || DEFAULT_CATEGORY_IMAGE} alt={c.name} className="cat-img" />
                <div className="cat-content">
                  <div className="cat-index">{String(i + 1).padStart(2, "0")}</div>
                  <h4>{c.name}</h4>
                  <p>{FALLBACK_BLURBS[c.name] || "Verified providers in this category."}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section" style={{ background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} ref={stepsRef}>
        <div className="container">
          <h2>How BizSphere works</h2>
          <div className="steps-row">
            <div className="step">
              <div className="step-num">01</div>
              <h4>Create an account</h4>
              <p>Sign up as a buyer, or list your business as a vendor in minutes.</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h4>Search & compare</h4>
              <p>Filter by category and location, and read what other buyers say.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h4>Send an enquiry</h4>
              <p>Contact the vendor directly through the platform, no middlemen.</p>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <h4>Close the deal</h4>
              <p>Work out the details together and get moving.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" ref={ctaRef}>
        <div className="cta-band">
          <div>
            <h3>Have a service to offer?</h3>
            <p>List your business and start receiving enquiries — approval usually takes a day.</p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-accent">List your business</Link>
          </div>
        </div>
      </section>
    </>
  );
}


