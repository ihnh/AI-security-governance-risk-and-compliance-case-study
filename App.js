import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ReferenceLine, Cell } from "recharts";

const P = {
  orange:      "#F47B20",
  orangeLight: "#FE9A3C",
  bg:          "#F5F0EB",
  teal1:       "#1B4E52",
  teal2:       "#1A3A40",
  teal3:       "#132830",
  teal4:       "#0D1F26",
  white:       "#FFFFFF",
  offwhite:    "#F7F3EE",
  good:        "#2A7A4A",
  goodLight:   "#EAF5EF",
  goodBorder:  "#A8D8B8",
  warn:        "#C47820",
  warnLight:   "#FEF6E8",
  warnBorder:  "#F0D090",
  bad:         "#C03830",
  badLight:    "#FBEAEA",
  badBorder:   "#F0A8A0",
  muted:       "#8AADA8",
  border:      "#DDD8D0",
};

const VENDORS = [
  { name: "ClarityCore API",  short: "ClarityCore",  type: "GenAI API",      access: "Full",    cert: "SOC2",           transparency: "High",   location: "US/EU",        bias: "Yes",     uptime: "99.9%",  latency: "500ms", retention: "30 days",      exit: "Yes",     riskScore: 2, aiGov: 85, security: 85, dataHandling: 80, modelTransparency: 90, financial: 85, sla: 85, exitScore: 90, recommendation: "Recommended" },
  { name: "ArcVault AI",      short: "ArcVault",     type: "GenAI Platform", access: "Full",    cert: "SOC2, ISO27001", transparency: "Medium", location: "Multi-region", bias: "Yes",     uptime: "99.95%", latency: "400ms", retention: "90 days",      exit: "Yes",     riskScore: 2, aiGov: 80, security: 95, dataHandling: 90, modelTransparency: 70, financial: 95, sla: 90, exitScore: 95, recommendation: "Highly Recommended" },
  { name: "NexaScale AI",     short: "NexaScale",    type: "GenAI API",      access: "Limited", cert: "SOC2, ISO27001", transparency: "Medium", location: "Multi-region", bias: "Yes",     uptime: "99.99%", latency: "300ms", retention: "Configurable", exit: "Yes",     riskScore: 2, aiGov: 90, security: 95, dataHandling: 85, modelTransparency: 70, financial: 100, sla: 95, exitScore: 90, recommendation: "Highly Recommended" },
  { name: "PrismLogic AI",    short: "PrismLogic",   type: "GenAI Platform", access: "Limited", cert: "SOC2",           transparency: "Low",    location: "US-only",      bias: "Partial", uptime: "99.5%",  latency: "350ms", retention: "30 days",      exit: "Partial", riskScore: 3, aiGov: 60, security: 70, dataHandling: 60, modelTransparency: 45, financial: 70, sla: 60, exitScore: 55, recommendation: "Needs monitoring" },
  { name: "SentinelIQ AI",    short: "SentinelIQ",   type: "GenAI API",      access: "Limited", cert: "SOC2, ISO27001", transparency: "High",   location: "US/EU",        bias: "Yes",     uptime: "99.9%",  latency: "450ms", retention: "30 days",      exit: "Yes",     riskScore: 2, aiGov: 85, security: 90, dataHandling: 85, modelTransparency: 90, financial: 88, sla: 85, exitScore: 92, recommendation: "Recommended" },
];

const SLA_DATA = Array.from({ length: 30 }, (_, i) => {
  const s = (n) => Math.sin(n * 127.1 + i * 311.7) * 0.5 + 0.5;
  return { day: i + 1, "ClarityCore API": +(99.85+s(1)*0.12).toFixed(3), "ArcVault AI": +(99.94+s(2)*0.08).toFixed(3), "NexaScale AI": +(99.97+s(3)*0.04).toFixed(3), "PrismLogic AI": +(99.30+s(4)*0.40).toFixed(3), "SentinelIQ AI": +(99.87+s(5)*0.10).toFixed(3) };
});

