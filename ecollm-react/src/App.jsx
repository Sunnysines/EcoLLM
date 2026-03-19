import { useState, useEffect } from "react";
import "./index.css";

const models = [
  "google/gemma-2b",
  "google/gemma-3-4b-it",
  "microsoft/phi-2",
  "mistralai/Mistral-7B-v0.3",
  "meta-llama/Llama-3.1-8B",
  "bigscience/bloom-3b",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(models[0]);
  const [promptType, setPromptType] = useState("Few-Shot");
  const [answer, setAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setAnswer("Please enter a prompt.");
      return;
    }
    setAnswer("Generating answer...");
    setIsAnalyzing(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnswer(`Error: ${data?.error || "Server error"}`);
      } else {
        setAnswer(data.answer || "No answer.");
      }
    } catch (e) {
      setAnswer("Error fetching answer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <header className="bg-emerald-700 dark:bg-emerald-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-300 text-3xl">eco</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">EcoLLM</h1>
              <p className="text-[10px] text-emerald-100/70 uppercase tracking-widest font-medium">Energy-Aware Evaluation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-6">
              <a className="text-white/90 hover:text-white transition-colors" href="#">Dashboard</a>
              <a className="text-white/60 hover:text-white transition-colors" href="#">History</a>
              <a className="text-white/60 hover:text-white transition-colors" href="#">Analytics</a>
            </div>
            <button onClick={toggleTheme} className="p-2 hover:bg-emerald-600/50 rounded-lg transition-colors" title="Toggle theme">
              <span className="material-symbols-outlined">{theme === "dark" ? "dark_mode" : "light_mode"}</span>
            </button>
            <button className="p-2 hover:bg-emerald-600/50 rounded-lg lg:hidden">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto p-4 flex-grow lg:flex lg:gap-6 lg:overflow-hidden">
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6 mb-6 lg:mb-0">
          <section className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full lg:flex lg:flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-lg">settings_input_component</span>
                Input &amp; Configuration
              </h2>
            </div>
            <div className="space-y-5 lg:flex-grow">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block font-medium">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg p-3 h-32 lg:h-48 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Generate a Python function to sort a list."
                ></textarea>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block font-medium">LLM Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg py-2.5"
                  >
                    {models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block font-medium">Prompt Type</label>
                  <select
                    value={promptType}
                    onChange={(e) => setPromptType(e.target.value)}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg py-2.5"
                  >
                    <option value="Few-Shot">Few-Shot</option>
                    <option value="Zero-Shot">Zero-Shot</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-primary hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-colors mt-6 py-4 rounded-lg"
            >
              <span className="material-symbols-outlined text-xl">bolt</span>
              {isAnalyzing ? "Analyzing..." : "Analyze Performance"}
            </button>
          </section>
        </aside>

        <div className="flex-grow space-y-6 lg:overflow-y-auto lg:pr-1 custom-scrollbar">
          <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">chat</span>
              Answer
            </h3>
            <div className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-200 min-h-[120px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              {answer}
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accuracy</span>
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              </div>
              <div className="text-3xl font-bold">85%</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Power</span>
                <span className="material-symbols-outlined text-yellow-500 text-base">bolt</span>
              </div>
              <div className="text-3xl font-bold">42w</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Energy</span>
                <span className="material-symbols-outlined text-primary text-base">eco</span>
              </div>
              <div className="text-3xl font-bold">32.5<span className="text-base font-normal ml-1">Wh</span></div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Response</span>
                <span className="material-symbols-outlined text-blue-400 text-base">timer</span>
              </div>
              <div className="text-3xl font-bold">1.8<span className="text-base font-normal ml-1">s</span></div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
              <h3 className="font-semibold text-sm mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">bar_chart</span>
                Results Comparison
              </h3>
              <div className="h-64 flex items-end justify-between border-b border-slate-100 dark:border-slate-700 pb-2 mb-6">
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="flex items-end gap-1.5 h-48">
                    <div className="bg-emerald-500 w-5 h-[90%] rounded-t-sm shadow-sm"></div>
                    <div className="bg-blue-400 w-5 h-[75%] rounded-t-sm shadow-sm"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">LLaMA</span>
                </div>
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="flex items-end gap-1.5 h-48">
                    <div className="bg-emerald-500 w-5 h-[80%] rounded-t-sm shadow-sm"></div>
                    <div className="bg-blue-400 w-5 h-[70%] rounded-t-sm shadow-sm"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Mistral</span>
                </div>
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="flex items-end gap-1.5 h-48">
                    <div className="bg-emerald-500 w-5 h-[85%] rounded-t-sm shadow-sm"></div>
                    <div className="bg-blue-400 w-5 h-[65%] rounded-t-sm shadow-sm"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Gemma</span>
                </div>
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="flex items-end gap-1.5 h-48">
                    <div className="bg-emerald-500 w-5 h-[70%] rounded-t-sm shadow-sm"></div>
                    <div className="bg-blue-400 w-5 h-[60%] rounded-t-sm shadow-sm"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Falcon</span>
                </div>
              </div>
              <div className="flex justify-center gap-8 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-500">Energy Consumption (Wh)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-500">Benchmark Accuracy (%)</span>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
              <h3 className="font-semibold text-sm mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">scatter_plot</span>
                Energy vs Accuracy
              </h3>
              <div className="relative flex-grow min-h-[256px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-[80%] h-[60%] bg-emerald-500 blur-[80px] rounded-full"></div>
                </div>
                <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-md"></div>
                <div className="absolute top-[15%] left-[45%] w-4 h-4 bg-emerald-600 rounded-full border-2 border-white dark:border-slate-800 shadow-md ring-8 ring-emerald-500/20"></div>
                <div className="absolute top-[40%] left-[70%] w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 shadow-md"></div>
                <div className="absolute top-[65%] left-[85%] w-4 h-4 bg-orange-400 rounded-full border-2 border-white dark:border-slate-800 shadow-md"></div>
                <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-500/30 rounded-full text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Optimal Efficiency Zone</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-medium">Energy Usage (Wh)</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 font-medium">Accuracy (%)</div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Efficiency Ranking</h3>
                <button className="text-xs text-primary font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider">
                      <th className="px-6 py-4 font-semibold">Model</th>
                      <th className="px-6 py-4 font-semibold">Accuracy</th>
                      <th className="px-6 py-4 font-semibold text-right">Energy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-base">workspace_premium</span>
                        LLaMA-2
                      </td>
                      <td className="px-6 py-4">85%</td>
                      <td className="px-6 py-4 text-right text-emerald-500 font-bold">32.5 Wh</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium pl-14">Mistral-7B</td>
                      <td className="px-6 py-4">82%</td>
                      <td className="px-6 py-4 text-right font-semibold">40.1 Wh</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium pl-14">Gemma-2B</td>
                      <td className="px-6 py-4">78%</td>
                      <td className="px-6 py-4 text-right font-semibold">35.7 Wh</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-sm mb-4">Session Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">description</span>
                    <span className="text-sm text-slate-500">Prompt Type</span>
                  </div>
                  <span className="text-sm font-semibold">{promptType}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">language</span>
                    <span className="text-sm text-slate-500">Domain</span>
                  </div>
                  <span className="text-sm font-semibold">Computer Science</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 lg:p-4 text-center mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-80">
            <span className="material-symbols-outlined text-emerald-500 text-lg">eco</span>
            <span className="font-bold text-sm tracking-tight">EcoLLM Framework</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg lg:max-w-none">
            © 2024 EcoLLM Framework. Building more sustainable intelligence for a greener future.
          </p>
          <div className="flex justify-center gap-6">
            <a className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline transition-colors" href="#">Privacy Policy</a>
            <a className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline transition-colors" href="#">Terms of Service</a>
            <a className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}
