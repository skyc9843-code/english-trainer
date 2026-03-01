import { useState, useEffect, useRef, useCallback } from "react";

const curriculum = {
  weeks: [
    { id: 1, title: "Week 1 · Interview Mastery", color: "#E8FF47", days: [
      { day: 1, topic: "Self Introduction", scene: "interview", desc: "Tell me about yourself — 60-second pitch", tags: ["Opening", "Personal Brand"] },
      { day: 2, topic: "Why This Role?", scene: "interview", desc: "Motivation & fit questions", tags: ["Motivation", "Research"] },
      { day: 3, topic: "STAR Stories", scene: "interview", desc: "Situation-Task-Action-Result method", tags: ["Behavioral", "Storytelling"] },
      { day: 4, topic: "Strengths & Weaknesses", scene: "interview", desc: "Answering with confidence and honesty", tags: ["Self-awareness"] },
      { day: 5, topic: "Social Media Knowledge", scene: "interview", desc: "Discuss platforms, metrics, trends", tags: ["Expertise", "Industry"] },
      { day: 6, topic: "Questions to Ask", scene: "interview", desc: "Smart questions for your interviewer", tags: ["Curiosity", "Closing"] },
      { day: 7, topic: "Mock Interview", scene: "review", desc: "Full 20-min mock session + review", tags: ["Practice", "Review"] },
    ]},
    { id: 2, title: "Week 2 · Workplace Speaking", color: "#47C8FF", days: [
      { day: 8, topic: "Team Introductions", scene: "workplace", desc: "First day, meet the team", tags: ["Networking", "Icebreakers"] },
      { day: 9, topic: "Status Updates", scene: "workplace", desc: "Daily standups & progress reports", tags: ["Updates", "Clarity"] },
      { day: 10, topic: "Asking for Help", scene: "workplace", desc: "Polite requests and clarifications", tags: ["Collaboration", "Politeness"] },
      { day: 11, topic: "Giving Feedback", scene: "workplace", desc: "Constructive & diplomatic feedback", tags: ["Feedback", "Tact"] },
      { day: 12, topic: "Disagreeing Professionally", scene: "workplace", desc: "Push back without conflict", tags: ["Assertiveness", "Diplomacy"] },
      { day: 13, topic: "Small Talk & Rapport", scene: "workplace", desc: "Build relationships beyond work", tags: ["Rapport", "Culture"] },
      { day: 14, topic: "Speaking Review", scene: "review", desc: "Record yourself, compare to Week 1", tags: ["Review", "Progress"] },
    ]},
    { id: 3, title: "Week 3 · Meetings & Presentations", color: "#FF7847", days: [
      { day: 15, topic: "Meeting Openers", scene: "meeting", desc: "Kicking off and setting agendas", tags: ["Structure", "Leadership"] },
      { day: 16, topic: "Participating Actively", scene: "meeting", desc: "Jump in, hold the floor, redirect", tags: ["Interrupting politely", "Engagement"] },
      { day: 17, topic: "Campaign Pitch", scene: "meeting", desc: "Present a social media strategy", tags: ["Presenting", "Persuasion"] },
      { day: 18, topic: "Data & Metrics Talk", scene: "meeting", desc: "Discuss KPIs, ROI, reach, engagement", tags: ["Analytics", "Numbers"] },
      { day: 19, topic: "Handling Q&A", scene: "meeting", desc: "Answer tough questions gracefully", tags: ["Q&A", "Confidence"] },
      { day: 20, topic: "Virtual Meeting Etiquette", scene: "meeting", desc: "Zoom/Teams best practices", tags: ["Remote", "Professionalism"] },
      { day: 21, topic: "Meeting Review", scene: "review", desc: "Phrases bank consolidation", tags: ["Review", "Vocabulary"] },
    ]},
    { id: 4, title: "Week 4 · Email & Written Comms", color: "#C847FF", days: [
      { day: 22, topic: "Professional Email Format", scene: "email", desc: "Structure, subject lines, sign-offs", tags: ["Format", "Tone"] },
      { day: 23, topic: "Project Updates", scene: "email", desc: "Clear, concise status emails", tags: ["Clarity", "Updates"] },
      { day: 24, topic: "Requesting & Following Up", scene: "email", desc: "Ask without sounding pushy", tags: ["Requests", "Follow-up"] },
      { day: 25, topic: "Handling Complaints", scene: "email", desc: "Respond to unhappy clients/managers", tags: ["Problem-solving", "Empathy"] },
      { day: 26, topic: "Social Copy Writing", scene: "email", desc: "English captions, CTAs, hashtag strategy", tags: ["Copywriting", "Creativity"] },
      { day: 27, topic: "Slack & Async Comms", scene: "email", desc: "Short messages, reactions, threading", tags: ["Async", "Brevity"] },
      { day: 28, topic: "Email Review", scene: "review", desc: "Write 3 emails end-to-end", tags: ["Review", "Practice"] },
    ]},
  ],
  bonusDays: [
    { day: 29, topic: "Final Mock Interview", scene: "review", desc: "Full simulation with AI feedback", tags: ["Final", "Interview"] },
    { day: 30, topic: "Graduation Review", scene: "review", desc: "Your progress report & next steps", tags: ["Final", "Celebration"] },
  ]
};

