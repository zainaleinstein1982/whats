import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Smartphone, Palette, Presentation, Gamepad2, Film, Scissors, 
  Search, Mail, TrendingUp, Users, Package, Building2, Shield, Download, 
  BookOpen, Sparkles, HelpCircle, ArrowRight, X, Plus, RefreshCw, CheckCircle2, 
  Terminal, FileCode, Layers, Play, Check, Copy, ExternalLink, Settings, Lock,
  Sun, Moon, Move, MessageSquare
} from 'lucide-react';

interface LogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface FileItem {
  name: string;
  icon: string;
  size: string;
  content?: string;
}

interface TaskStep {
  text: string;
  status: 'pending' | 'active' | 'done';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'events' | 'team' | 'pricing'>('home');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [selectedChip, setSelectedChip] = useState('Website');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [currentWorkspaceTab, setCurrentWorkspaceTab] = useState<'logs' | 'files' | 'tasks' | 'terminal'>('logs');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Theme state: light or dark
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Floating whats AI Agent position state
  const [agentPos, setAgentPos] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Workspace state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [tasks, setTasks] = useState<TaskStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Initializing...');
  
  // Selected file preview modal
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Pricing annual toggle
  const [isAnnual, setIsAnnual] = useState(false);

  // Ideas set
  const ideaSets = [
    [
      { icon: '🎯', text: 'Build OKR tracking tool for engineering teams' },
      { icon: '💬', text: 'Build real-time customer support ticketing platform' },
      { icon: '🎨', text: 'Product designer portfolio website with smooth animations' }
    ],
    [
      { icon: '📊', text: 'Create financial analytics dashboard with stock charts' },
      { icon: '🛒', text: 'Build high-converting e-commerce store with checkout' },
      { icon: '📱', text: 'Design mobile-first social media community app' }
    ],
    [
      { icon: '🤖', text: 'Build AI-powered document summarizer and knowledge base' },
      { icon: '📝', text: 'Create modern blog platform with markdown CMS' },
      { icon: '🎮', text: 'Build browser-based multiplayer arcade game' }
    ]
  ];
  const [ideaSetIndex, setIdeaSetIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.nav-item')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle Dragging for the floating whats AI Agent
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setAgentPos({
        x: Math.max(20, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x)),
        y: Math.max(20, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleAgentClick = () => {
    setCurrentPage('home');
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.value = 'What can I do for you? ';
      setTaskInput('What can I do for you? ');
      textareaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const startTask = async (customPrompt?: string) => {
    const promptText = customPrompt || taskInput;
    if (!promptText.trim()) {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.outline = '2px solid #ff5f57';
        setTimeout(() => {
          if (textareaRef.current) textareaRef.current.style.outline = '';
        }, 1000);
      }
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    setLogs([]);
    setFiles([]);
    setTasks([
      { text: 'Analyze requirements & specifications', status: 'pending' },
      { text: 'Perform wide research & best practices', status: 'pending' },
      { text: 'Design system architecture & file structure', status: 'pending' },
      { text: 'Execute code generation & browser automation', status: 'pending' },
      { text: 'Run verification tests & performance optimization', status: 'pending' }
    ]);

    setIsWorkspaceOpen(true);
    setCurrentWorkspaceTab('tasks');
    setProgress(5);
    setProgressLabel('Initializing OpenWhats Agent...');

    const addLogMsg = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [{ time, message, type }, ...prev]);
    };

    addLogMsg(`🎯 Task received: "${promptText}"`, 'info');

    try {
      await new Promise(r => setTimeout(r, 800));
      setTasks(prev => prev.map((t, i) => i === 0 ? { ...t, status: 'active' } : t));
      setProgress(15);
      setProgressLabel('Analyzing task requirements...');
      addLogMsg('🔍 Analyzing prompt semantics & dependencies...', 'info');

      await new Promise(r => setTimeout(r, 1000));
      setTasks(prev => prev.map((t, i) => i === 0 ? { ...t, status: 'done' } : t));
      setProgress(30);
      setProgressLabel('Researching...');
      addLogMsg('✓ Requirements validated successfully', 'success');

      setTasks(prev => prev.map((t, i) => i === 1 ? { ...t, status: 'active' } : t));
      addLogMsg('📚 Querying knowledge base & web search...', 'info');

      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, mode: selectedChip })
      });
      const data = await res.json();

