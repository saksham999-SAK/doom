import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useDoomsdayVoting } from '../hooks/useDoomsdayVoting';
import { CountUpNumber } from './CountUpNumber';
import { VoterNameModal } from './VoterNameModal';
import { Check, Users, Zap, Shield, Crown } from 'lucide-react';
import {
  SPRING_MEDIUM,
  SPRING_LIGHT,
  SPRING_SNAPPY,
} from '../config/motionVariants';

/* ──────────────────────────────────────────────
   SVG Card Icons
────────────────────────────────────────────── */
function DoomIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="doomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D6FF" />
          <stop offset="100%" stopColor="#0050FF" />
        </linearGradient>
      </defs>
      <path d="M24 6C15.16 6 8 13.16 8 22C8 27.52 10.72 32.4 15 35.42V40H19V36H21V40H27V36H29V40H33V35.42C37.28 32.4 40 27.52 40 22C40 13.16 32.84 6 24 6Z" fill="url(#doomGrad)" />
      <circle cx="18" cy="22" r="3.5" fill="#000" fillOpacity="0.6" />
      <circle cx="30" cy="22" r="3.5" fill="#000" fillOpacity="0.6" />
      <path d="M19 32H29" stroke="#000" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AvengersIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="avengerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2A5F" />
          <stop offset="100%" stopColor="#FF8800" />
        </linearGradient>
      </defs>
      <path d="M24 4L8 10V24C8 32.84 15.16 44 24 44C32.84 44 40 32.84 40 24V10L24 4Z" fill="url(#avengerGrad)" />
      <path d="M20 22L23 25L28 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Live Battle Energy Rays Bridge Component
