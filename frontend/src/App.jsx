import { useState, useEffect, useRef } from "react";

const NAV = ["About", "Skills", "Experience", "Blogs", "Contact"];

const SKILLS = {
  Languages: ["Java", "Golang", "NodeJs", "Scala", "Python"],
  Frameworks: ["Spring Boot", "Play Framework", "React", "React Native", "Express", "Gin"],
  "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "Helm", "GitLab CI", "Jenkins"],
  "Messaging": ["Kafka", "RabbitMQ"],
  Databases: ["MySQL", "Oracle", "PostgreSQL", "MongoDB", "Redis"],
  Monitoring: ["Grafana", "Kibana", "Jaeger"],
  Testing: ["JUnit", "Mockito", "Pact.io", "Jest", "React Testing Library", "Testify"],
  Practices: ["Agile", "TDD", "BDD", "CI/CD", "IaC", "Pair Programming", "Event-Driven"],
};

const EXPERIENCE = [
  {
    company: "Opencast Software",
    role: "Senior Software Consultant",
    period: "Sep 2022 – Present",
    location: "UK",
    projects: [
      {
        name: "Project III — Scala Full Stack Developer",
        period: "Mar 2025 – Present",
        points: [
          "Designing MVC-based features using Scala with Play Framework",
          "Implementing frontend components aligned with UK GDS design standards",
          "Mentoring junior developers and supporting lead developer in delivery",
          "Introduced testing strategy reducing content-related bugs by 95%",
        ],
      },
      {
        name: "Project II — Java Backend Developer",
        period: "Jul 2023 – Feb 2025",
        points: [
          "Designed backend APIs with HLD and LLD for various features",
          "Developed microservices using Java Spring Boot",
          "Acted as technical lead, owning critical decisions and delivery",
          "Built async event-driven systems using Kafka with Golang and Java",
          "Authored GitLab CI/CD pipelines for build, test, and deployment",
        ],
      },
      {
        name: "Project I — Java Backend Developer",
        period: "Sep 2022 – Jun 2023",
        points: [
          "Re-engineered legacy workflows written in COBOL",
          "Created CLI for Bootstrap microservices, reducing 2 days of effort per service",
          "Built core microservices using Java Spring Boot",
          "Deployed services to Kubernetes using Helm and Docker",
        ],
      },
    ],
  },
  {
    company: "Thoughtworks India Pvt Ltd",
    role: "Senior Software Consultant",
    period: "Jun 2019 – Aug 2022",
    location: "India",
    projects: [
      {
        name: "Business Banking — Full Stack Developer",
        period: "Jun 2019 – Aug 2022",
        points: [
          "Designed and developed banking services using Golang (Gin) and Java (Spring Boot)",
          "Delivered features in large frontend monorepo using React and React Native",
          "Implemented contract testing using Pact.io",
          "Deployed and maintained microservices on on-prem Kubernetes clusters",
          "Performed root cause and performance analysis using Jaeger, Kibana, Grafana",
        ],
      },
    ],
  },
];

const BLOGS = [
  { title: "Rewriting a Scala 2 Codebase Into Scala 3: A Practical Guide", date: "Nov 2025", url: "https://jaidg2012.medium.com/rewriting-a-scala-2-codebase-into-scala-3-a-practical-guide-351155d01a76" },
  { title: "🔒 How HTTPS Really Works — The Secret Behind the Lock Icon", date: "Oct 2025", url: "https://jaidg2012.medium.com/how-https-really-works-the-secret-behind-the-lock-icon-023f44e1f58d" },
  { title: "ETL with Airflow & PySpark", date: "May 2025", url: "https://jaidg2012.medium.com/etl-with-airflow-pyspark-7d0c8f78b10d" },
  { title: "Data Engineering – Getting Started", date: "Feb 2025", url: "https://jaidg2012.medium.com/data-engineering-getting-started-367429e7c4cc" },
  { title: "Spring JPA — Performance Improvement from 5.5s → 350ms", date: "Jan 2025", url: "https://jaidg2012.medium.com/spring-jpa-performance-improvement-from-5-5s-350ms-250d6f92fc01" },
];