      await new Promise(r => setTimeout(r, 1000));
      setTasks(prev => prev.map((t, i) => i === 1 ? { ...t, status: 'done' } : t));
      setProgress(50);
      setProgressLabel('Designing architecture...');
      addLogMsg('✓ Wide research complete', 'success');

      setTasks(prev => prev.map((t, i) => i === 2 ? { ...t, status: 'active' } : t));
      addLogMsg('🏗️ Establishing project structure & schemas...', 'info');
      await new Promise(r => setTimeout(r, 1000));
      setTasks(prev => prev.map((t, i) => i === 2 ? { ...t, status: 'done' } : t));
      setProgress(70);
      setProgressLabel('Generating code...');

      if (data.files && data.files.length > 0) {
        setFiles(data.files);
      } else {
        setFiles([
          { name: 'index.html', icon: '📄', size: '2.4 KB', content: '<!DOCTYPE html>\n<html>\n<head><title>App</title></head>\n<body><div id="root"></div></body>\n</html>' },
          { name: 'App.tsx', icon: '⚛️', size: '4.8 KB', content: 'export default function App() {\n  return <div>OpenWhats App</div>;\n}' },
          { name: 'server.ts', icon: '🚀', size: '3.1 KB', content: 'import express from "express";\nconst app = express();' }
        ]);
      }

      if (data.logs) {
        setLogs(data.logs.reverse());
      }

      setTasks(prev => prev.map((t, i) => i === 3 ? { ...t, status: 'active' } : t));
      addLogMsg('💻 Executing code generation & browser operator tasks...', 'info');
      await new Promise(r => setTimeout(r, 1200));
      setTasks(prev => prev.map((t, i) => i === 3 ? { ...t, status: 'done' } : t));
      setProgress(90);
      setProgressLabel('Testing & optimizing...');
      addLogMsg('✓ Code generation completed successfully', 'success');