────────────────────────────────────────────── */
function LiveBattleEnergyRays({ doomPercent }) {
  return (
    <div className="hidden md:block absolute -bottom-11 left-0 right-0 h-10 z-20 pointer-events-none px-4">
      {/* Container tracking collision ratio */}
      <div className="relative w-full h-full flex items-center">
        
        {/* Doom Energy Ray (Left to Clash Point) */}
        <div
          className="h-[3px] bg-gradient-to-r from-[#00D6FF] via-[#0050FF] to-white relative transition-all duration-700 ease-out shadow-[0_0_15px_#00D6FF]"
          style={{ width: `${doomPercent}%` }}
        >
          {/* Flowing energy particles */}
          <motion.div
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-full bg-white shadow-[0_0_12px_#ffffff]"
          />
        </div>

        {/* Avengers Energy Ray (Clash Point to Right) */}
        <div
          className="h-[3px] bg-gradient-to-r from-white via-[#FF2A5F] to-[#FFB347] relative transition-all duration-700 ease-out shadow-[0_0_15px_#FF2A5F]"
          style={{ width: `${100 - doomPercent}%` }}
        >
          {/* Flowing energy particles */}
          <motion.div
            animate={{ x: ['100%', '0%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-full bg-white shadow-[0_0_12px_#ffffff]"
          />
        </div>

        {/* Dynamic Energy Collision Shockwave Node at exact split point */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none"
          style={{ left: `${doomPercent}%` }}
          animate={{ scale: [0.95, 1.2, 0.95], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {/* Shockwave Rings */}
          <div className="w-8 h-8 rounded-full border border-white/60 animate-ping absolute" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00D6FF] to-[#FF2A5F] blur-sm opacity-80" />
          
          <div className="relative z-10 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_#ffffff]">
            <Zap className="w-3.5 h-3.5 text-black fill-black animate-pulse" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Holographic Header Components for Voter Stacks
────────────────────────────────────────────── */
function HolographicDoomHeader() {
  return (
    <div className="relative flex flex-col items-start mb-6">
      {/* 3D Holographic Floating Badge */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex items-center gap-3 p-2.5 pr-4 rounded-2xl border border-[#00D6FF]/40 bg-[#00D6FF]/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,214,255,0.25)]"
      >
        {/* Holographic Spinning Tech Ring */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-[#00D6FF]/70"
          />
          <div className="w-8 h-8 rounded-full bg-[#00D6FF]/20 flex items-center justify-center text-[#00D6FF] shadow-[0_0_12px_#00D6FF]">
            <Crown className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[9px] font-space font-bold uppercase tracking-[0.25em] text-[#00D6FF] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] animate-ping" />
            LATVERIA // SECTOR 01
          </span>
          <span className="font-bebas text-lg tracking-wider text-white">
            DOOM SUPREMACY
          </span>
        </div>
      </motion.div>

      {/* Energy Conduit Bar running down */}
      <div className="relative w-full h-[2px] mt-3 bg-gradient-to-r from-[#00D6FF]/50 via-[#00D6FF]/20 to-transparent overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          className="w-1/3 h-full bg-white shadow-[0_0_10px_#00D6FF]"
        />
      </div>
    </div>
  );
}

function HolographicAvengersHeader() {
  return (
    <div className="relative flex flex-col items-end mb-6">
      {/* 3D Holographic Floating Badge */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [0, -1, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex items-center gap-3 p-2.5 pl-4 rounded-2xl border border-[#FF5070]/40 bg-[#FF5070]/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,80,112,0.25)]"
      >
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-space font-bold uppercase tracking-[0.25em] text-[#FF5070] flex items-center justify-end gap-1">
            EARTH-616 // AVENGERS HQ
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5070] animate-ping" />
          </span>
          <span className="font-bebas text-lg tracking-wider text-white">
            EARTH'S MIGHTIEST
          </span>
        </div>

        {/* Holographic Spinning Tech Ring */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-[#FF5070]/70"
          />
          <div className="w-8 h-8 rounded-full bg-[#FF5070]/20 flex items-center justify-center text-[#FF5070] shadow-[0_0_12px_#FF5070]">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      {/* Energy Conduit Bar running down */}
      <div className="relative w-full h-[2px] mt-3 bg-gradient-to-l from-[#FF5070]/50 via-[#FF5070]/20 to-transparent overflow-hidden">
        <motion.div
          animate={{ x: ['200%', '-100%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          className="w-1/3 h-full bg-white shadow-[0_0_10px_#FF5070]"
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Sub-component: Image Background Vote Card
────────────────────────────────────────────── */
function VoteCard({
  option,
  label,
  sublabel,
  bgImage,
  icon,
  accentColor,
  glowColor,
  isSubmitting,
  onCardClick,
}) {
  return (
    <div className="relative group w-full">
      {/* Ambient radial glow behind the card */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-60"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}66 0%, transparent 70%)`,
          transform: 'scale(1.15)',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      <motion.button
        data-cursor="hover"
        onClick={() => onCardClick(option)}
        disabled={isSubmitting}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.975 }}
        transition={SPRING_SNAPPY}
        className="relative z-10 w-full h-[380px] md:h-[440px] rounded-3xl overflow-hidden border text-center flex flex-col items-center justify-end p-8 md:p-10 focus:outline-none transition-all duration-500 shadow-2xl cursor-pointer"
        style={{
          borderColor: 'rgba(255,255,255,0.12)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
        }}
      >
        {/* Parallax-lite Image background with hover zoom */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundColor: '#0a0d14',
          }}
        />

        {/* Dark gradient overlay for max text legibility */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* Card Content Overlay */}
        <div className="relative z-20 flex flex-col items-center w-full">
          {/* Badge Icon */}
          <div className="relative mb-4">
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${glowColor}88 0%, transparent 70%)`,
                transform: 'scale(1.5)',
                filter: 'blur(10px)',
              }}
            />
            <div
              className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
              style={{
                background: 'rgba(0, 0, 0, 0.65)',
                border: `2px solid ${accentColor}66`,
              }}
            >
              {icon}
            </div>
          </div>

          <h3 className="font-bebas text-4xl md:text-5xl text-white tracking-wider mb-1 drop-shadow-lg">
            {label}
          </h3>
          <span
            className="font-space text-xs font-bold uppercase tracking-[0.25em] mb-4 drop-shadow-md"
            style={{ color: `${accentColor}` }}
          >
            {sublabel}
          </span>

          <span className="text-xs font-space tracking-widest text-white/70 uppercase border border-white/20 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
            CLICK TO VOTE
          </span>
        </div>
      </motion.button>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Live Voter Name Stack Pill Component
────────────────────────────────────────────── */
function VoterPill({ name, side }) {
  const isDoom = side === 'doom';
  const color = isDoom ? '#00D6FF' : '#FF5070';
  const border = isDoom ? 'rgba(0, 214, 255, 0.35)' : 'rgba(255, 80, 112, 0.35)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isDoom ? -40 : 40, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05, x: isDoom ? 4 : -4 }}
      transition={SPRING_LIGHT}
      className="relative group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs font-space font-semibold backdrop-blur-xl shadow-xl shrink-0 whitespace-nowrap"
      style={{
        backgroundColor: 'rgba(10, 15, 24, 0.88)',
        borderColor: border,
        color: 'rgba(255,255,255,0.95)',
        boxShadow: `0 4px 20px ${color}15`,
      }}
    >
      {/* Animated laser connector line mapping pill toward central vote card */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 h-[1px] w-24 pointer-events-none overflow-hidden ${
          isDoom ? 'left-full bg-gradient-to-r from-[#00D6FF]/60 to-transparent' : 'right-full bg-gradient-to-l from-[#FF5070]/60 to-transparent'
        }`}
      >
        <motion.div
          animate={{ x: isDoom ? ['0%', '100%'] : ['100%', '0%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-4 h-full bg-white shadow-[0_0_8px_#ffffff]"
        />
      </div>

      {/* Gentle pulsing activity dot indicator */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
          style={{ backgroundColor: color }}
        />
        <span
          className="relative inline-flex rounded-full h-1.5 w-1.5"
          style={{ backgroundColor: color }}
        />
      </span>

      <span className="tracking-wide">{name}</span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Main Voting Section
────────────────────────────────────────────── */
export function DoomsdayVotingSection() {
  const {
    doomPercent,
    avengersPercent,
    doomNames,
    avengersNames,
    isSubmitting,
    submitVoteWithName,
  } = useDoomsdayVoting();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);

  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-5%' });

  const handleCardClick = (side) => {
    if (isSubmitting) return;
    setSelectedSide(side);
    setModalOpen(true);
  };

  const handleModalSubmit = async (voterName) => {
    if (!selectedSide) return { success: false };
    const res = await submitVoteWithName(selectedSide, voterName);
    if (res && res.success) {
      setModalOpen(false);
      return res;
    }
    return res;
  };

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen bg-[#000000] text-white py-32 px-4 md:px-12 relative z-30 overflow-hidden flex flex-col justify-center items-center"
      id="vote"
    >
      {/* ── Section Background: Abstract Dual-Accent Cinematic Glow ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-[650px] h-[650px] bg-[#00D6FF]/10 rounded-full blur-[180px] -translate-x-1/3" />
        <div className="absolute bottom-1/4 right-0 w-[650px] h-[650px] bg-[#FF2A5F]/10 rounded-full blur-[180px] translate-x-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/60 to-black" />
      </div>

      {/* ── DESKTOP VIEWPORT MARGINS: Holographic Live Voter Stacks ── */}
      {/* Left Margin Stack: Doom Voters */}
      <div className="hidden xl:flex absolute left-8 top-28 bottom-28 w-72 flex-col z-20 pointer-events-none justify-start items-start">
        <HolographicDoomHeader />
        
        {/* Scrollable / Animated Voter Stack container */}
        <div className="w-full flex flex-col gap-3 overflow-hidden pr-2">
          <AnimatePresence mode="popLayout">
            {doomNames.slice(0, 10).map((item) => (
              <VoterPill key={item.id} name={item.name} side="doom" />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Margin Stack: Avengers Voters */}
      <div className="hidden xl:flex absolute right-8 top-28 bottom-28 w-72 flex-col z-20 pointer-events-none justify-start items-end">
        <HolographicAvengersHeader />

        {/* Scrollable / Animated Voter Stack container */}
        <div className="w-full flex flex-col gap-3 overflow-hidden items-end pl-2">
          <AnimatePresence mode="popLayout">
            {avengersNames.slice(0, 10).map((item) => (
              <VoterPill key={item.id} name={item.name} side="avengers" />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-4xl w-full mx-auto text-center relative z-10">
        
        {/* Simplified Primary Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={SPRING_MEDIUM}
          className="font-bebas text-[clamp(70px,12vw,180px)] leading-[0.85] tracking-wider text-white mb-16 drop-shadow-2xl text-center"
        >
          WHO WINS?
        </motion.h2>

        {/* Vote Cards Grid with Live Battle Energy Rays repositioned cleanly BELOW cards */}
        <div className="relative mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...SPRING_MEDIUM, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative z-10"
          >
            <VoteCard
              option="doom"
              label="DOOM WINS"
              sublabel="Victor Von Doom"
              bgImage="/doom.png"
              icon={<DoomIcon size={34} />}
              accentColor="#00D6FF"
              glowColor="#00D6FF"
              isSubmitting={isSubmitting}
              onCardClick={handleCardClick}
            />
            <VoteCard
              option="avengers"
              label="AVENGERS WIN"
              sublabel="Earth's Mightiest"
              bgImage="/avengers.png"
              icon={<AvengersIcon size={34} />}
              accentColor="#FF5070"
              glowColor="#FF2A5F"
              isSubmitting={isSubmitting}
              onCardClick={handleCardClick}
            />
          </motion.div>

          {/* Energy Rays positioned cleanly BELOW the cards for 100% unobscured card vision */}
          <LiveBattleEnergyRays doomPercent={doomPercent} />
        </div>

        {/* Live Percentage Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="space-y-4 max-w-2xl mx-auto pt-4"
        >
          <div className="flex items-center justify-between text-xs md:text-sm font-space font-bold">
            <span className="text-[#00D6FF] tracking-wider">
              DOOM WINS: <CountUpNumber value={doomPercent} format={false} />%
            </span>
            <span className="text-[#FF5070] tracking-wider">
              AVENGERS WIN: <CountUpNumber value={avengersPercent} format={false} />%
            </span>
          </div>
        </motion.div>

        {/* ── MOBILE RESPONSIVE FEED (Visible on mobile/tablet under section) ── */}
        <div className="xl:hidden mt-12 pt-8 border-t border-white/10 w-full text-left">
          <span className="text-[11px] font-space font-bold uppercase tracking-[0.2em] text-white/50 block mb-4 text-center">
            RECENT LIVE VOTERS
          </span>
          <div className="flex flex-wrap justify-center gap-2 max-h-36 overflow-y-auto pr-1">
            {doomNames.slice(0, 5).map((item) => (
              <VoterPill key={item.id} name={item.name} side="doom" />
            ))}
            {avengersNames.slice(0, 5).map((item) => (
              <VoterPill key={item.id} name={item.name} side="avengers" />
            ))}
          </div>
        </div>

      </div>

      {/* Voter Name Collection Modal */}
      <VoterNameModal
        isOpen={modalOpen}
        selectedOption={selectedSide}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