const REGS = [
  { reg: "BNM RMiT",              binding: true,  scope: "All BNM-licensed financial institutions",    focus: "Technology risk management, AI outsourcing, vendor due diligence, incident reporting" },
  { reg: "PDPA 2024",             binding: true,  scope: "All organisations processing personal data", focus: "Vendor direct liability, 72h breach notification, DPO required. Max fine: RM1,000,000" },
  { reg: "Cybersecurity Act 2024",binding: true,  scope: "Critical national infrastructure",           focus: "Mandatory cybersecurity controls and incident reporting for AI platforms" },
  { reg: "AIGE Guidelines",       binding: false, scope: "All industries using AI",                    focus: "7 principles: fairness, transparency, accountability, safety, data governance" },
  { reg: "IFSA 2013",             binding: true,  scope: "Takaful operators",                          focus: "Shariah governance for AI - fairness and explainability carry Islamic finance weight" },
];

const VC = { "ClarityCore API": P.orange, "ArcVault AI": P.teal1, "NexaScale AI": P.teal2, "PrismLogic AI": P.bad, "SentinelIQ AI": P.orangeLight };

const REC = {
  "Highly Recommended": { bg: P.goodLight,  text: P.good,  border: P.goodBorder  },
  "Recommended":        { bg: "#FEF3E8",    text: P.warn,  border: P.warnBorder  },
  "Needs monitoring":   { bg: P.warnLight,  text: P.warn,  border: P.warnBorder  },
  "Not Recommended":    { bg: P.badLight,   text: P.bad,   border: P.badBorder   },
};

const wScore = (v) => (v.security*0.25 + v.dataHandling*0.20 + v.modelTransparency*0.15 + v.financial*0.10 + v.sla*0.10 + v.exitScore*0.10 + v.aiGov*0.10).toFixed(1);
const scoreColor = (v) => v >= 80 ? P.good : v >= 60 ? P.warn : P.bad;
const barData = VENDORS.map(v => ({ name: v.short, score: parseFloat(wScore(v)), fill: VC[v.name] }));
const radarData = (v) => [
  { m: "Security", v: v.security }, { m: "Data", v: v.dataHandling },
  { m: "Transparency", v: v.modelTransparency }, { m: "Financial", v: v.financial },
  { m: "SLA", v: v.sla }, { m: "Exit", v: v.exitScore }, { m: "AI Gov", v: v.aiGov },
];

const Badge = ({ label, bg, text, border }) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 3, background: bg, color: text, border: `1px solid ${border}`, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
);

