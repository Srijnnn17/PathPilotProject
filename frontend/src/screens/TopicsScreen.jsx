import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetTopicsQuery } from '../slices/topicsApiSlice.js';
import Loader from '../components/Loader.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Terminal, Cpu, Globe, 
  Shield, Database, Code, Smartphone, 
  Cloud, Lock, Sparkles, ArrowRight,
  Wifi, Gamepad2, PenTool, Server, 
  Box, Glasses, Activity, Layers
} from 'lucide-react';

// --- EXPANDED DEMO DATA (16 TOPICS) ---
const DEMO_TOPICS = [
  // Core Tech
  { _id: 'demo-1', name: 'Cyber Security', description: 'Learn ethical hacking, network defense, and cryptography basics.', icon: Shield },
  { _id: 'demo-2', name: 'Artificial Intelligence', description: 'Master neural networks, machine learning algorithms, and NLP.', icon: Cpu },
  { _id: 'demo-3', name: 'Cloud Computing', description: 'Deploy scalable apps using AWS, Azure, and Docker containers.', icon: Cloud },
  { _id: 'demo-4', name: 'Blockchain & Web3', description: 'Understand smart contracts, Solidity, and decentralized apps.', icon: Lock },
  
  // Development
  { _id: 'demo-5', name: 'Full Stack Dev', description: 'Build end-to-end applications with the MERN stack.', icon: Globe },
  { _id: 'demo-6', name: 'Data Structures', description: 'Ace your coding interviews with DSA mastery.', icon: Database },
  { _id: 'demo-7', name: 'Mobile Dev', description: 'Create cross-platform apps using React Native and Flutter.', icon: Smartphone },
  { _id: 'demo-8', name: 'DevOps Engineering', description: 'Automate CI/CD pipelines and manage infrastructure as code.', icon: Terminal },

  // New Additions
  { _id: 'demo-9', name: 'Internet of Things', description: 'Connect physical devices to the cloud using Arduino and Raspberry Pi.', icon: Wifi },
  { _id: 'demo-10', name: 'Game Development', description: 'Build 3D worlds and physics engines using Unity and Unreal Engine.', icon: Gamepad2 },
  { _id: 'demo-11', name: 'Data Science', description: 'Analyze complex datasets using Python, Pandas, and visualization tools.', icon: Activity },
  { _id: 'demo-12', name: 'UI/UX Design', description: 'Master wireframing, prototyping, and user-centric design principles.', icon: PenTool },
  { _id: 'demo-13', name: 'System Design', description: 'Architect scalable distributed systems and microservices.', icon: Server },
  { _id: 'demo-14', name: 'Kubernetes', description: 'Orchestrate containerized applications at massive scale.', icon: Box },
  { _id: 'demo-15', name: 'AR / VR', description: 'Create immersive augmented and virtual reality experiences.', icon: Glasses },
  { _id: 'demo-16', name: 'Microservices', description: 'Break down monoliths into independent, deployable services.', icon: Layers },
];

const TopicsScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: dbTopics, isLoading, error } = useGetTopicsQuery();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Combine Real DB topics with Demo topics
  const displayTopics = dbTopics ? [...dbTopics, ...DEMO_TOPICS] : DEMO_TOPICS;

  // Filter logic
  const filteredTopics = displayTopics.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper: Get Color Theme based on index
  const getTheme = (index) => {
    const themes = [
      { color: 'text-cyan-400', border: 'group-hover:border-cyan-500/50', shadow: 'group-hover:shadow-cyan-500/20', bg: 'bg-cyan-500/10' },
      { color: 'text-purple-400', border: 'group-hover:border-purple-500/50', shadow: 'group-hover:shadow-purple-500/20', bg: 'bg-purple-500/10' },
      { color: 'text-emerald-400', border: 'group-hover:border-emerald-500/50', shadow: 'group-hover:shadow-emerald-500/20', bg: 'bg-emerald-500/10' },
      { color: 'text-rose-400', border: 'group-hover:border-rose-500/50', shadow: 'group-hover:shadow-rose-500/20', bg: 'bg-rose-500/10' },
      { color: 'text-amber-400', border: 'group-hover:border-amber-500/50', shadow: 'group-hover:shadow-amber-500/20', bg: 'bg-amber-500/10' },
      { color: 'text-blue-400', border: 'group-hover:border-blue-500/50', shadow: 'group-hover:shadow-blue-500/20', bg: 'bg-blue-500/10' },
    ];
    return themes[index % themes.length];
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-indigo-500/30 pt-28 pb-20 px-4">
      
      {/* 1. BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        
        {/* 2. HEADER & SEARCH */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold uppercase tracking-wider"
          >
            <Sparkles size={14} />
            Explore our TECH Universe ...
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Mission</span>
          </h1>
          
          {/* Holographic Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="relative w-full max-w-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-[#111116] border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Search className="text-slate-400 ml-3" size={20} />
              <input 
                type="text"
                placeholder="Search protocols (e.g. 'Kubernetes', 'Design')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-white px-4 py-2 focus:outline-none placeholder-slate-500 font-medium"
              />
              <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-xs text-slate-400">
                <span className="font-mono">CMD + K</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. CONTENT GRID */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : error ? (
          <div className="text-center text-red-400">{error?.data?.message || error.error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredTopics.map((topic, index) => {
                const theme = getTheme(index);
                const Icon = topic.icon || Code;

                return (
                  <motion.div
                    key={topic._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }} // Faster stagger
                    className={`group relative flex flex-col p-6 rounded-3xl bg-[#111116] border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${theme.border} ${theme.shadow}`}
                  >
                    {/* Top Glow Line */}
                    <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-${theme.color.split('-')[1]}-500/50 transition-all`} />

                    {/* Icon Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${theme.bg} ${theme.color}`}>
                        <Icon size={28} />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Content */}
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors line-clamp-1">
                      {topic.name}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {topic.description || `Master ${topic.name} with our adaptive AI curriculum. Dive deep into core concepts.`}
                    </p>

                    {/* Action Button */}
                    <Link
                      to={`/quiz/${topic._id}`}
                      className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 font-bold hover:bg-white hover:text-black transition-all group/btn"
                    >
                      <span className="text-xs uppercase tracking-wider">Initialize</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsScreen;