import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";

const DEFAULT_PROFILE = {
  name: "Jane Doe",
  avatarEmoji: "🎯",
  targetExamDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 60 days from now
  targetBand: "Merit",
  level: 1,
  xp: 120,
  studyStreakDays: 3,
  totalStudyMinutes: 45,
  lastStudyDate: null
};

export default function ProfileAnalytics({
  fontScale = 1,
  setPaperMode,
  setWritingPart,
  setCurrentView
}) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("petPrepProfile");
    if (!saved) {
      localStorage.setItem("petPrepProfile", JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(saved);
  });

  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem("petPrepAttempts");
    return saved ? JSON.parse(saved) : [];
  });

  const [studyPlan, setStudyPlan] = useState(() => {
    const saved = localStorage.getItem("petPrepStudyPlan");
    return saved ? JSON.parse(saved) : null;
  });

  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Sync state if localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      const savedProfile = localStorage.getItem("petPrepProfile");
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedAttempts = localStorage.getItem("petPrepAttempts");
      if (savedAttempts) setAttempts(JSON.parse(savedAttempts));

      const savedPlan = localStorage.getItem("petPrepStudyPlan");
      if (savedPlan) setStudyPlan(JSON.parse(savedPlan));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const totalAttempts = attempts.length;

  // Calculate averages
  const getAverage = (key) => {
    if (attempts.length === 0) return 0;
    const sum = attempts.reduce((acc, att) => acc + (att.scores?.[key] || 0), 0);
    return +(sum / attempts.length).toFixed(1);
  };

  const avgScores = {
    content: getAverage("content"),
    communicative: getAverage("communicative"),
    organisation: getAverage("organisation"),
    language: getAverage("language"),
    total: +(attempts.reduce((acc, att) => acc + (att.totalScore || 0), 0) / (attempts.length || 1)).toFixed(1)
  };

  // Find weakest area
  const weakestArea = (() => {
    const areas = ["content", "communicative", "organisation", "language"];
    let minScore = 5;
    let weakest = "organisation"; // default
    areas.forEach(area => {
      const score = avgScores[area];
      if (score < minScore) {
        minScore = score;
        weakest = area;
      }
    });
    return weakest;
  })();

  // --- Recharts Data Formatting ---
  const lineChartData = [...attempts]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((att, idx) => ({
      name: `T${idx + 1}`,
      Date: new Date(att.timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      Score: att.totalScore,
      Scale: att.cambridgeScale
    }));

  const barChartData = [
    { name: "Content", Score: avgScores.content },
    { name: "Comm. Achievement", Score: avgScores.communicative },
    { name: "Organisation", Score: avgScores.organisation },
    { name: "Language", Score: avgScores.language }
  ];

  const taskCountData = [
    { name: "Email (Part 1)", count: attempts.filter(a => a.taskType === "email").length },
    { name: "Article (Part 2)", count: attempts.filter(a => a.taskType === "article").length },
    { name: "Story (Part 2)", count: attempts.filter(a => a.taskType === "story").length }
  ];

  // --- AI Study Plan Generator ---
  const generateStudyPlan = async () => {
    setGeneratingPlan(true);
    const apiKey = localStorage.getItem("petPrepApiKey");

    const promptText = `Generate a B1 Preliminary Writing 7-day study plan. Focus on: "${weakestArea.toUpperCase()}".
Candidate metrics:
- Average Total Score: ${avgScores.total}/20
- Content: ${avgScores.content}/5
- Communicative Achievement: ${avgScores.communicative}/5
- Organisation: ${avgScores.organisation}/5
- Language: ${avgScores.language}/5`;

    if (apiKey) {
      try {
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-profiles-allowed": "true"
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1500,
            system: "You are a professional Cambridge B1 Preliminary writing coach. Respond in clean, readable markdown to create a tailored 7-day study plan matching candidate strengths and weaknesses. Do not include markdown codeblocks or system logs in output, write directly.",
            messages: [{ role: "user", content: promptText }]
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const raw = data.content?.find((b) => b.type === "text")?.text || "";
          const newPlan = {
            generatedAt: Date.now(),
            planMarkdown: raw
          };
          localStorage.setItem("petPrepStudyPlan", JSON.stringify(newPlan));
          setStudyPlan(newPlan);
          setGeneratingPlan(false);
          return;
        }
      } catch (err) {
        console.error("Direct Anthropic call failed, falling back to local engine:", err);
      }
    }

    // --- Elegant Local Generator Fallback ---
    setTimeout(() => {
      // eslint-disable-next-line no-useless-assignment
      let focusTip = "";
      // eslint-disable-next-line no-useless-assignment
      let exercises = [];
      if (weakestArea === "content") {
        focusTip = "Focusing on answering all bullet points thoroughly and avoiding irrelevant descriptions.";
        exercises = [
          "Day 1: Read Part 1 prompts. Circle the 4 notes. Write one sentence for each note.",
          "Day 2: Identify irrelevant text in sample responses and remove them to hit exact B1 constraints.",
          "Day 3: Write a 100-word email ensuring all 4 questions are fully addressed.",
          "Day 4: Create a Checklist for Part 2 Article questions. Cross-check drafts against the prompt.",
          "Day 5: Practice expanding short sentences with more content details.",
          "Day 6: Write a story draft and check: does it follow the opening sentence logically?",
          "Day 7: Write a full writing paper set and double-check prompt adherence."
        ];
      } else if (weakestArea === "communicative") {
        focusTip = "Focusing on choosing the correct register (informal for emails, engaging/opinionated for articles).";
        exercises = [
          "Day 1: Study greetings and closures for informal writing (e.g. 'Best wishes', 'Speak soon').",
          "Day 2: Rewrite formal sentences into friendly B1 informal structures.",
          "Day 3: Practice article hooks to grab the reader's attention (e.g. rhetorical questions).",
          "Day 4: Check tone consistency in emails: avoid mixing formal words like 'Moreover' into friendly letters.",
          "Day 5: Practice expressing preferences and opinions ('I'm keen on...', 'In my view...').",
          "Day 6: Complete a story writing exercise focusing on maintaining excitement.",
          "Day 7: Write a full email response under exam conditions, checking register suitability."
        ];
      } else if (weakestArea === "organisation") {
        focusTip = "Focusing on coherent paragraphs, chronological storytelling, and varied linking words.";
        exercises = [
          "Day 1: Study paragraph structures: Greeting + Opening, Body Paragraph 1, Body Paragraph 2, Closing.",
          "Day 2: Learn narrative sequencers for stories (e.g. 'Suddenly', 'Then', 'A few minutes later').",
          "Day 3: Practice basic connectors like 'but', 'because', 'so', 'although' in complex sentences.",
          "Day 4: Organize an article about a holiday. Draft paragraphs with clear main ideas.",
          "Day 5: Learn and apply additive connectors for letters ('also', 'plus', 'as well as').",
          "Day 6: Write a story ensuring proper paragraph transitions.",
          "Day 7: Complete a mock writing test, focusing on splitting text into 3 distinct paragraphs."
        ];
      } else {
        focusTip = "Focusing on vocabulary range (B1 words) and grammatical accuracy (tenses, plurals, prepositions).";
        exercises = [
          "Day 1: Master the present continuous vs present simple tenses for general descriptions.",
          "Day 2: Build past tense accuracy: regular/irregular verbs and past continuous for story setups.",
          "Day 3: Learn 10 new adjectives to replace simple words like 'good', 'bad', 'nice' (e.g. 'brilliant', 'dreadful').",
          "Day 4: Focus on spelling: double consonants and common B1 typos.",
          "Day 5: Learn and apply modal verbs of possibility and suggestion ('should', 'could', 'might').",
          "Day 6: Practice reviewing sentences to fix common third-person singular errors ('he play' -> 'he plays').",
          "Day 7: Write an article focusing on using advanced verbs and clean grammatical structures."
        ];
      }

      const generatedMd = `## 7-Day B1 Writing Booster Plan
**Target Focus:** Improving **${weakestArea.charAt(0).toUpperCase() + weakestArea.slice(1)}**

This study plan is dynamically generated based on your past ${attempts.length} attempts. Your average sub-criteria scores reveal that **${weakestArea}** is your primary growth area.

### 💡 Strategy Focus
${focusTip}

### 📅 Daily Schedule
1. **${exercises[0]}**
2. **${exercises[1]}**
3. **${exercises[2]}**
4. **${exercises[3]}**
5. **${exercises[4]}**
6. **${exercises[5]}**
7. **${exercises[6]}**

### ✍️ Pro Examiner Tip
Spend 5 minutes planning before writing, and 3 minutes checking for spelling and punctuation mistakes at the end. Try to use our *Phrase Bank* to boost your organization!`;

      const fallbackPlan = {
        generatedAt: Date.now(),
        planMarkdown: generatedMd
      };

      localStorage.setItem("petPrepStudyPlan", JSON.stringify(fallbackPlan));
      setStudyPlan(fallbackPlan);
      setGeneratingPlan(false);
    }, 1200);
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      let cleanLine = line.trim();
      if (cleanLine.startsWith("###")) {
        return <h4 key={idx} className="text-[1.1em] font-bold text-text mt-5 mb-2">{cleanLine.replace("###", "").trim()}</h4>;
      }
      if (cleanLine.startsWith("##")) {
        return <h3 key={idx} className="text-[1.3em] font-bold text-primary mt-6 mb-3 border-b border-border pb-1.5">{cleanLine.replace("##", "").trim()}</h3>;
      }
      if (cleanLine.startsWith("#")) {
        return <h2 key={idx} className="text-[1.5em] font-extrabold text-primary-dark dark:text-primary mt-7 mb-4">{cleanLine.replace("#", "").trim()}</h2>;
      }
      if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
        return <li key={idx} className="ml-5 list-disc text-sm text-text-muted my-1">{cleanLine.substring(1).trim()}</li>;
      }
      if (/^\d+\./.test(cleanLine)) {
        return <li key={idx} className="ml-5 list-decimal text-sm text-text-muted my-1.5">{cleanLine.replace(/^\d+\./, "").trim()}</li>;
      }
      if (!cleanLine) {
        return <div key={idx} className="h-3" />;
      }
      return <p key={idx} className="text-sm text-text leading-relaxed my-2">{cleanLine}</p>;
    });
  };

  if (!profile) return null;

  return (
    <div
      className="min-h-screen bg-surface overflow-y-auto"
      style={{ padding: "24px 20px 100px", fontSize: `${fontScale}em` }}
    >
      <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
        {/* Welcome Card & Level Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10" />
            <div className="text-5xl mt-2 select-none mb-3 bg-purple-50 p-4 rounded-full border border-purple-100">{profile.avatarEmoji || "🎯"}</div>
            <div>
              <h3 className="font-extrabold text-text text-lg">{profile.name}</h3>
              <p className="text-xs text-text-muted font-medium">B1 Candidate</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border w-full flex items-center justify-around text-left">
              <div>
                <p className="text-[10px] text-text-light uppercase font-bold tracking-wider">Target Date</p>
                <p className="text-xs font-bold text-text">{profile.targetExamDate ? new Date(profile.targetExamDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not Set"}</p>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <p className="text-[10px] text-text-light uppercase font-bold tracking-wider">Target Band</p>
                <p className="text-xs font-bold text-primary">{profile.targetBand?.replace(" (B1)", "") || "Merit"}</p>
              </div>
            </div>
          </div>

          {/* Streak & Time Cards */}
          <div className="grid grid-cols-1 gap-6">
            {/* Streak Card */}
            <div className="bg-card dark:bg-card rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="text-3xl bg-amber-100/70 dark:bg-amber-900/30 p-3 rounded-xl border border-amber-200 dark:border-amber-700 select-none">🔥</div>
              <div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Study Streak</span>
                <h4 className="text-xl font-black text-text">{profile.studyStreakDays || 0} Days</h4>
                <p className="text-xs text-text-muted font-medium">Keep writing daily to hold the streak!</p>
              </div>
            </div>
            {/* Time Card */}
            <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
              <div className="text-3xl bg-indigo-50 p-3 rounded-xl border border-indigo-100 select-none">⏱️</div>
              <div>
                <span className="text-[10px] text-text-light font-bold uppercase tracking-wider">Total Effort</span>
                <h4 className="text-xl font-black text-text">{profile.totalStudyMinutes || 0} Minutes</h4>
                <p className="text-xs text-text-muted font-medium">Practice time spent on PETPrep</p>
              </div>
            </div>
          </div>

          {/* XP Progress Card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-text-light font-bold uppercase tracking-wider">Level Badge</span>
                <h4 className="text-lg font-black text-text">Level {profile.level || 1}</h4>
              </div>
              <div className="bg-gradient-to-tr from-primary-dark to-primary text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm">
                {profile.xp || 0} XP
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-text-muted mb-1.5">
                <span>Progress to Level {profile.level + 1}</span>
                <span>{(profile.xp % 500)} / 500 XP</span>
              </div>
              <div className="h-3 rounded-full bg-border overflow-hidden border border-border-light">
                <div
                  className="h-full bg-gradient-to-r from-primary-dark to-primary transition-all duration-1000"
                  style={{ width: `${((profile.xp % 500) / 500) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-text-light mt-2 font-medium">Earn XP by completing writing tasks and receiving scoring feedback!</p>
          </div>
        </div>

        {/* Grid of Analytics Graphs */}
        {totalAttempts === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
            <div className="text-5xl mb-4 select-none">📊</div>
            <h3 className="font-extrabold text-text text-lg mb-2">No attempts recorded yet</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
              Complete a Writing Paper practice essay and click "Get AI Feedback" to generate analysis metrics and view your progress charts.
            </p>
            <button
              onClick={() => { setPaperMode("writing"); setWritingPart(1); if (setCurrentView) setCurrentView("practice"); }}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all shadow hover:shadow-md cursor-pointer"
            >
              Start Practice
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Score Progression over time */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-4">
                <h3 className="font-extrabold text-text text-base">Cambridge Scale Progress</h3>
                <p className="text-xs text-text-muted font-medium">Chronological progression of B1 Scale scores (Target: 140+)</p>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis domain={[100, 170]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                      labelFormatter={(label, items) => items[0]?.payload?.Date || label}
                    />
                    <ReferenceLine y={120} stroke="#E17055" strokeDasharray="4 4" label={{ value: "Pass (120)", fill: "#E17055", fontSize: 10, position: "top" }} />
                    <ReferenceLine y={140} stroke="#00B894" strokeDasharray="4 4" label={{ value: "Merit (140)", fill: "#00B894", fontSize: 10, position: "top" }} />
                    <ReferenceLine y={160} stroke="#6C5CE7" strokeDasharray="4 4" label={{ value: "Distinction (160)", fill: "#6C5CE7", fontSize: 10, position: "top" }} />
                    <Line type="monotone" dataKey="Scale" stroke="#6C5CE7" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sub-criteria Strengths */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-4">
                <h3 className="font-extrabold text-text text-base">Cambridge Sub-criteria Profile</h3>
                <p className="text-xs text-text-muted font-medium">Average score by rubric division (Content, Comm, Org, Lang - max 5.0)</p>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 5]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E5E7EB" }} />
                    <Bar
                      dataKey="Score"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    >
                      {barChartData.map((entry, index) => {
                        const colors = ["#6C5CE7", "#00B894", "#FDCB6E", "#E17055"];
                        return <rect key={`bar-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Task Balance */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-4">
                <h3 className="font-extrabold text-text text-base">Task Type Balance</h3>
                <p className="text-xs text-text-muted font-medium">Distribution of submitted practices across B1 task divisions</p>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskCountData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} width={100} />
                    <Tooltip contentStyle={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E5E7EB" }} />
                    <Bar dataKey="count" fill="#8884d8" radius={[0, 6, 6, 0]} barSize={20}>
                      {taskCountData.map((entry, index) => {
                        const colors = ["#818CF8", "#34D399", "#FB7185"];
                        return <rect key={`bar-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 7-Day Study Plan Notepad */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
              {/* Lined Paper Lines Background */}
              <div className="absolute top-0 right-0 w-2 h-full bg-pink-100" />
              <div className="z-10 flex-1">
                <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-4">
                  <h3 className="font-extrabold text-text text-base flex items-center gap-2">
                    <span>📅</span> Personalised 7-Day B1 Study Plan
                  </h3>
                  {studyPlan && (
                    <span className="text-[10px] text-text-muted font-semibold bg-card border border-border px-2.5 py-1 rounded-lg">
                      Generated: {new Date(studyPlan.generatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {generatingPlan ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                    <p className="text-sm font-semibold text-text-muted">Tailoring booster plan to your writing habits...</p>
                  </div>
                ) : studyPlan ? (
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar font-serif leading-relaxed text-text bg-card/50 p-4 rounded-xl border border-border">
                    {renderMarkdown(studyPlan.planMarkdown)}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                    <span className="text-4xl mb-3 select-none">🧠</span>
                    <h4 className="font-bold text-text text-sm mb-1.5">No plan generated yet</h4>
                    <p className="text-xs text-text-muted max-w-sm mb-4">
                      Our AI writing coach will analyze your weaknesses (currently focusing on <strong className="text-indigo-600">{weakestArea}</strong>) to craft a 7-day B1 Preliminary boost schedule.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex justify-end z-10">
                <button
                  onClick={generateStudyPlan}
                  disabled={generatingPlan}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {studyPlan ? "🔄 Regenerate Study Plan" : "⚡ Generate 7-Day AI Plan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
