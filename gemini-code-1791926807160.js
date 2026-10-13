const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve the complete HTML/JS/CSS Dashboard directly from the server root
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shusuta Hub | Mode A Wound Theranostics & Glucose Intelligence</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        medical: {
                            cyan: '#00f2fe',
                            blue: '#4facfe',
                            dark: '#070d1b',
                            card: '#0a192f',
                            surface: '#112240',
                            border: '#1e3a8a',
                            neon: '#00f2fe',
                            alert: '#ff3366',
                            warning: '#ffbb33',
                            success: '#00c851'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    },
                    boxShadow: {
                        'neon': '0 0 20px rgba(0, 242, 254, 0.25)',
                        'neon-glow': '0 0 30px rgba(0, 242, 254, 0.4)'
                    }
                }
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { background-color: #070d1b; color: #e2e8f0; font-family: 'Inter', sans-serif; }
        .glass-panel { background: rgba(10, 25, 47, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(0, 242, 254, 0.15); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #070d1b; }
        ::-webkit-scrollbar-thumb { background: #1e3a8a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00f2fe; }
    </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-medical-cyan selection:text-black">

    <!-- Header / Device Bar -->
    <header class="glass-panel sticky top-0 z-50 px-4 py-3 border-b border-medical-cyan/20">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-3">
                <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-medical-cyan to-medical-blue text-black shadow-neon">
                    <i data-lucide="crosshair" class="w-6 h-6 animate-pulse"></i>
                    <span class="absolute -top-1 -right-1 flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-medical-cyan"></span>
                    </span>
                </div>
                <div>
                    <h1 class="font-bold text-lg tracking-tight bg-gradient-to-r from-medical-cyan to-medical-blue bg-clip-text text-transparent">
                        Shusuta Platform | Mode A Wound & Sugar Intelligence Hub
                    </h1>
                    <div class="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                        <span class="flex items-center text-emerald-400">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span> BLE 5.2 LE Connected
                        </span>
                        <span>•</span>
                        <span>Patch ID: #Shusuta-WoundCare-X9</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-medical-surface/80 border border-medical-cyan/30 text-xs font-mono">
                    <i data-lucide="bot" class="w-4 h-4 text-medical-cyan"></i>
                    <div>
                        <div class="text-slate-400 text-[10px]">TINYFISH AI LOOP</div>
                        <div class="text-medical-cyan font-semibold">Learning Patient Feedback</div>
                    </div>
                </div>

                <div class="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-medical-surface/80 border border-medical-cyan/30">
                    <i data-lucide="battery-charging" class="w-5 h-5 text-emerald-400 animate-pulse"></i>
                    <div>
                        <div class="flex justify-between items-center gap-2">
                            <span class="text-[10px] text-slate-400 font-mono">LI-PO BATTERY</span>
                            <span class="text-xs font-mono font-bold text-emerald-400" id="battery-pct">84%</span>
                        </div>
                        <div class="w-24 bg-slate-800 rounded-full h-1.5 mt-0.5 overflow-hidden">
                            <div class="bg-gradient-to-r from-emerald-500 to-medical-cyan h-1.5 rounded-full transition-all duration-500" id="battery-bar" style="width: 84%"></div>
                        </div>
                        <div class="text-[9px] text-medical-cyan font-mono mt-0.5 flex items-center gap-1">
                            <i data-lucide="zap" class="w-2.5 h-2.5"></i> TENG Harvesting: <span id="teng-power">1.42</span> mW
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        <!-- Action Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-medical-cyan/20">
            <div class="flex items-center space-x-3">
                <div class="p-2 rounded-xl bg-medical-cyan/10 text-medical-cyan border border-medical-cyan/20">
                    <i data-lucide="shield-alert" class="w-5 h-5"></i>
                </div>
                <div>
                    <h2 class="text-sm font-semibold text-white">Mode A: Bio-pH, Glucose Sensing, Infection Control &amp; EMR Dispatch</h2>
                    <p class="text-xs text-slate-400">Continuous closed-loop physiological monitoring with automated 405nm UV phototherapy.</p>
                </div>
            </div>
            <button onclick="triggerKineticTap()" class="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-medical-blue/20 to-medical-cyan/20 border border-medical-cyan/40 hover:border-medical-cyan text-medical-cyan text-xs font-mono font-semibold transition-all shadow-sm active:scale-95">
                <i data-lucide="hand" class="w-4 h-4"></i>
                <span>Simulate TENG Movement (+Kinetic Energy)</span>
            </button>
        </div>

        <!-- SENSORS & PARAMETERS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- 1. Bio-pH Sensor Card -->
            <div class="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div class="absolute top-0 right-0 p-4 text-medical-cyan/20"><i data-lucide="droplet" class="w-16 h-16"></i></div>
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-mono text-slate-400 uppercase tracking-wider">Wound Bed Bio-pH</span>
                        <span id="ph-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Optimal Healing</span>
                    </div>
                    <div class="flex items-baseline space-x-2 my-2">
                        <span class="text-4xl font-extrabold font-mono text-white" id="val-ph">7.14</span>
                        <span class="text-xs text-slate-400 font-mono">pH units</span>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">Alkaline shift (&gt;7.50 pH) triggers infection alert.</p>
                </div>
                <div>
                    <div class="flex justify-between text-xs font-mono text-slate-400 mb-1">
                        <span>Acidic (5.5)</span>
                        <span>Neutral (7.0)</span>
                        <span>Alkaline (8.5)</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2 rounded-full relative overflow-hidden">
                        <div class="absolute top-0 bottom-0 bg-gradient-to-r from-blue-500 via-emerald-400 to-rose-500 w-full opacity-80"></div>
                        <div id="ph-marker" class="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg transition-all duration-300" style="left: 45%;"></div>
                    </div>
                </div>
            </div>

            <!-- 2. Local Exudate Glucose / Sugar Card -->
            <div class="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between border-medical-cyan/40">
                <div class="absolute top-0 right-0 p-4 text-medical-cyan/20"><i data-lucide="activity" class="w-16 h-16"></i></div>
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-mono text-slate-400 uppercase tracking-wider">Local Sugar Level (Glucose)</span>
                        <span id="sugar-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Normal Range</span>
                    </div>
                    <div class="flex items-baseline space-x-2 my-2">
                        <span class="text-4xl font-extrabold font-mono text-white" id="val-sugar">122</span>
                        <span class="text-xs text-slate-400 font-mono">mg/dL</span>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">Enzymatic biosensor tracking metabolic tissue recovery.</p>
                </div>
                <div>
                    <div class="flex justify-between text-xs font-mono text-slate-400 mb-1">
                        <span>Hypo (70)</span>
                        <span>Norm (110)</span>
                        <span>Hyper (180+)</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2 rounded-full relative overflow-hidden">
                        <div class="absolute top-0 bottom-0 bg-gradient-to-r from-amber-500 via-emerald-400 to-rose-500 w-full opacity-80"></div>
                        <div id="sugar-marker" class="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg transition-all duration-300" style="left: 42%;"></div>
                    </div>
                </div>
            </div>

            <!-- 3. Perilesional Temperature Card -->
            <div class="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div class="absolute top-0 right-0 p-4 text-medical-cyan/20"><i data-lucide="thermometer" class="w-16 h-16"></i></div>
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-mono text-slate-400 uppercase tracking-wider">Perilesional Temp</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-medical-cyan/20 text-medical-cyan border border-medical-cyan/30">Stable</span>
                    </div>
                    <div class="flex items-baseline space-x-2 my-2">
                        <span class="text-4xl font-extrabold font-mono text-white" id="val-temp">36.8</span>
                        <span class="text-xs text-slate-400 font-mono">°C</span>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">Continuous thermography tracking inflammation index.</p>
                </div>
                <div class="flex items-center justify-between text-xs font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span>Inflammation Index</span>
                    <span class="text-emerald-400 font-semibold">Low (Normal)</span>
                </div>
            </div>

            <!-- 4. 405nm UV Micro-LED Disinfection Card -->
            <div class="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between border-medical-cyan/40">
                <div class="absolute top-0 right-0 p-4 text-medical-cyan/20"><i data-lucide="sun" class="w-16 h-16"></i></div>
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-mono text-slate-400 uppercase tracking-wider">405nm UV Disinfection</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="uv-toggle" onchange="toggleUV()" class="sr-only peer" checked>
                            <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medical-cyan"></div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between my-2">
                        <span class="text-xs font-mono text-medical-cyan" id="uv-status-text">ACTIVE: Pulsed Mode</span>
                        <span class="text-xs font-mono font-bold text-white" id="uv-intensity-val">5.0 mW/cm²</span>
                    </div>
                    <div class="space-y-1 mb-3">
                        <div class="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>Intensity</span>
                            <span>Max 10 mW/cm²</span>
                        </div>
                        <input type="range" min="0" max="10" step="0.5" value="5" id="uv-slider" oninput="updateUVIntensity(this.value)" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-medical-cyan">
                    </div>
                </div>
                <div class="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-medical-cyan shrink-0"></i>
                    <span>Adjusted automatically by sugar &amp; bacterial AI agent.</span>
                </div>
            </div>

        </div>

        <!-- Telemetry Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="glass-panel p-5 rounded-2xl">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <i data-lucide="line-chart" class="w-5 h-5 text-medical-cyan"></i>
                        <h3 class="font-semibold text-white text-sm">Real-Time pH &amp; Sugar Level (mg/dL)</h3>
                    </div>
                    <span class="text-xs font-mono text-slate-400">Live Buffer</span>
                </div>
                <div class="h-64 relative"><canvas id="telemetryChart1"></canvas></div>
            </div>

            <div class="glass-panel p-5 rounded-2xl">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <i data-lucide="zap" class="w-5 h-5 text-emerald-400"></i>
                        <h3 class="font-semibold text-white text-sm">TENG Kinetic Energy Harvesting (mW)</h3>
                    </div>
                    <span class="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                    </span>
                </div>
                <div class="h-64 relative"><canvas id="telemetryChart2"></canvas></div>
            </div>
        </div>

        <!-- Interactive Section: Chatbot & EMR/Family Dispatcher -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Chatbot Assistant with Feedback Learning -->
            <div class="glass-panel p-5 rounded-2xl flex flex-col h-[420px] border border-medical-cyan/30">
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div class="flex items-center space-x-2">
                        <div class="p-2 rounded-xl bg-medical-cyan/10 text-medical-cyan border border-medical-cyan/30">
                            <i data-lucide="message-square-code" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-white text-sm">TinyFish AI Agent &amp; Chatbot</h3>
                            <p class="text-[11px] text-slate-400">Learns from patient feedback and monitors sugar/vital thresholds.</p>
                        </div>
                    </div>
                    <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">Active</span>
                </div>

                <div id="chat-messages" class="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
                    <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-slate-300">
                        <span class="text-medical-cyan font-bold">TinyFish AI:</span> Hello! I am your Shusuta metabolic assistant. Tell me how you feel today (e.g., "I feel mild pain", "My sugar spiked after lunch") or ask for your vital reports!
                    </div>
                </div>

                <div class="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                    <input type="text" id="chat-input" placeholder="Type feedback or ask about sugar level..." class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-medical-cyan font-mono" onkeypress="if(event.key === 'Enter') sendChatMessage()">
                    <button onclick="sendChatMessage()" class="px-4 py-2 rounded-xl bg-medical-cyan text-black font-semibold text-xs transition shadow-neon">Send</button>
                </div>
            </div>

            <!-- Doctor & Family Report Dispatcher -->
            <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between h-[420px] border border-medical-cyan/30">
                <div>
                    <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                        <div class="flex items-center space-x-2">
                            <div class="p-2 rounded-xl bg-medical-cyan/10 text-medical-cyan border border-medical-cyan/30">
                                <i data-lucide="send" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-white text-sm">Doctor EMR &amp; Family Report Dispatcher</h3>
                                <p class="text-[11px] text-slate-400">Instant multi-stakeholder alert transmission.</p>
                            </div>
                        </div>
                        <span id="dispatch-status-badge" class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">Live Sync</span>
                    </div>

                    <div class="space-y-3 font-mono text-xs">
                        <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div>
                                <div class="text-[10px] text-slate-400">CLINICAL EMR RECIPIENT</div>
                                <div class="text-white font-semibold">Dr. Sarah Jenkins (St. Jude Medical Center)</div>
                            </div>
                            <span class="text-emerald-400 text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">Auto-Push</span>
                        </div>

                        <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div>
                                <div class="text-[10px] text-slate-400">FAMILY NOTIFICATION GATEWAY</div>
                                <div class="text-white font-semibold">Primary Caretaker (SMS / Push App)</div>
                            </div>
                            <span class="text-cyan-400 text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">Active SMS</span>
                        </div>

                        <div id="live-report-summary" class="bg-medical-dark p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                            <div class="text-medical-cyan font-bold">[SHUSUTA REAL-TIME VITALS REPORT]</div>
                            <div>• Local Blood Sugar: <span id="rep-sugar" class="text-white font-bold">122 mg/dL</span> (Normal)</div>
                            <div>• Wound pH Level: <span id="rep-ph" class="text-white font-bold">7.14</span> (Optimal)</div>
                            <div>• Perilesional Temp: <span id="rep-temp" class="text-white font-bold">36.8°C</span> (Stable)</div>
                            <div>• Patient Feedback State: <span id="rep-feedback" class="text-emerald-400 font-bold">Comfortable (No Pain Reported)</span></div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span class="text-[10px] font-mono text-slate-400">Auto-dispatches on infection/glycemic threshold breach</span>
                    <button onclick="manualDispatchReport()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-medical-cyan text-xs font-mono font-semibold transition border border-medical-cyan/30">
                        Dispatch Manual Report
                    </button>
                </div>
            </div>

        </div>

        <!-- Console Log Feed -->
        <div class="glass-panel p-5 rounded-2xl border border-medical-cyan/30">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div class="flex items-center space-x-3">
                    <div class="p-2 rounded-xl bg-medical-cyan/10 text-medical-cyan border border-medical-cyan/30">
                        <i data-lucide="bot" class="w-5 h-5 animate-bounce"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-sm">TinyFish AI Autonomous Clinical Intelligence Engine</h3>
                        <p class="text-xs text-slate-400">Live hardware telemetry, threshold evaluation, and feedback loop logs</p>
                    </div>
                </div>
                <button onclick="clearConsole()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition">Clear Log</button>
            </div>
            <div id="ai-console" class="bg-medical-dark font-mono text-xs p-4 rounded-xl h-44 overflow-y-auto space-y-2 border border-slate-800/80 shadow-inner">
                <div class="text-slate-500">[00:00:01] [SYSTEM] Shusuta Mode A platform initialized. Patch ID: #Shusuta-WoundCare-X9.</div>
                <div class="text-slate-400">[00:00:05] [SENSORS] Baseline verified. pH: 7.12, Glucose: 122 mg/dL, Temp: 36.7°C.</div>
            </div>
        </div>

    </main>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        lucide.createIcons();
        const socket = io();

        let isUVActive = true;
        let batteryLevel = 84;
        let tengPower = 1.42;

        function toggleUV() {
            isUVActive = !isUVActive;
            const statusText = document.getElementById('uv-status-text');
            statusText.innerText = isUVActive ? "ACTIVE: Pulsed Mode" : "STANDBY (Paused)";
            addConsoleLog(\`[CONTROL] 405nm UV micro-LED disinfection \${isUVActive ? 'resumed' : 'paused'} by user.\`);
        }

        function updateUVIntensity(val) {
            document.getElementById('uv-intensity-val').innerText = val + ' mW/cm²';
        }

        function triggerKineticTap() {
            tengPower = +(tengPower + 1.85).toFixed(2);
            batteryLevel = Math.min(100, batteryLevel + 1);
            document.getElementById('battery-pct').innerText = batteryLevel + '%';
            document.getElementById('battery-bar').style.width = batteryLevel + '%';
            document.getElementById('teng-power').innerText = tengPower;
            addConsoleLog(\`[TENG] Kinetic energy harvesting spike detected (+1.85 mW). Li-Po battery charging.\`);
        }

        function sendChatMessage() {
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            if(!message) return;

            const chatMessages = document.getElementById('chat-messages');
            const userDiv = document.createElement('div');
            userDiv.className = "bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-200 text-right ml-6";
            userDiv.innerHTML = \`<span class="text-medical-blue font-bold">You:</span> \${message}\`;
            chatMessages.appendChild(userDiv);
            input.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            socket.emit('patient-feedback', message);

            setTimeout(() => {
                const aiDiv = document.createElement('div');
                aiDiv.className = "bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300 mr-6";
                aiDiv.innerHTML = \`<span class="text-medical-cyan font-bold">TinyFish AI:</span> I've registered your feedback ("\${message}"). Your vitals are syncing live with Dr. Jenkins.\`;
                chatMessages.appendChild(aiDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
        }

        function manualDispatchReport() {
            addConsoleLog('[DISPATCH] Manual vitals report pushed to Dr. Jenkins (EMR) and Family SMS gateway.');
            const badge = document.getElementById('dispatch-status-badge');
            badge.innerText = "Dispatched";
            setTimeout(() => badge.innerText = "Live Sync", 3000);
        }

        function addConsoleLog(text) {
            const consoleBox = document.getElementById('ai-console');
            const timeStr = new Date().toTimeString().split(' ')[0];
            const div = document.createElement('div');
            div.className = text.includes('ALERT') ? "text-rose-400 font-bold" : "text-slate-300";
            div.innerText = \`[\${timeStr}] \${text}\`;
            consoleBox.appendChild(div);
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }

        function clearConsole() {
            document.getElementById('ai-console').innerHTML = '<div class="text-slate-500">[SYSTEM] Console cleared.</div>';
        }

        // Charts
        const ctx1 = document.getElementById('telemetryChart1').getContext('2d');
        const ctx2 = document.getElementById('telemetryChart2').getContext('2d');

        const timeLabels = Array.from({length: 15}, (_, i) => \`-\${(15-i)*2}s\`);
        const chart1 = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    { label: 'pH Level', data: Array(15).fill(7.14), borderColor: '#00f2fe', borderWidth: 2, tension: 0.4, yAxisID: 'y' },
                    { label: 'Sugar (mg/dL)', data: Array(15).fill(122), borderColor: '#ffbb33', borderWidth: 2, tension: 0.4, yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                    y: { type: 'linear', position: 'left', min: 6.5, max: 8.0, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#00f2fe', font: { size: 10 } } },
                    y1: { type: 'linear', position: 'right', min: 70, max: 200, grid: { drawOnChartArea: false }, ticks: { color: '#ffbb33', font: { size: 10 } } }
                },
                plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } }
            }
        });

        const chart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{ label: 'TENG Power (mW)', data: Array(15).fill(1.42), borderColor: '#00c851', backgroundColor: 'rgba(0, 200, 81, 0.15)', borderWidth: 2, fill: true, tension: 0.4 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                    y: { min: 0, max: 4, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#00c851', font: { size: 10 } } }
                },
                plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } }
            }
        });

        // Listen for live backend socket telemetry updates
        socket.on('live-telemetry', (packet) => {
            document.getElementById('val-ph').innerText = packet.ph;
            document.getElementById('val-sugar').innerText = packet.sugar;
            document.getElementById('val-temp').innerText = packet.temp;
            document.getElementById('rep-sugar').innerText = packet.sugar + ' mg/dL';
            document.getElementById('rep-ph').innerText = packet.ph;
            document.getElementById('rep-temp').innerText = packet.temp + '°C';

            document.getElementById('ph-marker').style.left = Math.max(0, Math.min(100, ((packet.ph - 5.5) / 3.0) * 100)) + '%';
            document.getElementById('sugar-marker').style.left = Math.max(0, Math.min(100, ((packet.sugar - 70) / 130) * 100)) + '%';

            if (packet.infectionRisk) {
                document.getElementById('ph-badge').innerText = "INFECTION ALERT (>7.5 pH)";
                document.getElementById('ph-badge').className = "px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse";
                addConsoleLog(\`[INFECTION ALERT] pH Spike detected (\${packet.ph}). UV disinfection boosted to max intensity!\`);
            } else {
                document.getElementById('ph-badge').innerText = "Optimal Healing";
                document.getElementById('ph-badge').className = "px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
            }

            // Update charts
            chart1.data.labels.shift(); chart1.data.labels.push(packet.time);
            chart1.data.datasets[0].data.shift(); chart1.data.datasets[0].data.push(packet.ph);
            chart1.data.datasets[1].data.shift(); chart1.data.datasets[1].data.push(packet.sugar);
            chart1.update('none');

            chart2.data.labels.shift(); chart2.data.labels.push(packet.time);
            chart2.data.datasets[0].data.shift(); chart2.data.datasets[0].data.push(packet.teng);
            chart2.update('none');
        });
    </script>
</body>
</html>`);
});

// WebSocket Connection & Simulated Firmware Telemetry Loop
io.on('connection', (socket) => {
    console.log('[DASHBOARD] Client connected to Shusuta Gateway.');

    socket.on('patient-feedback', (msg) => {
        console.log(`[TINYFISH AI] Learned patient feedback: "${msg}"`);
    });
});

// Broadcast live sensor data and threshold checks every 2 seconds
let counter = 0;
setInterval(() => {
    counter++;
    const ph = +(7.10 + Math.sin(counter * 0.4) * 0.08 + (Math.random() * 0.04)).toFixed(2);
    const sugar = Math.floor(120 + Math.sin(counter * 0.3) * 15 + (Math.random() * 5));
    const temp = +(36.8 + Math.cos(counter * 0.2) * 0.2).toFixed(1);
    const teng = +(1.30 + Math.random() * 0.6).toFixed(2);

    // Threshold evaluation rules
    const infectionRisk = (ph > 7.50) || (temp > 37.80);

    io.emit('live-telemetry', {
        time: counter + 's',
        ph,
        sugar,
        temp,
        teng,
        infectionRisk
    });
}, 2000);

server.listen(PORT, () => {
    console.log(`Shusuta Bioelectronic Platform running on http://localhost:${PORT}`);
});