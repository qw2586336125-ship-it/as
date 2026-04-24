/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChevronDown, Moon, Shield, Sword, Flame, Sun, MapPin, Menu, X, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const STORY_BEATS = [
  {
    id: 'ambition',
    title: '第一章：执念之萌',
    subtitle: '京城城楼 · 初秋之夜',
    icon: <Moon className="w-4 h-4 md:w-6 h-6" />,
    text: "京城的夜风冷冽，如刀锋利。共叔段立于城楼，指甲深深嵌入剑柄。案头的红封密信如同一团火，烧灼着他的理智。'速发兵，吾开城门内应'。母亲的偏爱是他半生的铠甲，也是他余生的咒语。他要那王座，要证明给天下人看，他才是唯一的真命天子。",
    image: "https://raw.githubusercontent.com/qw2586336125-ship-it/qw/refs/heads/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260424143256_696_35.jpg",
    accent: "from-slate-950 to-slate-900"
  },
  {
    id: 'march',
    title: '第二章：万马齐喑',
    subtitle: '原野 · 进军途中',
    icon: <Shield className="w-4 h-4 md:w-6 h-6" />,
    text: "战车隆隆，金戈轰鸣。黄尘漫天席卷，遮住了他的视线。他狂笑着策马疾驰，耳边是风的呼啸。他以为自己正驶向荣耀的彼岸，却不知那翻腾的尘土，竟是命运编织的蛛网。在他的眼中，新郑的城墙已近在咫尺。",
    image: "https://raw.githubusercontent.com/qw2586336125-ship-it/qw/refs/heads/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260424143255_695_35.jpg",
    accent: "from-orange-950 to-amber-900"
  },
  {
    id: 'trap',
    title: '第三章：鄢城杀局',
    subtitle: '鄢城郊外 · 死地',
    icon: <MapPin className="w-4 h-4 md:w-6 h-6" />,
    text: "天地瞬间变色。地平线上竖起的密密麻麻的郑国大旗，如同一座座沉默的墓碑。那是一张经营了二十二年的巨网，每一根丝线都浸透了哥哥寤生的隐忍。没有母亲，没有内应。只有寒气逼人的戈矛。他引以为傲的聪慧，在算计面前显得如此可笑。",
    image: "https://raw.githubusercontent.com/qw2586336125-ship-it/qw/refs/heads/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260424143254_694_35.jpg",
    accent: "from-red-950 to-rose-900"
  },
  {
    id: 'epiphany',
    title: '第四章：惊梦之刻',
    subtitle: '中军大帐 · 孤灯',
    icon: <Flame className="w-4 h-4 md:w-6 h-6" />,
    text: "油灯微颤。部下的请战声如雷鸣，他却只听到了自己的心跳。那是数千个鲜活的生命，有十五岁的稚童，有白发的高堂。仅仅为了自己的一己私欲，就要让他们化为尘土吗？他凝视着火焰，那是他第一次看清自己的卑微与贪婪。",
    image: "https://raw.githubusercontent.com/qw2586336125-ship-it/qw/refs/heads/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260424143253_693_35.jpg",
    accent: "from-orange-900 to-red-950"
  },
  {
    id: 'choice',
    title: '第五章：弃甲归原',
    subtitle: '残兵之前 · 抉择',
    icon: <Sword className="w-4 h-4 md:w-6 h-6" />,
    text: "那是最后的一把火。他亲手将象征权力的华丽披风投入火中，金丝银线在烈焰中扭曲化为灰烬。'不突围了。' 他的声音平静得惊人。他选择了用一生的流浪去换取将士的生机。他不再是那个骄横的公子，而是一个背负罪孽的凡人。",
    image: "https://raw.githubusercontent.com/qw2586336125-ship-it/qw/refs/heads/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260424143252_692_35.jpg",
    accent: "from-amber-950 to-stone-900"
  },
  {
    id: 'redemption',
    title: '第六章：素衣远行',
    subtitle: '流亡之路 · 黎明',
    icon: <Sun className="w-4 h-4 md:w-6 h-6" />,
    text: "黎明破晓。他身着素白麻衣，一步步走出了城门。那是一条无尽的流亡路，充满屈辱与寂寥。但在跨出那一步时，他感到前所未有的自由。沉重的青铜剑遗落在尘土中，那个贪婪不驯的段死去了，一个重生的灵魂正缓缓步向远方。",
    image: "https://raw.githubusercontent.com/qw2586336125-ship-it/qw/refs/heads/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260424143251_691_35.jpg",
    accent: "from-stone-500 to-parchment"
  }
];