export default function App() {
  const [tab, setTab] = useState("overview");
  const [sel, setSel] = useState(null);

  const tabs = [
    { id: "overview",   label: "Overview"   },
    { id: "vendors",    label: "Vendors"    },
    { id: "sla",        label: "SLA"        },
    { id: "radar",      label: "Radar"      },
    { id: "regulatory", label: "Regulatory" },
    { id: "recommendations", label: "Recommendations" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", display: "flex", minHeight: "100vh", background: P.bg }}>

      {/* Sidebar */}
      <aside style={{ width: 210, background: P.teal4, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 18px", borderBottom: `1px solid ${P.teal2}` }}>
          <div style={{ width: 32, height: 4, background: P.orange, borderRadius: 2, marginBottom: 10 }} />
          <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 800, color: P.white, letterSpacing: "-0.02em" }}>Wawasan</p>
          <p style={{ margin: 0, fontSize: 9, color: P.orange, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>AI Governance</p>
        </div>

        <nav style={{ padding: "16px 10px", flex: 1 }}>
          <p style={{ margin: "0 10px 8px", fontSize: 9, fontWeight: 700, color: P.teal1, textTransform: "uppercase", letterSpacing: "0.12em" }}>Dashboard</p>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", textAlign: "left", padding: "8px 12px",
              fontSize: 13, border: "none", borderRadius: 5, cursor: "pointer", marginBottom: 2,
              background: tab === t.id ? P.orange : "transparent",
              color: tab === t.id ? P.white : P.muted,
              fontWeight: tab === t.id ? 700 : 400,
            }}>
              {t.label}
              {t.id === "sla" && <span style={{ fontSize: 9, background: P.bad, color: "#fff", padding: "1px 5px", borderRadius: 99, fontWeight: 800 }}>!</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${P.teal2}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 700, color: P.teal1, textTransform: "uppercase", letterSpacing: "0.12em" }}>Framework</p>
          {["BNM RMiT", "PDPA 2024", "AIGE", "IFSA 2013"].map(r => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: r === "AIGE" ? P.muted : P.orange, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: P.muted }}>{r}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "28px 28px 48px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{tabs.find(t => t.id === tab)?.label}</p>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.teal4, letterSpacing: "-0.04em" }}>
              {tab === "overview"   && "Vendor risk overview"}
              {tab === "vendors"    && "Vendor assessment"}
              {tab === "sla"        && "SLA monitoring"}
              {tab === "radar"      && "Radar comparison"}
              {tab === "regulatory" && "MY regulatory framework"}
              {tab === "recommendations" && "Findings & recommendations"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Badge label="BNM RMiT" bg={P.teal4} text={P.orange} border={P.teal2} />
            <Badge label="PDPA 2024" bg={P.teal3} text={P.muted} border={P.teal2} />
            <Badge label="Sep 2026" bg={P.border} text={P.teal2} border={P.border} />
          </div>
        </div>

        <div style={{ height: "1px", background: P.border, marginBottom: 22 }} />

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Vendors",      value: "5",   sub: "assessed",               color: P.teal4       },
                { label: "Highly rec.",  value: "2",   sub: "ArcVault, NexaScale",    color: P.good        },
                { label: "Recommended",  value: "2",   sub: "ClarityCore, SentinelIQ",color: P.orange      },
                { label: "Monitor",      value: "1",   sub: "PrismLogic AI",          color: P.warn        },
                { label: "SLA breach",   value: "1/5", sub: "PrismLogic AI",          color: P.bad         },
              ].map(k => (
                <div key={k.label} style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 10, padding: "14px 16px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{k.label}</p>
                  <p style={{ margin: "0 0 3px", fontSize: 26, fontWeight: 800, color: k.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{k.value}</p>
                  <p style={{ margin: 0, fontSize: 11, color: P.muted }}>{k.sub}</p>
                </div>
              ))}
            </div>

            <div style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: P.teal4 }}>Weighted governance score</p>
              <p style={{ margin: "0 0 14px", fontSize: 11, color: P.muted }}>Security 25% · Data 20% · Transparency 15% · Financial 10% · SLA 10% · Exit 10% · AI Gov 10%</p>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 48, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke={P.bg} />
                    <XAxis type="number" domain={[0,100]} tick={{ fontSize: 10, fill: P.muted }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: P.teal4, fontWeight: 600 }} width={82} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${P.border}`, background: P.white }} formatter={v => [`${v}`, "Score"]} cursor={{ fill: P.bg }} />
                    <Bar dataKey="score" radius={[0,4,4,0]} maxBarSize={20} label={{ position: "right", fontSize: 12, fontWeight: 700, fill: P.teal4, formatter: v => `${v}` }}>
                      {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
              {VENDORS.map(v => {
                const r = REC[v.recommendation];
                return (
                  <div key={v.name} onClick={() => { setSel(v); setTab("vendors"); }}
                    style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = P.orange; e.currentTarget.style.boxShadow = `0 4px 20px rgba(244,123,32,0.12)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 13, color: P.teal4 }}>{v.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: P.muted }}>{v.type}</p>
                      </div>
                      <Badge label={v.recommendation} bg={r.bg} text={r.text} border={r.border} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, borderTop: `1px solid ${P.bg}`, paddingTop: 10 }}>
                      {[["Risk", `${v.riskScore}/5`, v.riskScore >= 3 ? P.bad : P.good], ["Score", wScore(v), P.orange], ["Uptime", v.uptime, P.teal4]].map(([l, val, c]) => (
                        <div key={l}>
                          <p style={{ margin: "0 0 2px", fontSize: 10, color: P.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</p>
                          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: c, letterSpacing: "-0.02em" }}>{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VENDORS */}
        {tab === "vendors" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
              <button onClick={() => setSel(null)} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 5, border: `1px solid ${!sel ? P.orange : P.border}`, background: !sel ? P.orange : P.white, color: !sel ? P.white : P.muted, fontWeight: !sel ? 700 : 400, cursor: "pointer" }}>All</button>
              {VENDORS.map(v => (
                <button key={v.name} onClick={() => setSel(v)} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 5, border: `1px solid ${sel?.name===v.name ? VC[v.name] : P.border}`, background: sel?.name===v.name ? `${VC[v.name]}18` : P.white, color: sel?.name===v.name ? VC[v.name] : P.muted, fontWeight: sel?.name===v.name ? 700 : 400, cursor: "pointer" }}>{v.short}</button>
              ))}
            </div>

            {(sel ? [sel] : VENDORS).map(v => {
              const r = REC[v.recommendation];
              return (
                <div key={v.name} style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                    <div style={{ borderLeft: `3px solid ${VC[v.name]}`, paddingLeft: 12 }}>
                      <p style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 15, color: P.teal4 }}>{v.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: P.muted }}>{v.type} · {v.cert}</p>
                    </div>
                    <Badge label={v.recommendation} bg={r.bg} text={r.text} border={r.border} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 8, marginBottom: 14 }}>
                    {[["Security",v.security],["Data",v.dataHandling],["Transparency",v.modelTransparency],["Financial",v.financial],["SLA",v.sla],["Exit",v.exitScore],["AI Gov",v.aiGov]].map(([lbl,val]) => (
                      <div key={lbl} style={{ background: P.bg, borderRadius: 8, padding: "10px 12px" }}>
                        <p style={{ margin: "0 0 5px", fontSize: 10, color: P.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</p>
                        <div style={{ height: 3, borderRadius: 99, background: P.border, marginBottom: 5, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${val}%`, background: scoreColor(val), borderRadius: 99 }} />
                        </div>
                        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: scoreColor(val), letterSpacing: "-0.03em" }}>{val}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 6 }}>
                    {[["Data access",v.access],["Location",v.location],["Bias testing",v.bias],["Exit strategy",v.exit],["Uptime SLA",v.uptime],["Latency SLA",v.latency]].map(([k,val]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: P.bg, borderRadius: 6, fontSize: 12 }}>
                        <span style={{ color: P.muted }}>{k}</span>
                        <span style={{ fontWeight: 700, color: ["Partial","US-only","Low"].includes(val) ? P.warn : P.teal4 }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {v.name === "PrismLogic AI" && (
                    <div style={{ marginTop: 12, padding: "12px 14px", background: P.badLight, borderRadius: 8, borderLeft: `3px solid ${P.bad}` }}>
                      <p style={{ margin: "0 0 3px", fontWeight: 800, fontSize: 12, color: P.bad }}>BNM RMiT flag</p>
                      <p style={{ margin: 0, fontSize: 12, color: P.bad, opacity: 0.85, lineHeight: 1.5 }}>Low model transparency is incompatible with takaful Shariah audit requirements. Partial exit strategy requires documented migration plan before contract renewal.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* SLA */}
        {tab === "sla" && (
          <div>
            <div style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: P.teal4 }}>30-day uptime tracking</p>
                <Badge label="BNM threshold 99.9%" bg={P.badLight} text={P.bad} border={P.badBorder} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
                {VENDORS.map(v => (
                  <span key={v.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: P.muted }}>
                    <span style={{ width: 12, height: 3, borderRadius: 1, background: VC[v.name], display: "inline-block" }} />{v.short}
                  </span>
                ))}
              </div>
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SLA_DATA} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke={P.bg} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: P.muted }} axisLine={false} tickLine={false} />
                    <YAxis domain={[99.0,100.1]} tick={{ fontSize: 10, fill: P.muted }} tickFormatter={v=>`${v}%`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v,n)=>[`${v}%`,n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${P.border}`, background: P.white }} />
                    <ReferenceLine y={99.9} stroke={P.bad} strokeDasharray="4 2" strokeWidth={1.5} label={{ value: "99.9%", position: "insideTopRight", fontSize: 10, fill: P.bad }} />
                    {VENDORS.map(v => <Line key={v.name} type="monotone" dataKey={v.name} stroke={VC[v.name]} strokeWidth={v.name==="PrismLogic AI"?2.5:1.5} dot={false} strokeDasharray={v.name==="PrismLogic AI"?"5 3":undefined} />)}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
              {VENDORS.map(v => {
                const avg = (SLA_DATA.reduce((s,d)=>s+d[v.name],0)/SLA_DATA.length).toFixed(3);
                const ok = parseFloat(avg) >= 99.9;
                return (
                  <div key={v.name} style={{ background: ok ? P.goodLight : P.badLight, border: `1px solid ${ok ? P.goodBorder : P.badBorder}`, borderRadius: 10, padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: ok ? P.good : P.bad }}>{v.short}</p>
                    <p style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 800, color: ok ? P.good : P.bad, letterSpacing: "-0.03em" }}>{avg}%</p>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: ok ? P.good : P.bad }}>{ok ? "Compliant" : "Breach"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RADAR */}
        {tab === "radar" && (
          <div>
            <p style={{ fontSize: 13, color: P.muted, marginBottom: 18 }}>7-dimension governance profile per vendor</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
              {VENDORS.map(v => {
                const r = REC[v.recommendation];
                return (
                  <div key={v.name} style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 14, padding: "16px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 12, color: P.teal4 }}>{v.name}</p>
                      <Badge label={`${v.riskScore}/5`} bg={r.bg} text={r.text} border={r.border} />
                    </div>
                    <p style={{ margin: "0 0 8px", fontSize: 10, color: P.muted }}>Score {wScore(v)} · {v.recommendation}</p>
                    <div style={{ height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData(v)} margin={{ top: 10, right: 22, bottom: 10, left: 22 }}>
                          <PolarGrid stroke={P.border} />
                          <PolarAngleAxis dataKey="m" tick={{ fontSize: 9, fill: P.muted }} />
                          <Radar dataKey="v" stroke={VC[v.name]} fill={VC[v.name]} fillOpacity={0.15} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REGULATORY */}
        {tab === "regulatory" && (
          <div>
            <p style={{ fontSize: 13, color: P.muted, marginBottom: 18 }}>Malaysian regulatory framework for AI vendor governance in insurance and takaful</p>
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              {REGS.map(r => (
                <div key={r.reg} style={{ background: P.white, border: `1px solid ${P.border}`, borderLeft: `3px solid ${r.binding ? P.orange : P.muted}`, borderRadius: 0, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: P.teal4 }}>{r.reg}</span>
                    <Badge label={r.binding ? "Legally binding" : "Voluntary"} bg={r.binding ? P.teal4 : P.bg} text={r.binding ? P.orange : P.muted} border={r.binding ? P.teal3 : P.border} />
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: P.muted }}>Scope: {r.scope}</p>
                  <p style={{ margin: 0, fontSize: 12, color: P.teal1, lineHeight: 1.5 }}>{r.focus}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 10 }}>
              <div style={{ background: P.goodLight, border: `1px solid ${P.goodBorder}`, borderRadius: 10, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 12, color: P.good }}>Takaful note</p>
                <p style={{ margin: 0, fontSize: 12, color: P.good, lineHeight: 1.6, opacity: 0.9 }}>AI models in takaful must be auditable for Shariah-compliant outputs under IFSA 2013. PrismLogic AI's low transparency makes it incompatible without remediation.</p>
              </div>
              <div style={{ background: P.warnLight, border: `1px solid ${P.warnBorder}`, borderRadius: 10, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 12, color: P.warn }}>Gap vs global standards</p>
                <p style={{ margin: 0, fontSize: 12, color: P.warn, lineHeight: 1.6, opacity: 0.9 }}>No binding explainability law yet - AIGE is voluntary. No automated decision-making rights unlike EU GDPR. Both expected in Malaysian legislation by 2027.</p>
              </div>
            </div>
          </div>
        )}


        {tab === "recommendations" && (
          <div>
            <p style={{ fontSize: 13, color: P.muted, marginBottom: 18 }}>Based on the vendor risk scoring, SLA monitoring, and regulatory mapping analysis</p>

            {/* Findings */}
            <p style={{ fontSize: 11, fontWeight: 700, color: P.teal4, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Key findings</p>
            <div style={{ display: "grid", gap: 8, marginBottom: 22 }}>
              {[
                { flag: "Critical", color: P.bad, bg: P.badLight, border: P.badBorder, title: "PrismLogic AI - active SLA breach", body: "Averaging 99.51% uptime against the BNM RMiT minimum of 99.9%. Low model transparency is directly incompatible with takaful Shariah audit requirements under IFSA 2013." },
                { flag: "Finding", color: P.teal2, bg: P.offwhite, border: P.border, title: "Two vendors Highly Recommended", body: "ArcVault AI (88.3) and NexaScale AI (88.8) hold SOC2 + ISO27001, conduct full bias testing, and have strong exit strategies. Suitable as primary or backup vendors for critical workloads." },
                { flag: "Finding", color: P.teal2, bg: P.offwhite, border: P.border, title: "Model update notification risk is concentrated", body: "Sensitivity analysis shows a 10-point drop in any single criterion pushes PrismLogic AI from Needs Monitoring into Not Recommended. No contractual update notification clause is currently enforced." },
                { flag: "Gap", color: P.warn, bg: P.warnLight, border: P.warnBorder, title: "Malaysian regulatory gap is material", body: "AIGE Guidelines covering fairness and explainability are currently voluntary. Vendors with Low transparency are technically compliant today but will face binding requirements expected by 2027." },
              ].map(r => (
                <div key={r.title} style={{ background: r.bg, border: `1px solid ${r.border}`, borderLeft: `3px solid ${r.color}`, borderRadius: 0, padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", background: r.color, color: "#fff", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>{r.flag}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: P.teal4 }}>{r.title}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: P.teal1, lineHeight: 1.6 }}>{r.body}</p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <p style={{ fontSize: 11, fontWeight: 700, color: P.teal4, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Recommendations</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 10, marginBottom: 18 }}>
              {[
                { timeline: "0-30 days", color: P.bad, items: [
                  "Suspend or replace PrismLogic AI for all takaful workloads immediately",
                  "Invoke SLA penalty clause for uptime breach and begin parallel testing on ArcVault AI",
                  "Issue formal vendor notice requiring PrismLogic AI remediation plan within 30 days",
                ]},
                { timeline: "30-90 days", color: P.warn, items: [
                  "Enforce 14-day model update notification clause across all five vendor contracts",
                  "Conduct PDPA 2024 data processor audit for ClarityCore API and ArcVault AI (Full data access)",
                  "Validate PrismLogic AI exit plan with a live failover test before contract renewal",
                ]},
                { timeline: "Ongoing", color: P.good, items: [
                  "Quarterly vendor risk reviews using the weighted scoring framework",
                  "Monthly SLA performance review across uptime, latency, and model update logs",
                  "Monitor AIGE Guidelines for transition to binding legislation by 2027",
                ]},
              ].map(g => (
                <div key={g.timeline} style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: P.teal4 }}>{g.timeline}</p>
                  </div>
                  {g.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: g.color, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>-</span>
                      <p style={{ margin: 0, fontSize: 12, color: P.teal1, lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Strategic rec */}
            <div style={{ background: P.teal4, borderRadius: 10, padding: "16px 20px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 800, color: P.orange }}>Strategic recommendation</p>
              <p style={{ margin: 0, fontSize: 12, color: P.muted, lineHeight: 1.6 }}>Wawasan InsurTech should maintain a minimum of two active vendor relationships for any critical AI workload, per BNM RMiT operational resilience principles. The current portfolio has too much concentration risk - three vendors share similar profiles while PrismLogic AI represents a single point of governance failure across the takaful product line.</p>
            </div>
          </div>
        )}

        <p style={{ marginTop: 36, fontSize: 11, color: P.border, textAlign: "center" }}>Wawasan InsurTech · AI Vendor Risk Assessment · BNM RMiT · AIGE · PDPA 2024 · IFSA 2013</p>
      </main>
    </div>
  );
}