const meetingAudioScripts = {
  15: { title: "Meeting Openers", sentences: [
    "Good morning everyone, thanks for joining. Let's get started.",
    "Today's agenda has three items: campaign review, Q3 targets, and AOB.",
    "We have about forty-five minutes, so let's keep things moving.",
    "Before we dive in, does anyone have anything urgent to flag?",
    "Great. Sarah, would you like to kick us off with the campaign update?",
  ]},
  16: { title: "Participating Actively", sentences: [
    "Sorry to jump in here — I just wanted to add something quickly.",
    "That's a great point. Building on what you said, I think we should also consider...",
    "Can I just pause us there? I want to make sure I understood correctly.",
    "I'd actually push back on that slightly. The data we have suggests otherwise.",
    "Could we come back to that after we've covered the main agenda items?",
  ]},
  17: { title: "Campaign Pitch", sentences: [
    "I'd like to walk you through our proposed social media strategy for Q3.",
    "Our primary objective is to grow brand awareness among the eighteen-to-thirty-five demographic.",
    "We're recommending a short-form video-first approach across TikTok and Instagram Reels.",
    "Based on competitor benchmarks, we project a thirty percent increase in reach within sixty days.",
    "I'll now hand over to the slide on budget breakdown — any questions so far?",
  ]},
  18: { title: "Data & Metrics Talk", sentences: [
    "Looking at last month's performance, our engagement rate was up twelve percent.",
    "Our cost per click came in at point eight dollars, which is below the industry average.",
    "The conversion funnel shows a drop-off at the checkout stage — that's our main focus area.",
    "Reach grew by twenty-two thousand unique users, largely driven by the influencer collab.",
    "ROI for the paid campaign was two-point-four times, which exceeded our initial target.",
  ]},
  19: { title: "Handling Q&A", sentences: [
    "That's a really good question. Let me think about that for a second.",
    "I don't have that data with me right now, but I'll follow up by end of day.",
    "To clarify what I meant earlier — the timeline is flexible, not fixed.",
    "I hear your concern. I think the risk is manageable if we phase the rollout.",
    "Is there anything else you'd like me to go into more detail on?",
  ]},
  20: { title: "Virtual Meeting Etiquette", sentences: [
    "Sorry, I think you might be on mute — could you say that again?",
    "I'm going to share my screen now. Can everyone see the deck?",
    "Let's make sure we wrap up five minutes early to leave time for next steps.",
    "I'll send a summary email with action items within the hour.",
    "Thanks everyone for a productive session. Same time next week?",
  ]},
  21: { title: "Meeting Phrases Review", sentences: [
    "Let's circle back to the open items from last week.",
    "I want to make sure we're aligned before we move forward.",
    "That's outside the scope of today's meeting, but worth a separate conversation.",
    "Can we put a thirty-minute slot in the diary to hash this out?",
    "I'll take that as an action item and report back next Tuesday.",
  ]},
};

const phrases = {
  interview: [
    { en: "I'm particularly drawn to this role because...", zh: "我对这个职位特别感兴趣，因为……" },
    { en: "In my previous experience, I successfully...", zh: "在我之前的工作中，我成功地……" },
    { en: "One of my key strengths is my ability to...", zh: "我的核心优势之一是我能够……" },
    { en: "I'd love to hear more about the team's current priorities.", zh: "我很想了解团队目前的工作重点。" },
    { en: "Could you tell me more about what success looks like in this role?", zh: "您能告诉我这个职位的成功标准是什么吗？" },
  ],
  workplace: [
    { en: "Just wanted to loop you in on...", zh: "想让你了解一下……" },
    { en: "Does that make sense, or would you like me to clarify?", zh: "这样说清楚了吗，还是需要我进一步解释？" },
    { en: "I totally see your point, and I'd also like to add...", zh: "我完全理解你的观点，我还想补充……" },
    { en: "Could we circle back to this later?", zh: "我们可以稍后再讨论这个问题吗？" },
    { en: "Happy to take that off your plate.", zh: "我很乐意帮你分担这个任务。" },
  ],
  meeting: [
    { en: "Let's kick things off — today's agenda covers...", zh: "我们开始吧——今天的议程包括……" },
    { en: "I'd like to build on what you just said...", zh: "我想在你刚才说的基础上补充……" },
    { en: "Can we take a step back and look at the bigger picture?", zh: "我们能退一步，从全局角度来看吗？" },
    { en: "Let's put a pin in that and come back to it.", zh: "我们先记下来，稍后再回到这个话题。" },
    { en: "Our engagement rate increased by 40% quarter-over-quarter.", zh: "我们的互动率环比增长了40%。" },
  ],
  email: [
    { en: "I hope this email finds you well.", zh: "希望您一切安好。" },
    { en: "Please find the attached report for your review.", zh: "请查收附件中的报告。" },
    { en: "I wanted to follow up on my previous email regarding...", zh: "我想跟进一下之前关于……的邮件。" },
    { en: "Could you please advise on the next steps?", zh: "请问下一步该如何进行？" },
    { en: "Looking forward to your feedback.", zh: "期待您的反馈。" },
  ],
};