      setTasks(prev => prev.map((t, i) => i === 4 ? { ...t, status: 'active' } : t));
      addLogMsg('⚡ Running verification suite & performance audit...', 'info');
      await new Promise(r => setTimeout(r, 1000));
      setTasks(prev => prev.map((t, i) => i === 4 ? { ...t, status: 'done' } : t));
      setProgress(100);
      setProgressLabel('Task Complete!');
      addLogMsg('🎉 All autonomous steps completed successfully!', 'success');

    } catch (err: any) {
      addLogMsg(`❌ Error during execution: ${err.message}`, 'error');
      setProgressLabel('Execution failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyCode = (content?: string) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-[#121212] text-[#f0f0f0]' : 'bg-[#f7f7f8] text-[#1a1a1a]'}`}>
      
      {/* Header */}
      <header className={`flex items-center justify-between px-12 py-4 border-b sticky top-0 z-100 transition-colors ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#ececec]'}`}>
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight cursor-pointer" onClick={() => setCurrentPage('home')}>
          <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" fill={isDark ? "#ffffff" : "#1a1a1a"}/>
            <path d="M16 8l-6 3v6l6 3 6-3v-6l-6-3z" fill={isDark ? "#121212" : "white"}/>
          </svg>
          whats
        </div>

        <nav className="flex items-center gap-2">
          {/* Features Dropdown */}
          <div className="relative nav-item">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${isDark ? 'text-[#bbb] hover:text-white hover:bg-[#2a2a2a]' : 'text-[#555] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'}`}
              onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
            >
              Features
            </button>
            {activeDropdown === 'features' && (
              <div className={`absolute top-full left-0 mt-2 border rounded-xl shadow-xl w-80 p-2 z-200 grid grid-cols-1 gap-1 ${isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-[#e8e8e8]'}`}>
                {[
                  { icon: <Globe className="w-4 h-4 text-blue-500" />, title: 'Web app', desc: 'Build full-stack, AI-powered sites' },
                  { icon: <Smartphone className="w-4 h-4 text-purple-500" />, title: 'Mobile app', desc: 'Build native iOS & Android apps' },
                  { icon: <Palette className="w-4 h-4 text-pink-500" />, title: 'AI design', desc: 'Automates the entire design journey' },
                  { icon: <Presentation className="w-4 h-4 text-amber-500" />, title: 'AI slides', desc: 'Use Nano Banana Pro to create slides' },
                  { icon: <Gamepad2 className="w-4 h-4 text-emerald-500" />, title: 'Game development', desc: 'Make your own game' },
                  { icon: <Film className="w-4 h-4 text-red-500" />, title: 'Video', desc: 'Turn an idea into a film' },
                  { icon: <Scissors className="w-4 h-4 text-indigo-500" />, title: 'Video Editor', desc: 'Make every cut your own' },
                  { icon: <Search className="w-4 h-4 text-cyan-500" />, title: 'Wide Research', desc: 'Parallel research at scale' },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#f5f5f5]'}`}
                    onClick={() => { setActiveDropdown(null); startTask(`Build a ${item.title.toLowerCase()} with autonomous multi-step execution`); }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#f5f5f5]'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{item.title}</div>
                      <div className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#888]'}`}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div className="relative nav-item">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${isDark ? 'text-[#bbb] hover:text-white hover:bg-[#2a2a2a]' : 'text-[#555] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'}`}
              onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
            >
              Solutions
            </button>
            {activeDropdown === 'solutions' && (
              <div className={`absolute top-full left-0 mt-2 border rounded-xl shadow-xl w-72 p-2 z-200 ${isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-[#e8e8e8]'}`}>
                {[
                  { icon: <TrendingUp className="w-4 h-4 text-blue-500" />, title: 'Marketing', desc: 'From creatives to conversions' },
                  { icon: <Users className="w-4 h-4 text-emerald-500" />, title: 'Sales', desc: 'From leads to deals' },
                  { icon: <Package className="w-4 h-4 text-purple-500" />, title: 'Product', desc: 'From ideas to launch' },
                  { icon: <Building2 className="w-4 h-4 text-amber-500" />, title: 'Finance', desc: 'From numbers to strategy' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#f5f5f5]'}`}
                    onClick={() => { setActiveDropdown(null); startTask(`Create a ${item.title.toLowerCase()} automated workflow solution with whats AI agent`); }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#f5f5f5]'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{item.title}</div>
                      <div className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#888]'}`}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="relative nav-item">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${isDark ? 'text-[#bbb] hover:text-white hover:bg-[#2a2a2a]' : 'text-[#555] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'}`}
              onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
            >
              Resources
            </button>
            {activeDropdown === 'resources' && (
              <div className={`absolute top-full left-0 mt-2 border rounded-xl shadow-xl w-72 p-2 z-200 ${isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-[#e8e8e8]'}`}>
                {[
                  { icon: <Download className="w-4 h-4 text-blue-500" />, title: 'Download', desc: 'Download whats desktop apps' },
                  { icon: <BookOpen className="w-4 h-4 text-emerald-500" />, title: 'Blog', desc: 'Ideas, guides, and user stories' },
                  { icon: <Shield className="w-4 h-4 text-purple-500" />, title: 'Trust center', desc: 'Security and compliance' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#f5f5f5]'}`}
                    onClick={() => { setActiveDropdown(null); alert(`${item.title} resource selected for whats AI Agent`); }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#f5f5f5]'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{item.title}</div>
                      <div className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#888]'}`}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${currentPage === 'events' ? (isDark ? 'text-white bg-[#333]' : 'text-[#1a1a1a] bg-[#f0f0f0]') : (isDark ? 'text-[#bbb] hover:text-white hover:bg-[#2a2a2a]' : 'text-[#555] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]')}`}
            onClick={() => setCurrentPage('events')}
          >
            Events
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${currentPage === 'team' ? (isDark ? 'text-white bg-[#333]' : 'text-[#1a1a1a] bg-[#f0f0f0]') : (isDark ? 'text-[#bbb] hover:text-white hover:bg-[#2a2a2a]' : 'text-[#555] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]')}`}
            onClick={() => setCurrentPage('team')}
          >
            Team
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${currentPage === 'pricing' ? (isDark ? 'text-white bg-[#333]' : 'text-[#1a1a1a] bg-[#f0f0f0]') : (isDark ? 'text-[#bbb] hover:text-white hover:bg-[#2a2a2a]' : 'text-[#555] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]')}`}
            onClick={() => setCurrentPage('pricing')}
          >
            Pricing
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button 
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${isDark ? 'border-[#444] bg-[#2a2a2a] text-yellow-400 hover:bg-[#333]' : 'border-[#ddd] bg-white text-[#555] hover:bg-[#f5f5f5]'}`}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
            onClick={() => alert('Sign in modal')}
          >
            Sign in
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${isDark ? 'bg-transparent text-white border-[#444] hover:border-white' : 'bg-white text-[#1a1a1a] border-[#ddd] hover:border-[#1a1a1a]'}`}
            onClick={() => alert('Sign up modal')}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {currentPage === 'home' && (
        <main className="max-w-[880px] w-full mx-auto px-6 pt-20 pb-16 flex-1">
          <h1 className={`font-['Playfair_Display'] text-5xl md:text-6xl text-center font-normal mb-12 tracking-tight ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
            What can I do for you?
          </h1>

          {/* Prompt Box */}
          <div className={`border rounded-2xl p-6 shadow-xs transition mb-10 ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#e8e8e8]'}`}>
            <textarea
              ref={textareaRef}
              value={taskInput}
              onChange={handleTextareaInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  startTask();
                }
              }}
              placeholder="What can I do for you?"
              className={`w-full min-h-[72px] border-none outline-none text-base resize-none leading-relaxed placeholder-[#999] bg-transparent ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
            />
            <div className={`flex items-center justify-between pt-4 border-t mt-3 ${isDark ? 'border-[#333]' : 'border-[#f0f0f0]'}`}>
              <div className="flex items-center gap-2.5">
                <button 
                  className={`w-9 h-9 rounded-full border flex items-center justify-center text-lg transition ${isDark ? 'border-[#444] bg-[#222] text-[#ccc] hover:bg-[#333]' : 'border-[#e5e5e5] bg-white text-[#555] hover:bg-[#f8f8f8]'}`}
                  title="Add attachment"
                  onClick={() => alert('Attachment upload dialog')}
                >
                  +
                </button>
                <button 
                  className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-1.5 transition ${selectedChip === 'Website' ? (isDark ? 'bg-[#2a365c] border-[#4b63a9] text-[#8ab4f8]' : 'bg-[#f0f4ff] border-[#c5d4ff] text-[#3b5bdb]') : (isDark ? 'bg-[#222] border-[#444] text-[#ccc]' : 'bg-white border-[#e5e5e5] text-[#333]')}`}
                  onClick={() => setSelectedChip('Website')}
                >
                  <span>🌐</span> Website
                </button>
                <button 
                  className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-1.5 transition ${selectedChip === 'Browser Operator' ? (isDark ? 'bg-[#2a365c] border-[#4b63a9] text-[#8ab4f8]' : 'bg-[#f0f4ff] border-[#c5d4ff] text-[#3b5bdb]') : (isDark ? 'bg-[#222] border-[#444] text-[#ccc]' : 'bg-white border-[#e5e5e5] text-[#333]')}`}
                  onClick={() => setSelectedChip('Browser Operator')}
                >
                  <span>🌍</span> Browser Operator
                </button>
                <button 
                  className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-1.5 transition ${selectedChip === 'Wide Research' ? (isDark ? 'bg-[#2a365c] border-[#4b63a9] text-[#8ab4f8]' : 'bg-[#f0f4ff] border-[#c5d4ff] text-[#3b5bdb]') : (isDark ? 'bg-[#222] border-[#444] text-[#ccc]' : 'bg-white border-[#e5e5e5] text-[#333]')}`}
                  onClick={() => setSelectedChip('Wide Research')}
                >
                  <span>🔍</span> Wide Research
                </button>
              </div>

              <button 
                disabled={isProcessing}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-50 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
                onClick={() => startTask()}
                title="Submit task"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Template Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-sm font-bold tracking-wide uppercase ${isDark ? 'text-[#ccc]' : 'text-[#1a1a1a]'}`}>Build a website</h2>
            <div className="flex items-center gap-1.5">
              <button className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${isDark ? 'border-[#444] bg-[#1e1e1e] text-[#aaa]' : 'border-[#e5e5e5] bg-white text-[#666]'}`}>‹</button>
              <button className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${isDark ? 'border-[#444] bg-[#1e1e1e] text-[#aaa]' : 'border-[#e5e5e5] bg-white text-[#666]'}`}>›</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { title: 'E-commerce 💰', prompt: 'E-commerce website dengan shopping cart dan payment gateway' },
              { title: 'Landing Page', prompt: 'Landing page modern untuk startup AI dengan hero, features, dan pricing' },
              { title: 'Dashboard', prompt: 'Dashboard analytics dengan chart interaktif dan real-time metrics' },
              { title: 'Corporate', prompt: 'Corporate website profesional untuk agensi teknologi' }
            ].map((tmpl, idx) => (
              <div 
                key={idx}
                className={`border rounded-xl p-4 cursor-pointer transition group ${isDark ? 'bg-[#1a1a1a] border-[#333] hover:border-[#555]' : 'bg-white border-[#e8e8e8] hover:border-[#ccc] hover:shadow-md'}`}
                onClick={() => startTask(tmpl.prompt)}
              >
                <div className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{tmpl.title}</div>
                <div className={`border rounded-lg p-2.5 h-24 flex flex-col gap-1.5 ${isDark ? 'bg-[#222] border-[#333]' : 'bg-[#f8f9fa] border-[#eee]'}`}>
                  <div className="flex gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#28c840]"></div>
                  </div>
                  <div className={`h-1.5 rounded w-3/4 ${isDark ? 'bg-[#444]' : 'bg-[#e5e5e5]'}`}></div>
                  <div className={`h-8 rounded ${isDark ? 'bg-[#333]' : 'bg-[#e8e8e8]'}`}></div>
                  <div className="h-2 bg-[#3b5bdb] rounded w-1/2 mt-1"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Ideas Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-sm font-bold tracking-wide uppercase ${isDark ? 'text-[#ccc]' : 'text-[#1a1a1a]'}`}>Explore ideas</h2>
            <button 
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition ${isDark ? 'border-[#444] bg-[#1e1e1e] text-[#aaa] hover:bg-[#333]' : 'border-[#e5e5e5] bg-white text-[#666] hover:bg-[#f5f5f5]'}`}
              onClick={() => setIdeaSetIndex((prev) => (prev + 1) % ideaSets.length)}
              title="Refresh ideas"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {ideaSets[ideaSetIndex].map((idea, idx) => (
              <div 
                key={idx}
                className={`border rounded-xl p-5 cursor-pointer transition flex flex-col justify-between min-h-[110px] ${isDark ? 'bg-[#1a1a1a] border-[#333] hover:border-[#555]' : 'bg-white border-[#e8e8e8] hover:border-[#ccc] hover:shadow-md'}`}
                onClick={() => startTask(idea.text)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#f5f5f5]'}`}>
                  {idea.icon}
                </div>
                <div className={`text-sm font-medium leading-snug ${isDark ? 'text-[#ddd]' : 'text-[#333]'}`}>{idea.text}</div>
              </div>
            ))}
          </div>
        </main>
      )}

      {currentPage === 'events' && (
        <div className="flex-1 relative bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-[500px] flex items-center px-12 md:px-24">
          <div className="text-white max-w-xl z-10">
            <div className="text-sm font-medium opacity-90 mb-4">Past event</div>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-normal mb-8 leading-tight">How to Win a Hackathon with whats AI Agent</h1>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">📅</div>
                <div>
                  <div className="font-semibold">October 15, 2026</div>
                  <div className="text-sm opacity-90">2:00 PM - 6:00 PM GMT+1</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">📍</div>
                <div>
                  <div className="font-semibold">Global Virtual & Dublin Hub</div>
                  <div className="text-sm opacity-90">WorkIQ Tallaght, Dublin 24</div>
                </div>
              </div>
            </div>
            <button className="px-7 py-3.5 bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white rounded-xl font-semibold transition">
              View event recap
            </button>
          </div>
        </div>
      )}

      {currentPage === 'team' && (
        <div className="max-w-[1200px] mx-auto px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-1">
          <div>
            <h1 className={`font-['Playfair_Display'] text-4xl md:text-6xl font-normal leading-tight mb-6 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              Business AI That Works Like Your Best Employee.
            </h1>
            <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-[#aaa]' : 'text-[#666]'}`}>
              Automate complex workflows, connect your tools, and scale operations instantly without adding headcount using autonomous whats AI agents.
            </p>
            <div className="flex gap-4">
              <button 
                className={`px-7 py-3.5 rounded-xl font-semibold transition ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
                onClick={() => setCurrentPage('home')}
              >
                Get Started
              </button>
              <button 
                className={`px-7 py-3.5 rounded-xl font-semibold transition ${isDark ? 'bg-[#2a2a2a] text-white hover:bg-[#333]' : 'bg-[#f0f0f0] text-[#1a1a1a] hover:bg-[#e0e0e0]'}`}
                onClick={() => alert('Sales contact opened')}
              >
                Contact sales
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#87CEEB] via-[#E0F6FF] to-[#FFB6C1] rounded-2xl h-[400px] flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="grid grid-cols-3 gap-5 p-8">
              {['👨‍💼', '👩‍💼', '👨‍💻', '👩‍🔬', '🎨', '🚀'].map((icon, i) => (
                <div key={i} className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentPage === 'pricing' && (
        <div className="max-w-[1200px] mx-auto px-12 py-16 flex-1 w-full">
          <div className="text-center mb-12">
            <h1 className={`font-['Playfair_Display'] text-4xl md:text-5xl font-normal mb-4 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>Simple, transparent pricing</h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-[#aaa]' : 'text-[#666]'}`}>Choose the plan that fits your autonomous agent workflow</p>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? (isDark ? 'text-white font-bold' : 'text-[#1a1a1a] font-bold') : (isDark ? 'text-[#777]' : 'text-[#666]')}`}>Monthly</span>
              <div 
                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition relative ${isDark ? 'bg-[#444]' : 'bg-[#1a1a1a]'}`}
                onClick={() => setIsAnnual(!isAnnual)}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition transform ${isAnnual ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className={`text-sm font-medium ${isAnnual ? (isDark ? 'text-white font-bold' : 'text-[#1a1a1a] font-bold') : (isDark ? 'text-[#777]' : 'text-[#666]')}`}>
                Annual <span className="text-[#28a745] text-xs font-bold">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {[
              { name: 'Starter', desc: 'For individuals exploring AI agents', priceM: '0', priceA: '0', btn: 'secondary', popular: false },
              { name: 'Pro', desc: 'For professionals & power users', priceM: '29', priceA: '23', btn: 'primary', popular: true },
              { name: 'Enterprise', desc: 'For large teams & organizations', priceM: '99', priceA: '79', btn: 'secondary', popular: false }
            ].map((plan, idx) => (
              <div key={idx} className={`border rounded-2xl p-8 relative transition hover:shadow-xl ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#e8e8e8]'} ${plan.popular ? (isDark ? 'border-2 border-white' : 'border-2 border-[#1a1a1a]') : ''}`}>
                {plan.popular && (
                  <div className={`absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${isDark ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}`}>
                    Most Popular
                  </div>
                )}
                <div className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{plan.name}</div>
                <div className={`text-sm mb-6 ${isDark ? 'text-[#aaa]' : 'text-[#666]'}`}>{plan.desc}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>$</span>
                  <span className={`text-5xl font-extrabold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{isAnnual ? plan.priceA : plan.priceM}</span>
                  <span className={`text-sm ${isDark ? 'text-[#aaa]' : 'text-[#666]'}`}>/month</span>
                </div>
                <ul className={`space-y-3 mb-8 text-sm ${isDark ? 'text-[#ccc]' : 'text-[#333]'}`}>
                  <li className="flex items-center gap-2">✓ Unlimited autonomous runs</li>
                  <li className="flex items-center gap-2">✓ Cloud workspace & terminal</li>
                  <li className="flex items-center gap-2">✓ Browser operator enabled</li>
                  {plan.name !== 'Starter' && <li className="flex items-center gap-2">✓ Priority cloud compute</li>}
                  {plan.name === 'Enterprise' && <li className="flex items-center gap-2">✓ Dedicated account manager & SSO</li>}
                </ul>
                <button className={`w-full py-3.5 rounded-xl font-semibold transition ${plan.btn === 'primary' ? (isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1a1a1a] text-white hover:bg-[#333]') : (isDark ? 'bg-[#2a2a2a] text-white hover:bg-[#333]' : 'bg-white text-[#1a1a1a] border border-[#ddd] hover:border-[#1a1a1a]')}`}>
                  {plan.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Movable "whats" AI Agent Widget */}
      <div 
        className="fixed z-250 cursor-grab active:cursor-grabbing select-none flex flex-col items-center group"
        style={{ left: `${agentPos.x}px`, top: `${agentPos.y}px` }}
        onMouseDown={(e) => {
          setIsDragging(true);
          dragOffset.current = {
            x: e.clientX - agentPos.x,
            y: e.clientY - agentPos.y
          };
        }}
      >
        <div 
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#667eea] to-[#764ba2] text-white shadow-2xl flex items-center justify-center font-bold text-lg relative hover:scale-110 transition-transform"
          onClick={handleAgentClick}
          title="Click to activate whats AI Agent ('What can I do for you?')"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          🤖
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[11px] px-2.5 py-1 rounded-md mt-1.5 whitespace-nowrap shadow-lg font-medium pointer-events-none">
          whats AI Agent (Drag me)
        </div>
      </div>

      {/* Cloud Workspace Slide-out Panel */}
      {isWorkspaceOpen && (
        <div className="fixed inset-0 bg-black/40 z-300 flex justify-end transition-opacity">
          <div className={`w-full max-w-[540px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ${isDark ? 'bg-[#1a1a1a] text-white border-l border-[#333]' : 'bg-white text-[#1a1a1a]'}`}>
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-[#333]' : 'border-[#f0f0f0]'}`}>
              <div className="font-bold text-lg flex items-center gap-2">
                <span>🚀</span> whats Cloud Workspace
              </div>
              <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'hover:bg-[#333] text-gray-300' : 'hover:bg-[#f0f0f0] text-gray-500'}`} onClick={() => setIsWorkspaceOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className={`flex px-6 border-b ${isDark ? 'border-[#333]' : 'border-[#f0f0f0]'}`}>
              {[
                { id: 'tasks', label: '📊 Tasks' },
                { id: 'logs', label: '📜 Logs' },
                { id: 'files', label: '📁 Files' },
                { id: 'terminal', label: '💻 Terminal' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${currentWorkspaceTab === tab.id ? (isDark ? 'border-white text-white' : 'border-[#1a1a1a] text-[#1a1a1a]') : 'border-transparent text-[#999] hover:text-[#333]'}`}
                  onClick={() => setCurrentWorkspaceTab(tab.id as any)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentWorkspaceTab === 'tasks' && (
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No active tasks. Submit a prompt to start.</div>
                  ) : (
                    tasks.map((task, idx) => (
                      <div key={idx} className={`flex items-center gap-3 p-3.5 rounded-xl border ${isDark ? 'bg-[#222] border-[#333]' : 'bg-[#f8f9fa] border-[#eee]'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${task.status === 'done' ? 'bg-[#28a745]' : task.status === 'active' ? 'bg-[#667eea] animate-pulse' : 'bg-[#ccc]'}`}>
                          {task.status === 'done' ? '✓' : idx + 1}
                        </div>
                        <div className={`flex-1 text-sm font-medium ${isDark ? 'text-white' : 'text-[#333]'}`}>{task.text}</div>
                        <div className="text-xs text-[#888] font-mono">
                          {task.status === 'done' ? 'Completed' : task.status === 'active' ? 'Running...' : 'Pending'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {currentWorkspaceTab === 'logs' && (
                <div className="space-y-2 font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-sans">No logs generated yet.</div>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border-l-4 ${log.type === 'error' ? 'bg-red-950/40 border-red-500 text-red-200' : log.type === 'success' ? 'bg-green-950/40 border-green-500 text-green-200' : (isDark ? 'bg-[#222] border-blue-500 text-blue-200' : 'bg-blue-50 border-blue-500 text-blue-900')}`}>
                        <div className="text-[10px] opacity-60 mb-1">{log.time}</div>
                        <div className="font-sans font-medium">{log.message}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {currentWorkspaceTab === 'files' && (
                <div className="space-y-3">
                  {files.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-sans">No files generated yet.</div>
                  ) : (
                    files.map((file, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${isDark ? 'bg-[#222] border-[#333] hover:border-[#555]' : 'bg-[#f8f9fa] border-[#eee] hover:border-[#ccc]'}`}
                        onClick={() => setPreviewFile(file)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{file.icon}</span>
                          <div>
                            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{file.name}</div>
                            <div className="text-xs text-[#888]">{file.size}</div>
                          </div>
                        </div>
                        <button className={`text-xs font-semibold px-3 py-1.5 border rounded-lg transition ${isDark ? 'bg-[#333] border-[#444] text-white hover:bg-[#444]' : 'bg-white border-[#ddd] text-black hover:border-[#1a1a1a]'}`}>
                          View Code
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {currentWorkspaceTab === 'terminal' && (
                <div className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-4 rounded-xl h-full min-h-[350px] overflow-y-auto shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="text-[#6a9955] mb-2"># OpenWhats Autonomous Cloud Terminal v1.4.2</div>
                    <div className="text-[#569cd6]">root@open-whats-cloud:/workspace# <span className="text-[#d4d4d4]">npm run build</span></div>
                    <div className="text-[#d7ba7d] my-1">... vite v8.3.0 building for production ...</div>
                    <div className="text-[#4ec9b0] my-1">✓ built in 1.42s</div>
                    <div className="text-[#569cd6]">root@open-whats-cloud:/workspace# <span className="text-[#d4d4d4]">node server.ts</span></div>
                    <div className="text-[#4ec9b0] my-1">🚀 OpenWhats server running on http://localhost:3000</div>
                    <div className="text-[#569cd6] mt-3">root@open-whats-cloud:/workspace# <span className="animate-pulse">_</span></div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#333] flex items-center justify-between text-[11px] text-[#888]">
                    <span>Container: active (isolated)</span>
                    <span>CPU: 0.4% | RAM: 240MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Footer */}
            <div className={`p-5 border-t ${isDark ? 'border-[#333] bg-[#222]' : 'border-[#f0f0f0] bg-[#fafafa]'}`}>
              <div className="flex justify-between text-xs font-semibold text-[#888] mb-2">
                <span>{progressLabel}</span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#333]' : 'bg-[#e5e5e5]'}`}>
                <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 z-400 flex items-center justify-center p-6">
          <div className="bg-[#1e1e1e] rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-[#333] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#333] flex items-center justify-between bg-[#252526] text-white">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>{previewFile.icon}</span> {previewFile.name}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1.5 bg-[#333] border border-[#444] rounded-lg text-xs font-semibold flex items-center gap-1.5 text-white hover:bg-[#444] transition"
                  onClick={() => copyCode(previewFile.content)}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button className="w-7 h-7 rounded-full hover:bg-[#444] flex items-center justify-center text-white" onClick={() => setPreviewFile(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed">
              {previewFile.content || '// No code content available'}
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-5 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-3 z-150 ${isDark ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}`}>
        <div className="w-2 h-2 rounded-full bg-[#28c840] animate-pulse"></div>
        <span>Cloud Active • whats Autonomous AI Agent Ready</span>
        {isProcessing && <button className="underline text-xs cursor-pointer ml-2 font-bold" onClick={() => setIsWorkspaceOpen(true)}>View Workspace</button>}
      </div>
    </div>
  );
}