// Chat Widget
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Jay's AI assistant. Ask me anything about his experience, skills, or projects! 👋" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Chat Button — fixed bottom right */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 1000,
          width: "56px", height: "56px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #c9a96e, #8b6914)",
          border: "none", cursor: "pointer",
          boxShadow: "0 8px 32px rgba(201,169,110,0.35)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? (
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        ) : (
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "96px", right: "28px", zIndex: 999,
          width: "340px", height: "480px",
          borderRadius: "16px", overflow: "hidden",
          display: "flex", flexDirection: "column",
          background: "#0f0f0f", border: "1px solid #2a2a2a",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px", display: "flex", alignItems: "center", gap: "12px",
            background: "linear-gradient(135deg, #1a1a1a, #111)",
            borderBottom: "1px solid #2a2a2a",
          }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "bold",
              background: "linear-gradient(135deg, #c9a96e, #8b6914)", color: "#0f0f0f",
              flexShrink: 0,
            }}>J</div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#c9a96e", margin: 0 }}>Jarvis</p>
              <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>Jay's AI Assistant</p>
            </div>
            {/* Online dot */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontSize: "11px", color: "#555" }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: "12px",
            background: "#0f0f0f",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  fontSize: "13px", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  maxWidth: "82%", lineHeight: "1.5",
                  ...(m.role === "user"
                    ? { background: "linear-gradient(135deg, #c9a96e, #8b6914)", color: "#0f0f0f", fontWeight: "500" }
                    : { background: "#1a1a1a", color: "#ccc", border: "1px solid #2a2a2a" }
                  )
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c9a96e", animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px", display: "flex", gap: "8px", alignItems: "center",
            background: "#111", borderTop: "1px solid #2a2a2a",
          }}>
            <input
              style={{
                flex: 1, fontSize: "13px", padding: "10px 14px", borderRadius: "10px",
                background: "#1a1a1a", color: "#ccc", border: "1px solid #2a2a2a",
                outline: "none", fontFamily: "inherit",
              }}
              placeholder="Ask about Jay..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              onFocus={e => e.target.style.borderColor = "#c9a96e44"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #c9a96e, #8b6914)",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1, transition: "opacity 0.2s",
              }}
            >
              <svg width="14" height="14" fill="#0f0f0f" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e0e0e0", fontFamily: "'Georgia', serif" }}>

      {/* Noise texture overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: "bold", color: "#c9a96e", letterSpacing: "0.05em" }}>JS</span>
          <div style={{ display: "flex", gap: "32px" }}>
            {NAV.map(n => (
              <button key={n} onClick={() => { setActiveSection(n); document.getElementById(n)?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: activeSection === n ? "#c9a96e" : "#666", transition: "color 0.2s" }}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="About" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "60px", position: "relative", overflow: "hidden" }}>
        {/* Decorative circle */}
        <div style={{ position: "absolute", right: "-200px", top: "50%", transform: "translateY(-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "16px" }}>Senior Full Stack Developer</p>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "bold", lineHeight: 1.0, marginBottom: "24px", fontFamily: "'Georgia', serif" }}>
            Jayandran<br />
            <span style={{ color: "#c9a96e" }}>Sampath</span>
          </h1>
          <p style={{ fontSize: "16px", color: "#888", maxWidth: "520px", lineHeight: 1.8, marginBottom: "40px" }}>
            10+ years crafting scalable microservices, cloud-native solutions, and modern web applications across banking, retail, and enterprise domains.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Email", href: "mailto:jaidg2012@gmail.com", icon: "✉" },
              { label: "LinkedIn", href: "https://uk.linkedin.com/in/jayandran-sampath", icon: "in" },
              { label: "GitHub", href: "https://github.com/jayandran-Sampath", icon: "⌥" },
              { label: "Medium", href: "https://jaidg2012.medium.com", icon: "M" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#888", textDecoration: "none", fontSize: "13px", transition: "all 0.2s", background: "#111" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a96e"; e.currentTarget.style.color = "#c9a96e"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#888"; }}
              >
                <span style={{ fontWeight: "bold" }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "48px", marginTop: "64px", paddingTop: "48px", borderTop: "1px solid #1e1e1e" }}>
            {[["10+", "Years Experience"], ["3+", "Companies"], ["Java, Go, Scala", "Core Stack"], ["Banking & Retail", "Domains"]].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#c9a96e", fontFamily: "'Georgia', serif" }}>{n}</p>
                <p style={{ fontSize: "12px", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="Skills" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "8px" }}>What I work with</p>
          <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "60px", fontFamily: "'Georgia', serif" }}>Technical Skills</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {Object.entries(SKILLS).map(([cat, items]) => (
              <div key={cat} style={{ padding: "24px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#c9a96e33"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}
              >
                <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "16px" }}>{cat}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {items.map(s => (
                    <span key={s} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "4px", background: "#1a1a1a", color: "#999", border: "1px solid #2a2a2a" }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="Experience" style={{ padding: "100px 24px", background: "#080808" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "8px" }}>Recent Work</p>
          <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "60px", fontFamily: "'Georgia', serif" }}>Experience</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {EXPERIENCE.map((job, ji) => (
              <div key={ji} style={{ border: "1px solid #1e1e1e", borderRadius: "12px", overflow: "hidden", background: "#0f0f0f" }}>
                <button onClick={() => setExpandedJob(expandedJob === ji ? -1 : ji)}
                  style={{ width: "100%", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold", color: "#e0e0e0", fontFamily: "'Georgia', serif" }}>{job.company}</p>
                    <p style={{ fontSize: "13px", color: "#c9a96e", marginTop: "4px" }}>{job.role} · {job.period} · {job.location}</p>
                  </div>
                  <span style={{ color: "#c9a96e", fontSize: "20px", transition: "transform 0.3s", transform: expandedJob === ji ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </button>
                {expandedJob === ji && (
                  <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    {job.projects.map((p, pi) => (
                      <div key={pi} style={{ paddingLeft: "20px", borderLeft: "2px solid #c9a96e33" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                          <p style={{ fontSize: "14px", fontWeight: "600", color: "#c9a96e" }}>{p.name}</p>
                          <p style={{ fontSize: "12px", color: "#555" }}>{p.period}</p>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                          {p.points.map((pt, i) => (
                            <li key={i} style={{ fontSize: "13px", color: "#777", paddingLeft: "16px", position: "relative", lineHeight: "1.6" }}>
                              <span style={{ position: "absolute", left: 0, color: "#c9a96e" }}>·</span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section id="Blogs" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "8px" }}>Writing & sharing</p>
          <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "60px", fontFamily: "'Georgia', serif" }}>Recent Blogs</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {BLOGS.map((b, i) => (
              <a key={i} href={b.url} target="_blank" rel="noreferrer"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #1a1a1a", textDecoration: "none", gap: "16px", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.querySelector(".blog-title").style.color = "#c9a96e"; }}
                onMouseLeave={e => { e.currentTarget.querySelector(".blog-title").style.color = "#e0e0e0"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <span style={{ fontSize: "12px", color: "#333", minWidth: "28px" }}>0{i + 1}</span>
                  <p className="blog-title" style={{ fontSize: "15px", color: "#e0e0e0", transition: "color 0.2s", fontFamily: "'Georgia', serif" }}>{b.title}</p>
                </div>
                <span style={{ fontSize: "12px", color: "#444", whiteSpace: "nowrap" }}>{b.date}</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: "32px" }}>
            <a href="https://jaidg2012.medium.com" target="_blank" rel="noreferrer"
              style={{ fontSize: "13px", color: "#c9a96e", textDecoration: "none", letterSpacing: "0.1em" }}>
              View all on Medium →
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="Contact" style={{ padding: "100px 24px", background: "#080808" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "8px" }}>Get in touch</p>
          <h2 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: "bold", marginBottom: "24px", fontFamily: "'Georgia', serif", lineHeight: 1.1 }}>
            Let's work<br /><span style={{ color: "#c9a96e" }}>together</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#666", marginBottom: "48px" }}>Open to senior & lead developer roles</p>
          <a href="mailto:jaidg2012@gmail.com"
            style={{ display: "inline-block", padding: "16px 40px", background: "linear-gradient(135deg, #c9a96e, #8b6914)", color: "#0a0a0a", textDecoration: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", letterSpacing: "0.05em", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            jaidg2012@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px", borderTop: "1px solid #1a1a1a", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "#333" }}>© 2026 Jayandran Sampath · Built with React</p>
      </footer>

      <ChatWidget />
    </div>
  );
}