const aiPrompts = {
  interview: (t) => `You are a friendly English interview coach for a Chinese social media marketer applying to remote overseas jobs. Today's topic is "${t}". Give ONE realistic interview question, then: 1. A model answer (3-4 sentences, natural spoken English) 2. 3 key vocabulary/phrases with Chinese translations 3. One common mistake Chinese speakers make and how to fix it. Format clearly with headers.`,
  workplace: (t) => `You are a workplace English coach. Scenario: "${t}" for a remote social media role. Create ONE realistic scenario/dialogue, then: 1. A model response (natural, professional English) 2. 3 key expressions with Chinese translations 3. One Western workplace culture tip relevant to this scenario.`,
  meeting: (t) => `You are a business English trainer. Focus: "${t}" for virtual meetings in social media marketing. Provide: 1. ONE meeting scenario with model phrases (3-4 key lines) 2. 3 power phrases with Chinese translations 3. One tip for non-native speakers to sound more confident in meetings.`,
  email: (t) => `You are a professional email writing coach. Topic: "${t}" for a social media marketer at an overseas company. Provide: 1. ONE sample email (complete, under 150 words) 2. 3 key email phrases with Chinese translations 3. One common email mistake and the better alternative.`,
  review: (t) => `You are an English learning coach. Review session: "${t}". Provide: 1. Three practice prompts to test this week's learning 2. A confidence-building tip for job seekers 3. Self-assessment suggestion: what to record/practice.`,
};

const vocabPrompt = (text) => `Extract 5-8 important vocabulary words or phrases from this English lesson for a Chinese learner. Return ONLY a JSON array with no markdown fences:
[{"word":"engagement rate","phonetic":"/ɪnˈɡeɪdʒmənt reɪt/","partOfSpeech":"n.","zh":"互动率","example":"Our engagement rate increased by 40% this quarter."}]
Lesson:
${text.slice(0, 1500)}`;

const SC = { interview: "#E8FF47", workplace: "#47C8FF", meeting: "#FF7847", email: "#C847FF", review: "#47FFB8" };
const SL = { interview: "Interview", workplace: "Workplace", meeting: "Meeting", email: "Email", review: "Review" };

const gs = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const ss = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function useTTS() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const speak = useCallback((text, idx = -1, rate = 0.85) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate; u.lang = "en-US";
    const vv = window.speechSynthesis.getVoices();
    const pick = vv.find(v => v.name.includes("Samantha") || v.name.includes("Google US English")) || vv.find(v => v.lang === "en-US");
    if (pick) u.voice = pick;
    u.onstart = () => setActiveIdx(idx);
    u.onend = u.onerror = () => setActiveIdx(-1);
    window.speechSynthesis.speak(u);
  }, []);
  const stop = useCallback(() => { window.speechSynthesis.cancel(); setActiveIdx(-1); }, []);
  return { speak, stop, activeIdx };
}