function VisualPanel({ image, title, isTrapScene }: { image: string, title: string, isTrapScene: boolean }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div className="lg:col-span-7 relative group">
      {/* Scene Contrast Overlay (Special for Trap Scene) */}
      {isTrapScene && (
        <div className="absolute inset-[-100px] bg-red-glow opacity-30 z-0 pointer-events-none" />
      )}

      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`relative aspect-[16/10] overflow-hidden bg-panel border group/img ${isTrapScene ? 'border-red-900/40' : 'border-white/10 shadow-2xl shadow-black/80'}`}
      >
        <motion.img
          src={image}
          className="absolute inset-0 w-full h-[130%] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1500 ease-in-out"
          style={{ y }}
          alt={title}
          referrerPolicy="no-referrer"
          whileHover={{ scale: 1.05 }}
        />
        {/* Visual Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 to-transparent pointer-events-none" />
      </motion.div>
      
      {/* Decorative Frame */}
      <div className="absolute -top-6 -left-6 w-24 h-24 border-t border-l border-white/5 pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b border-r border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 h-32 w-px bg-white/5 hidden lg:block" />
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Sound Effects Refs
  const sounds = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Initialize sounds
    sounds.current = {
      click: new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"),
      transition: new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"),
      menu: new Audio("https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3"),
    };

    // Set volumes
    (Object.values(sounds.current) as HTMLAudioElement[]).forEach(audio => {
      audio.volume = 0.15;
    });

    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const index = Math.min(
        STORY_BEATS.length - 1,
        Math.floor((scrollPosition + windowHeight / 2) / windowHeight)
      );
      if (index !== activeBeat) {
        playSound('transition');
      }
      setActiveBeat(index);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 6) {
        scrollToChapter(key - 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeBeat, isMuted]);

  const playSound = (soundName: 'click' | 'transition' | 'menu') => {
    if (isMuted) return;
    const sound = sounds.current[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {}); // Catch autoplay block errors
    }
  };

  const scrollToChapter = (index: number) => {
    playSound('click');
    window.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    playSound('menu');
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Trigger a small sound on unmute to confirm
    if (isMuted) {
      const s = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
      s.volume = 0.1;
      s.play().catch(() => {});
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[700vh] bg-ink text-parchment overflow-x-hidden selection:bg-gold/30">
      {/* Background Layer with gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {STORY_BEATS.map((beat, index) => (
          <motion.div
            key={`bg-${beat.id}`}
            className={`absolute inset-0 bg-gradient-to-br ${beat.accent} opacity-20`}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeBeat === index ? 0.3 : 0 }}
            transition={{ duration: 1.5 }}
          />
        ))}
        {/* Subtle grid pattern or grain */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20 pointer-events-none" />
      </div>

      {/* Decorative Text Element (Vertical) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 text-[10px] tracking-[1.2em] text-white/10 uppercase vertical-rl hidden lg:block select-none pointer-events-none font-sans">
        REDEEM THE FALLEN SOUL
      </div>

      {/* Visual Navigation Menu (Side) */}
      <div className="fixed left-10 top-1/2 -translate-y-1/2 z-[60] hidden xl:flex flex-col gap-8">
        <div className="absolute left-[19px] top-6 bottom-6 w-[1px] bg-white/5">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-gold shadow-[0_0_10px_rgba(196,164,124,0.5)]"
            animate={{ height: `${(activeBeat / (STORY_BEATS.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
        
        {STORY_BEATS.map((beat, index) => (
          <button
            key={`nav-${beat.id}`}
            onClick={() => scrollToChapter(index)}
            className="group relative flex items-center gap-6 transition-all duration-500 outline-none"
          >
            <motion.div 
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-700 ${activeBeat === index ? 'bg-gold border-gold shadow-[0_0_25px_rgba(196,164,124,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-gold/40'}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={`transition-colors duration-500 ${activeBeat === index ? 'text-ink' : 'text-white/30 group-hover:text-gold'}`}>
                {beat.icon}
              </div>
              {activeBeat === index && (
                <motion.div 
                  layoutId="active-ring"
                  className="absolute inset-[-6px] border border-gold/20 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </motion.div>
            <div className="flex flex-col items-start transition-all duration-500 overflow-hidden">
               <span className={`text-[9px] uppercase tracking-[0.3em] font-sans font-bold transition-colors ${activeBeat === index ? 'text-gold' : 'text-white/20 group-hover:text-white/40'}`}>
                Chapter 0{index + 1}
               </span>
               <AnimatePresence mode="wait">
                 {activeBeat === index && (
                   <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-base font-serif whitespace-nowrap text-bright"
                   >
                    {beat.title.split('：')[1]}
                   </motion.span>
                 )}
               </AnimatePresence>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Menu Trigger & Fullscreen Nav */}
      <div className="fixed bottom-10 right-10 z-[100] xl:hidden pointer-events-auto">
        <button 
          onClick={toggleMenu}
          className="w-16 h-16 rounded-full bg-gold text-ink flex items-center justify-center shadow-[0_0_30px_rgba(196,164,124,0.4)] active:scale-90 transition-all duration-300 pointer-events-auto"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-ink/98 backdrop-blur-2xl p-6 md:p-20 overflow-y-auto scrollbar-hide"
          >
            <div className="max-w-7xl mx-auto w-full relative">
              <div className="flex justify-between items-center mb-16 px-4">
                <div className="space-y-1">
                  <span className="text-gold font-sans text-[10px] tracking-[0.5em] uppercase">Narrative Index</span>
                  <h2 className="text-4xl font-serif text-bright font-light italic">The Awakening Journey</h2>
                </div>
                <button 
                  onClick={toggleMenu}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {STORY_BEATS.map((beat, index) => (
                  <motion.button
                    key={`visual-nav-${beat.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToChapter(index)}
                    className={`group relative flex flex-col items-start p-4 border transition-all duration-500 overflow-hidden ${activeBeat === index ? 'bg-white/5 border-gold shadow-[0_20px_50px_rgba(196,164,124,0.1)]' : 'bg-transparent border-white/5 hover:border-white/20'}`}
                  >
                    <div className="relative w-full aspect-[16/9] mb-6 overflow-hidden rounded-sm">
                      <img 
                        src={beat.image} 
                        alt="" 
                        className={`w-full h-full object-cover transition-all duration-700 ${activeBeat === index ? 'scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'}`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-ink/30" />
                      <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-ink/80 backdrop-blur-md flex items-center justify-center text-gold">
                        {beat.icon}
                      </div>
                      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/50 bg-ink/80 px-2 py-1 rounded">
                        0{index + 1}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-left w-full">
                      <span className={`text-[9px] uppercase tracking-widest font-sans font-bold transition-colors ${activeBeat === index ? 'text-gold' : 'text-white/30'}`}>
                        {beat.subtitle.split(' · ')[0]}
                      </span>
                      <h4 className={`text-xl font-serif transition-colors ${activeBeat === index ? 'text-bright' : 'text-white/70 group-hover:text-white'}`}>
                        {beat.title}
                      </h4>
                      <div className={`h-0.5 bg-gold transition-all duration-700 mt-4 ${activeBeat === index ? 'w-full' : 'w-0 group-hover:w-16'}`} />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-4">Historic Epic Navigation System</p>
                <div className="w-24 h-px bg-white/5 mx-auto" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Sections */}
      {STORY_BEATS.map((beat, index) => (
        <section
          key={beat.id}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="container max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Visual Panel with Parallax */}
            <VisualPanel 
              image={beat.image} 
              title={beat.title} 
              isTrapScene={index === 2} 
            />

            {/* Narrative Panel */}
            <div className="lg:col-span-5 space-y-10 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4 text-gold mb-2">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all bg-white/5 ${index === 2 ? 'border-red-900/50 text-red-500' : 'border-gold/20'}`}>
                    {beat.icon}
                  </div>
                  <span className={`font-sans font-bold text-[10px] tracking-[0.4em] uppercase opacity-60 ${index === 2 ? 'text-red-500' : ''}`}>
                    Scene 0{index + 1}
                  </span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif text-bright leading-[1.1] font-light tracking-tight">
                  {beat.title}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-gold/40" />
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold/80 italic">
                    {beat.subtitle}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-gold/60 via-gold/10 to-transparent" />
                <p className="text-xl md:text-2xl font-serif text-parchment/90 leading-relaxed font-light">
                  {beat.text}
                </p>
              </motion.div>

              <div className="pt-6">
                {index < STORY_BEATS.length - 1 ? (
                  <motion.button
                    onClick={() => {
                      playSound('click');
                      window.scrollTo({ top: (index + 1) * window.innerHeight, behavior: 'smooth' });
                    }}
                    className="group flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.3em] hover:text-gold transition-all duration-300 pointer-events-auto"
                    whileHover={{ x: 10 }}
                  >
                    <span>Unfold Next Scene</span>
                    <div className="w-12 h-px bg-white/10 group-hover:bg-gold/40 transition-all duration-500" />
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-6">
                     <div className="px-5 py-2 border border-gold/40 text-gold text-[10px] tracking-[0.2em] uppercase font-bold bg-gold/5">
                        Historical Climax
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Final Section / Value Evolution Footer */}
      <section className="h-screen flex flex-col items-center justify-center relative bg-[#0d0d0d] border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-transparent pointer-events-none h-64" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="container max-w-4xl mx-auto text-center space-y-16 px-8 relative z-10"
        >
          <div className="space-y-4">
             <span className="text-gold font-sans text-xs tracking-[0.6em] uppercase">The Final Epilogue</span>
             <h3 className="font-serif text-6xl md:text-7xl text-bright font-extralight tracking-tighter">觉醒 · 鄢城归去</h3>
          </div>

          <p className="max-w-2xl mx-auto font-serif text-lg md:text-xl text-parchment/60 leading-relaxed italic">
            Gongshu Duan’s journey represents the transition from Maslow’s basic need for survival and recognition to the highest peak of self-transcendence, where one finds dignity in defeat.
          </p>

          {/* Value Evolution UI from Design */}
          <div className="max-w-xl mx-auto w-full pt-8 space-y-12">
            <div className="relative pt-4">
               <div className="flex justify-between items-end mb-4 font-sans text-[10px] tracking-[0.2em] uppercase text-white/30">
                  <span className={activeBeat < 3 ? 'text-gold' : ''}>Personal Ambition</span>
                  <span className={activeBeat >= 5 ? 'text-gold' : ''}>Transcendent Mercy</span>
               </div>
               <div className="h-0.5 bg-white/5 w-full relative">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gold/60"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_15px_rgba(196,164,124,1)] top-1/2 -translate-y-1/2"
                    initial={{ left: 0 }}
                    whileInView={{ left: '100%' }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
               </div>
               <div className="mt-4 text-[10px] italic opacity-40 text-center font-serif">
                A soul's progression from the weight of bronze to the lightness of linen.
               </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-12">
              <button
                onClick={() => {
                  playSound('click');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-10 py-4 border border-gold/40 text-gold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-ink transition-all duration-700 font-bold"
              >
                Re-walk the Path
              </button>
              <button 
                onClick={() => playSound('click')}
                className="px-10 py-4 bg-bright text-ink text-[11px] font-bold uppercase tracking-[0.3em] font-sans hover:bg-white transition-all shadow-xl shadow-black/40"
              >
                Share Legend
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Header Overlay (Sophisticated Style) */}
      <header className="fixed top-0 left-0 w-full p-10 z-[70] flex justify-between items-end bg-gradient-to-b from-ink via-ink/80 to-transparent border-b border-white/5 h-36 backdrop-blur-sm pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-baseline gap-6">
            <h1 className="font-serif text-4xl md:text-5xl text-bright font-light tracking-[0.1em] uppercase">
              鄢城残阳
            </h1>
            <span className="font-serif text-lg opacity-30 text-white tracking-widest hidden md:block">/ THE AWAKENING</span>
          </div>
          <p className="font-sans text-[10px] uppercase text-gold mt-4 tracking-[0.4em] font-bold">
            An Illustrated Narrative of Gongshu Duan
          </p>
        </div>
        
        <div className="pointer-events-auto flex items-end gap-10">
          <div className="hidden xl:flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMute}
                className={`p-2 rounded-full border transition-all ${isMuted ? 'border-white/5 text-white/20' : 'border-gold/30 text-gold'}`}
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-sans">Quick Navigation</span>
                <button 
                  onClick={toggleMenu}
                  className="flex items-center gap-3 text-gold hover:text-bright transition-colors group"
                >
                  <Menu size={16} />
                  <span className="text-xs tracking-widest font-bold font-sans">EXPLORE CHAPTERS</span>
                </button>
              </div>
            </div>
          </div>
          <div className="text-right hidden md:block space-y-1">
            <span className="block text-[10px] uppercase tracking-[0.3em] text-white/30 font-sans">Historical Period</span>
            <span className="text-sm italic font-serif text-white/60">Spring and Autumn Period • Zheng State</span>
          </div>
        </div>
      </header>
    </div>
  );
}