export default function App() {
  const [view, setView] = useState("home");
  const [done, setDone] = useState(() => gs("done30", []));
  const [vocab, setVocab] = useState(() => gs("vocab30", []));
  const [selDay, setSelDay] = useState(null);
  const [lessonText, setLessonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [activeScene, setActiveScene] = useState("interview");
  const [shadowRate, setShadowRate] = useState(0.85);
  const [shadowDone, setShadowDone] = useState({});
  const [flashMode, setFlashMode] = useState(false);
  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [vocabFilter, setVocabFilter] = useState("all");
  const tts = useTTS();

  const allDays = [...curriculum.weeks.flatMap(w => w.days), ...curriculum.bonusDays];
  const progress = Math.round((done.length / 30) * 100);

  const markDone = (day) => {
    const u = done.includes(day) ? done.filter(d => d !== day) : [...done, day];
    setDone(u); ss("done30", u);
  };

  const addVocab = useCallback((words) => {
    setVocab(prev => {
      const ex = new Set(prev.map(v => v.word.toLowerCase()));
      const fresh = words.filter(w => w.word && !ex.has(w.word.toLowerCase())).map(w => ({ ...w, mastered: false, addedAt: Date.now() }));
      const u = [...prev, ...fresh];
      ss("vocab30", u);
      return u;
    });
  }, []);

  const loadLesson = async (dayObj) => {
    setSelDay(dayObj); setLessonText(""); setLoading(true);
    setShadowDone({}); setView("lesson");
    try {
      const prompt = (aiPrompts[dayObj.scene] || aiPrompts.review)(dayObj.topic);
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "Failed to load.";
      setLessonText(text);
      extractVocab(text, dayObj.scene);
    } catch { setLessonText("Network error. Please try again."); }
    setLoading(false);
  };

  const extractVocab = async (text, scene) => {
    setExtracting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 600, messages: [{ role: "user", content: vocabPrompt(text) }] })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const words = JSON.parse(raw);
      addVocab(words.map(w => ({ ...w, scene })));
    } catch {}
    setExtracting(false);
  };

  const isMeeting = selDay?.scene === "meeting";
  const script = selDay ? meetingAudioScripts[selDay.day] : null;

  const filtVocab = vocabFilter === "all" ? vocab : vocabFilter === "mastered" ? vocab.filter(v => v.mastered) : vocab.filter(v => v.scene === vocabFilter);

  const toggleMastered = (word) => {
    const u = vocab.map(v => v.word === word ? { ...v, mastered: !v.mastered } : v);
    setVocab(u); ss("vocab30", u);
  };
  const removeWord = (word) => {
    const u = vocab.filter(v => v.word !== word);
    setVocab(u); ss("vocab30", u);
  };

  const playAll = () => {
    if (!script) return;
    window.speechSynthesis.cancel();
    let idx = 0;
    const next = () => {
      if (idx >= script.sentences.length) return;
      const s = script.sentences[idx];
      const u = new SpeechSynthesisUtterance(s);
      u.rate = shadowRate; u.lang = "en-US";
      const vv = window.speechSynthesis.getVoices();
      const pick = vv.find(v => v.name.includes("Samantha") || v.name.includes("Google US English")) || vv.find(v => v.lang === "en-US");
      if (pick) u.voice = pick;
      u.onend = () => { idx++; setTimeout(next, 600); };
      window.speechSynthesis.speak(u);
    };
    next();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080809", color: "#ECEAE4", fontFamily: "'Space Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .sf{font-family:'DM Serif Display',serif}
        .tag{display:inline-block;padding:2px 7px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:2px}
        .dc{border:1px solid #1C1C1C;background:#0E0E0E;padding:16px;cursor:pointer;transition:all .18s;position:relative}
        .dc:hover{transform:translateY(-2px);border-color:#333}
        .nb{background:none;border:1px solid #252525;color:#777;padding:7px 16px;cursor:pointer;font-family:'Space Mono';font-size:11px;letter-spacing:1px;transition:all .2s}
        .nb:hover{border-color:#444;color:#BBB}
        .nb.on{border-color:#E8FF47;color:#E8FF47}
        .pb{height:3px;background:#161616;overflow:hidden}
        .pf{height:100%;background:linear-gradient(90deg,#E8FF47,#47C8FF,#C847FF);transition:width .5s}
        .lc{white-space:pre-wrap;line-height:1.85;font-size:13px;color:#B8B4AC}
        .pc{border-left:3px solid;padding:12px 16px;margin:8px 0;background:#0C0C0C}
        .sc{background:none;border:1px solid #222;padding:6px 13px;cursor:pointer;font-family:'Space Mono';font-size:11px;transition:all .2s;color:#555}
        .sc.on{font-weight:700}
        .pulse{animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .ss{padding:13px 15px;border:1px solid #1C1C1C;margin:8px 0;cursor:pointer;transition:all .18s;background:#0C0C0C;border-radius:3px}
        .ss:hover{border-color:#FF784766}
        .ss.active{border-color:#FF7847;background:#160D09}
        .flip-wrap{perspective:900px;cursor:pointer}
        .flip-inner{transition:transform .5s;transform-style:preserve-3d;position:relative;min-height:210px}
        .flip-inner.flipped{transform:rotateY(180deg)}
        .flip-f,.flip-b{backface-visibility:hidden;position:absolute;width:100%;top:0;left:0;padding:32px;border-radius:4px}
        .flip-b{transform:rotateY(180deg)}
        .vrow{border-bottom:1px solid #151515;padding:14px 0;display:flex;align-items:flex-start;gap:14px}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#252525}
        input[type=range]{-webkit-appearance:none;height:3px;background:#2A2A2A;outline:none;border-radius:2px;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;background:#FF7847;border-radius:50%}
        .ibtn{background:none;border:1px solid #1C1C1C;color:#555;padding:4px 9px;cursor:pointer;font-family:'Space Mono';font-size:10px}
        .ibtn:hover{border-color:#444;color:#999}
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: "1px solid #111", padding: "13px 22px", display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", position: "sticky", top: 0, background: "#080809", zIndex: 100 }}>
        <div onClick={() => setView("home")} style={{ cursor: "pointer", marginRight: 10 }}>
          <span className="sf" style={{ fontSize: 17, color: "#E8FF47" }}>30-Day</span>
          <span style={{ fontSize: 9, color: "#3A3A3A", marginLeft: 7, letterSpacing: 2 }}>ENGLISH SPRINT</span>
        </div>
        {[["home","Home"],["curriculum","Curriculum"],["phrasebook","Phrases"],["vocab",`Vocab${vocab.length ? ` (${vocab.length})` : ""}`]].map(([id, label]) => (
          <button key={id} className={`nb ${view === id ? "on" : ""}`} onClick={() => setView(id)}>{label}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 10, color: "#3A3A3A" }}>{done.length}/30</span>
          <div style={{ width: 90 }}><div className="pb"><div className="pf" style={{ width: `${progress}%` }} /></div></div>
          <span style={{ fontSize: 10, color: "#E8FF47" }}>{progress}%</span>
        </div>
      </nav>

      {/* HOME */}
      {view === "home" && (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 24px" }}>
          <p style={{ color: "#E8FF47", fontSize: 9, letterSpacing: 4, marginBottom: 18 }}>FOR CHINESE JOB SEEKERS → OVERSEAS REMOTE</p>
          <h1 className="sf" style={{ fontSize: "clamp(44px,6vw,78px)", lineHeight: 1.02, marginBottom: 20 }}>
            30天英语<br /><em style={{ color: "#47C8FF" }}>职场突击</em>
          </h1>
          <p style={{ color: "#555", fontSize: 13, maxWidth: 460, lineHeight: 1.85, marginBottom: 52 }}>
            专为社媒营销求职者设计。覆盖面试、职场沟通、会议音频跟读和邮件写作，AI辅助 + 自动生词本。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 10, marginBottom: 52 }}>
            {[{n:"30",l:"天计划",c:"#E8FF47"},{n:"4",l:"核心场景",c:"#47C8FF"},{n:"🎧",l:"会议音频跟读",c:"#FF7847"},{n:"AI",l:"自动生词本",c:"#C847FF"}].map(s=>(
              <div key={s.l} style={{ border: "1px solid #181818", padding: "20px 16px", background: "#0C0C0C" }}>
                <div className="sf" style={{ fontSize: 30, color: s.c }}>{s.n}</div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
          {(() => {
            const next = allDays.find(d => !done.includes(d.day)) || allDays[0];
            return (
              <div style={{ border: "1px solid #E8FF4733", padding: "28px", background: "#0B0B08", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                <div>
                  <p style={{ fontSize: 9, color: "#E8FF47", letterSpacing: 3, marginBottom: 10 }}>TODAY'S LESSON</p>
                  <div className="sf" style={{ fontSize: 24 }}>Day {next.day}: {next.topic}</div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 5 }}>{next.desc}</div>
                </div>
                <button onClick={() => loadLesson(next)} style={{ background: "#E8FF47", color: "#080809", border: "none", padding: "12px 28px", fontFamily: "Space Mono", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>START →</button>
              </div>
            );
          })()}
        </div>
      )}

      {/* CURRICULUM */}
      {view === "curriculum" && (
        <div style={{ maxWidth: 1020, margin: "0 auto", padding: "40px 24px" }}>
          <h2 className="sf" style={{ fontSize: 38, marginBottom: 6 }}>30-Day Curriculum</h2>
          <p style={{ color: "#444", fontSize: 11, marginBottom: 40 }}>Meeting课程含🎧音频跟读 · 点击任意一天开始</p>
          {curriculum.weeks.map(week => (
            <div key={week.id} style={{ marginBottom: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 3, background: week.color }} />
                <h3 style={{ fontSize: 11, letterSpacing: 2, color: week.color }}>{week.title}</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(235px,1fr))", gap: 9 }}>
                {week.days.map(day => (
                  <div key={day.day} className="dc" style={{ opacity: done.includes(day.day) ? 0.5 : 1 }} onClick={() => loadLesson(day)}>
                    {done.includes(day.day) && <div style={{ position: "absolute", top: 10, right: 10, color: "#47FFB8", fontSize: 13 }}>✓</div>}
                    {day.scene === "meeting" && meetingAudioScripts[day.day] && <span style={{ position: "absolute", top: 10, right: done.includes(day.day) ? 28 : 10, fontSize: 11 }}>🎧</span>}
                    <div style={{ display: "flex", gap: 7, marginBottom: 7, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: week.color }}>DAY {day.day}</span>
                      <span style={{ fontSize: 8, color: "#3A3A3A", background: "#161616", padding: "2px 5px" }}>{SL[day.scene]}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{day.topic}</div>
                    <div style={{ fontSize: 11, color: "#484848" }}>{day.desc}</div>
                    <div style={{ marginTop: 9 }}>{day.tags.map(t => <span key={t} className="tag" style={{ background: week.color + "14", color: week.color }}>{t}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 3, background: "#FFD700" }} />
              <h3 style={{ fontSize: 11, letterSpacing: 2, color: "#FFD700" }}>BONUS DAYS</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(235px,1fr))", gap: 9 }}>
              {curriculum.bonusDays.map(day => (
                <div key={day.day} className="dc" style={{ borderColor: "#FFD70022", opacity: done.includes(day.day) ? 0.5 : 1 }} onClick={() => loadLesson(day)}>
                  <div style={{ fontSize: 9, color: "#FFD700", marginBottom: 7 }}>DAY {day.day} ★</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{day.topic}</div>
                  <div style={{ fontSize: 11, color: "#484848" }}>{day.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LESSON */}
      {view === "lesson" && selDay && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px" }}>
          <button onClick={() => { tts.stop(); setView("curriculum"); }} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 12, marginBottom: 28 }}>← Back</button>
          <div style={{ borderLeft: `4px solid ${SC[selDay.scene] || "#E8FF47"}`, paddingLeft: 18, marginBottom: 32 }}>
            <div style={{ fontSize: 9, color: SC[selDay.scene], letterSpacing: 3, marginBottom: 7 }}>
              DAY {selDay.day} · {SL[selDay.scene]?.toUpperCase()}
              {isMeeting && script && <span style={{ marginLeft: 10 }}>🎧 AUDIO SHADOWING</span>}
            </div>
            <h1 className="sf" style={{ fontSize: 32, marginBottom: 7 }}>{selDay.topic}</h1>
            <p style={{ color: "#555", fontSize: 12 }}>{selDay.desc}</p>
          </div>

          {/* AI content */}
          <div style={{ border: "1px solid #181818", padding: 22, background: "#0B0B0B", marginBottom: 24, minHeight: 160 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "44px 0" }}>
                <div className="pulse" style={{ color: "#E8FF47", fontSize: 11, letterSpacing: 3 }}>GENERATING LESSON...</div>
                <div style={{ color: "#2A2A2A", fontSize: 10, marginTop: 7 }}>AI正在生成内容...</div>
              </div>
            ) : <div className="lc">{lessonText}</div>}
          </div>

          {extracting && <div className="pulse" style={{ fontSize: 10, color: "#C847FF", marginBottom: 14, letterSpacing: 1 }}>📖 自动提取生词到词汇本...</div>}

          {/* MEETING SHADOWING */}
          {isMeeting && script && (
            <div style={{ border: "1px solid #FF784733", background: "#0C0908", padding: 22, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#FF7847", letterSpacing: 2, marginBottom: 4 }}>🎧 AUDIO SHADOWING · 音频跟读</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{script.title} · {script.sentences.length} sentences</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "#444" }}>语速</span>
                  <input type="range" min="0.55" max="1.1" step="0.05" value={shadowRate} onChange={e => setShadowRate(parseFloat(e.target.value))} style={{ width: 80 }} />
                  <span style={{ fontSize: 11, color: "#FF7847" }}>{Math.round(shadowRate * 100)}%</span>
                  <button className="ibtn" onClick={() => setShadowDone({})}>Reset ✕</button>
                </div>
              </div>

              <p style={{ fontSize: 10, color: "#3A3A3A", marginBottom: 14, lineHeight: 1.6 }}>
                ▶ 点击播放键听朗读 → 暗读或开口跟读 → ✓ 标记完成 · 可反复练习
              </p>

              {script.sentences.map((sent, idx) => {
                const isActive = tts.activeIdx === idx;
                const isDone = shadowDone[idx] >= 1;
                return (
                  <div key={idx} className={`ss ${isActive ? "active" : ""}`} style={{ borderColor: isActive ? "#FF7847" : isDone ? "#47FFB822" : "#1C1C1C" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 10, color: "#2A2A2A", minWidth: 18, paddingTop: 2 }}>{idx + 1}</span>
                      <div style={{ flex: 1, fontSize: 14, lineHeight: 1.7, color: isActive ? "#FF9966" : isDone ? "#666" : "#D8D4CC" }}>{sent}</div>
                      <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                        <button onClick={() => tts.speak(sent, idx, shadowRate)}
                          style={{ background: isActive ? "#FF7847" : "#160D09", border: `1px solid ${isActive ? "#FF7847" : "#2A1510"}`, color: isActive ? "#080809" : "#FF7847", padding: "5px 11px", cursor: "pointer", fontFamily: "Space Mono", fontSize: 11, minWidth: 46 }}>
                          {isActive ? "▐▐" : "▶"}
                        </button>
                        <button onClick={() => setShadowDone(p => ({ ...p, [idx]: (p[idx] || 0) + 1 }))}
                          style={{ background: isDone ? "#081808" : "none", border: `1px solid ${isDone ? "#47FFB8" : "#252525"}`, color: isDone ? "#47FFB8" : "#3A3A3A", padding: "5px 10px", cursor: "pointer", fontFamily: "Space Mono", fontSize: 11 }}>
                          ✓
                        </button>
                      </div>
                    </div>
                    {shadowDone[idx] > 0 && <div style={{ marginTop: 5, marginLeft: 30, fontSize: 9, color: "#47FFB8" }}>跟读 {shadowDone[idx]}次 ✓</div>}
                  </div>
                );
              })}

              <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
                <button onClick={playAll} style={{ background: "#FF7847", color: "#080809", border: "none", padding: "10px 22px", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>▶ Play All</button>
                <button onClick={tts.stop} className="nb">■ Stop</button>
                <span style={{ marginLeft: 8, fontSize: 10, color: "#3A3A3A", alignSelf: "center" }}>
                  {Object.values(shadowDone).filter(v => v >= 1).length}/{script.sentences.length} completed
                </span>
              </div>
            </div>
          )}

          {/* Phrase bank */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, color: "#3A3A3A", letterSpacing: 2, marginBottom: 10 }}>PHRASE BANK</div>
            {(phrases[selDay.scene] || phrases.interview).slice(0, 3).map((p, i) => (
              <div key={i} className="pc" style={{ borderColor: SC[selDay.scene] || "#E8FF47" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, marginBottom: 3 }}>{p.en}</div>
                    <div style={{ fontSize: 11, color: "#484848" }}>{p.zh}</div>
                  </div>
                  <button className="ibtn" onClick={() => tts.speak(p.en)}>🔊</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            <button onClick={() => markDone(selDay.day)} style={{
              background: done.includes(selDay.day) ? "#081808" : "#E8FF47",
              color: done.includes(selDay.day) ? "#47FFB8" : "#080809",
              border: `1px solid ${done.includes(selDay.day) ? "#47FFB8" : "#E8FF47"}`,
              padding: "11px 24px", cursor: "pointer", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700
            }}>{done.includes(selDay.day) ? "✓ DONE" : "MARK COMPLETE"}</button>
            <button className="nb" onClick={() => loadLesson(selDay)}>↺ Regenerate</button>
            <button className="nb" style={{ borderColor: "#C847FF44", color: "#C847FF" }} onClick={() => setView("vocab")}>
              📖 Vocab ({vocab.length})
            </button>
          </div>
        </div>
      )}

      {/* PHRASES */}
      {view === "phrasebook" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <h2 className="sf" style={{ fontSize: 36, marginBottom: 7 }}>Phrase Bank</h2>
          <p style={{ color: "#444", fontSize: 11, marginBottom: 30 }}>高频职场英语句型 · 点击🔊收听</p>
          <div style={{ display: "flex", gap: 7, marginBottom: 30, flexWrap: "wrap" }}>
            {Object.entries(SL).filter(([k]) => k !== "review").map(([scene, label]) => (
              <button key={scene} className={`sc ${activeScene === scene ? "on" : ""}`}
                style={{ borderColor: activeScene === scene ? SC[scene] : "#222", background: activeScene === scene ? SC[scene] + "1A" : "none", color: activeScene === scene ? SC[scene] : "#484848" }}
                onClick={() => setActiveScene(scene)}>{label}</button>
            ))}
          </div>
          {(phrases[activeScene] || []).map((p, i) => (
            <div key={i} className="pc" style={{ borderColor: SC[activeScene] }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.6 }}>{p.en}</div>
                  <div style={{ fontSize: 11, color: "#484848" }}>{p.zh}</div>
                </div>
                <button className="ibtn" onClick={() => tts.speak(p.en)}>🔊</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VOCAB */}
      {view === "vocab" && (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
            <div>
              <h2 className="sf" style={{ fontSize: 36 }}>Vocabulary Notebook</h2>
              <p style={{ color: "#444", fontSize: 11, marginTop: 4 }}>AI自动提取 · 中英对照 · 闪卡强化记忆</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button className={`nb ${!flashMode ? "on" : ""}`} onClick={() => setFlashMode(false)}>📋 List</button>
              <button className={`nb ${flashMode ? "on" : ""}`} onClick={() => { setFlashMode(true); setFlashIdx(0); setFlipped(false); }} disabled={filtVocab.length === 0}>🃏 Flashcards</button>
            </div>
          </div>

          {/* filter */}
          <div style={{ display: "flex", gap: 7, marginBottom: 28, flexWrap: "wrap" }}>
            {[
              ["all", `全部 (${vocab.length})`],
              ["mastered", `已掌握 (${vocab.filter(v => v.mastered).length})`],
              ...Object.entries(SL).filter(([k]) => k !== "review").map(([s, l]) => [s, `${l} (${vocab.filter(v => v.scene === s).length})`])
            ].map(([id, label]) => (
              <button key={id} className={`sc ${vocabFilter === id ? "on" : ""}`}
                style={{ borderColor: vocabFilter === id ? "#C847FF" : "#1E1E1E", background: vocabFilter === id ? "#C847FF1A" : "none", color: vocabFilter === id ? "#C847FF" : "#484848" }}
                onClick={() => { setVocabFilter(id); setFlashIdx(0); setFlipped(false); }}>
                {label}
              </button>
            ))}
          </div>

          {vocab.length === 0 && (
            <div style={{ border: "1px dashed #1A1A1A", padding: "52px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>📖</div>
              <div style={{ color: "#3A3A3A", fontSize: 13, marginBottom: 7 }}>词汇本还是空的</div>
              <div style={{ color: "#252525", fontSize: 11 }}>完成任意一节课，AI将自动提取生词添加到这里</div>
            </div>
          )}

          {/* FLASHCARD MODE */}
          {flashMode && filtVocab.length > 0 && (() => {
            const card = filtVocab[flashIdx];
            if (!card) return null;
            return (
              <div>
                <div style={{ textAlign: "center", color: "#3A3A3A", fontSize: 10, marginBottom: 16, letterSpacing: 1 }}>
                  {flashIdx + 1} / {filtVocab.length} · 点击卡片翻转查看释义
                </div>
                <div className="flip-wrap" onClick={() => setFlipped(f => !f)} style={{ marginBottom: 20 }}>
                  <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
                    <div className="flip-f" style={{ background: "#0E0E0E", border: "1px solid #222", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 210 }}>
                      <div style={{ fontSize: 9, color: SC[card.scene] || "#888", letterSpacing: 2, marginBottom: 10 }}>{SL[card.scene]?.toUpperCase()}</div>
                      <div className="sf" style={{ fontSize: 26, marginBottom: 7 }}>{card.word}</div>
                      <div style={{ fontSize: 11, color: "#444" }}>{card.phonetic}</div>
                      <div style={{ fontSize: 10, color: "#333", marginTop: 6 }}>{card.partOfSpeech}</div>
                      <div style={{ marginTop: 24, color: "#252525", fontSize: 10 }}>点击翻转 →</div>
                    </div>
                    <div className="flip-b" style={{ background: "#090F09", border: "1px solid #47FFB822", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 210 }}>
                      <div style={{ fontSize: 20, color: "#47FFB8", marginBottom: 10 }}>{card.zh}</div>
                      <div style={{ fontSize: 12, color: "#777", lineHeight: 1.7, marginBottom: 16 }}>{card.example}</div>
                      <button onClick={e => { e.stopPropagation(); tts.speak(card.example || card.word); }} className="ibtn" style={{ alignSelf: "flex-start", borderColor: "#2A2A2A" }}>🔊 Listen</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 9, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="nb" onClick={() => { setFlashIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={flashIdx === 0}>← Prev</button>
                  <button className="nb" style={{ borderColor: card.mastered ? "#47FFB8" : "#252525", color: card.mastered ? "#47FFB8" : "#666", background: card.mastered ? "#081808" : "none" }}
                    onClick={() => toggleMastered(card.word)}>
                    {card.mastered ? "✓ Mastered" : "Mark Mastered"}
                  </button>
                  <button className="nb" onClick={() => { setFlashIdx(i => Math.min(filtVocab.length - 1, i + 1)); setFlipped(false); }} disabled={flashIdx >= filtVocab.length - 1}>Next →</button>
                </div>
              </div>
            );
          })()}

          {/* LIST MODE */}
          {!flashMode && filtVocab.length > 0 && (
            <div>
              {filtVocab.map((v, i) => (
                <div key={i} className="vrow">
                  <div style={{ paddingTop: 5 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: SC[v.scene] || "#555" }} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: v.mastered ? "#47FFB8" : "#D8D4CC" }}>{v.word}</span>
                      <span style={{ fontSize: 10, color: "#3A3A3A" }}>{v.phonetic}</span>
                      <span style={{ fontSize: 9, color: "#333" }}>{v.partOfSpeech}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#777", marginBottom: 3 }}>{v.zh}</div>
                    <div style={{ fontSize: 10, color: "#383838", fontStyle: "italic", lineHeight: 1.6 }}>{v.example}</div>
                  </div>
                  <div style={{ display: "flex", gap: 5, flexShrink: 0, paddingTop: 2 }}>
                    <button className="ibtn" onClick={() => tts.speak(v.example || v.word)}>🔊</button>
                    <button className="ibtn" style={{ borderColor: v.mastered ? "#47FFB844" : "#1C1C1C", color: v.mastered ? "#47FFB8" : "#3A3A3A" }} onClick={() => toggleMastered(v.word)}>
                      {v.mastered ? "✓" : "○"}
                    </button>
                    <button className="ibtn" onClick={() => removeWord(v.word)}>✕</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 22, fontSize: 10, color: "#252525", textAlign: "center" }}>
                {filtVocab.filter(v => v.mastered).length}/{filtVocab.length} 已掌握 · 继续学习自动添加更多生词
              </div>
            </div>
          )}

          {!flashMode && filtVocab.length === 0 && vocab.length > 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#333", fontSize: 13 }}>该分类暂无词汇</div>
          )}
        </div>
      )}
    </div>
  );
}
