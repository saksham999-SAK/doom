import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useDoomsdayVoting } from '../hooks/useDoomsdayVoting';
import { CountUpNumber } from './CountUpNumber';
import { VoterNameModal } from './VoterNameModal';
import { Check, Users } from 'lucide-react';
import {
  SPRING_MEDIUM,
  SPRING_LIGHT,
  SPRING_SNAPPY,
} from '../config/motionVariants';

/* ──────────────────────────────────────────────
   SVG Icons
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
  isSelected,
  hasVoted,
  isSubmitting,
  onCardClick,
}) {
  const isDisabled = hasVoted || isSubmitting;

  return (
    <div className="relative group w-full">
      {/* Ambient radial glow behind the card */}
      <div
        className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-700 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        }`}
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
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.015 } : {}}
        whileTap={!isDisabled ? { scale: 0.975 } : {}}
        transition={SPRING_SNAPPY}
        className="relative z-10 w-full h-[380px] md:h-[440px] rounded-3xl overflow-hidden border text-center flex flex-col items-center justify-end p-8 md:p-10 focus:outline-none transition-all duration-500 shadow-2xl"
        style={{
          borderColor: isSelected ? accentColor : 'rgba(255,255,255,0.12)',
          boxShadow: isSelected
            ? `0 0 0 2px ${accentColor}, 0 20px 60px ${glowColor}44`
            : '0 10px 40px rgba(0,0,0,0.8)',
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

          <AnimatePresence>
            {isSelected ? (
              <motion.span
                key="chosen"
                initial={{ opacity: 0, scale: 0.6, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={SPRING_SNAPPY}
                className="inline-flex items-center gap-1.5 text-xs font-space font-bold px-4 py-1.5 rounded-full border backdrop-blur-md"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}60`,
                  backgroundColor: 'rgba(0,0,0,0.75)',
                }}
              >
                <Check className="w-3.5 h-3.5" />
                YOUR CHOICE
              </motion.span>
            ) : !hasVoted ? (
              <span className="text-xs font-space tracking-widest text-white/70 uppercase border border-white/20 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
                CLICK TO VOTE
              </span>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Live Voter Name Stack Pill Component
────────────────────────────────────────────── */
function VoterPill({ name, side, isNew = false }) {
  const isDoom = side === 'doom';
  const color = isDoom ? '#00D6FF' : '#FF5070';
  const border = isDoom ? 'rgba(0, 214, 255, 0.25)' : 'rgba(255, 80, 112, 0.25)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isDoom ? -35 : 35, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={SPRING_LIGHT}
      className="relative group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-space font-semibold backdrop-blur-md shadow-lg shrink-0 whitespace-nowrap"
      style={{
        backgroundColor: 'rgba(10, 15, 24, 0.82)',
        borderColor: border,
        color: 'rgba(255,255,255,0.92)',
      }}
    >
      {/* Subtle entrance mapping line/trail toward corresponding card */}
      <motion.div
        initial={{ opacity: 0.3, scaleX: 1 }}
        animate={{ opacity: 0, scaleX: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className={`absolute top-1/2 -translate-y-1/2 h-[1px] w-20 pointer-events-none ${
          isDoom ? 'left-full origin-left bg-gradient-to-r from-[#00D6FF] to-transparent' : 'right-full origin-right bg-gradient-to-l from-[#FF5070] to-transparent'
        }`}
      />

      {/* Gentle pulsing activity dot indicator */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: color }}
        />
        <span
          className="relative inline-flex rounded-full h-1.5 w-1.5"
          style={{ backgroundColor: color }}
        />
      </span>

      <span>{name}</span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Upgraded Vote Progress Bar Component
────────────────────────────────────────────── */
function PremiumVoteProgressBar({ doomPercent, avengersPercent, totalVotes }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 800);
    return () => clearTimeout(timer);
  }, [doomPercent, avengersPercent, totalVotes]);

  return (
    <div className="relative w-full py-2">
      {/* Outer Glow matching segment colors */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          boxShadow: '0 0 25px rgba(0, 214, 255, 0.28), 0 0 25px rgba(255, 42, 95, 0.28)',
        }}
      />

      {/* Depth Groove Track */}
      <div className="w-full h-4 bg-[#0A0D14] rounded-full border border-white/15 relative overflow-hidden flex shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]">
        
        {/* Doom Segment (Left) — Sharp boundary */}
        <motion.div
          className="h-full relative overflow-hidden rounded-l-full"
          style={{ background: 'linear-gradient(90deg, #1C4FD6 0%, #00D6FF 100%)' }}
          initial={{ width: '50%' }}
          animate={{ width: `${doomPercent}%` }}
          transition={SPRING_LIGHT}
        >
          <div className="animate-shimmer absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        </motion.div>

        {/* Avengers Segment (Right) — Sharp boundary */}
        <motion.div
          className="h-full relative overflow-hidden rounded-r-full"
          style={{ background: 'linear-gradient(90deg, #FF2A5F 0%, #FFB347 100%)' }}
          initial={{ width: '50%' }}
          animate={{ width: `${avengersPercent}%` }}
          transition={SPRING_LIGHT}
        >
          <div className="animate-shimmer absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" style={{ animationDelay: '1.5s' }} />
        </motion.div>

        {/* Split-Point Marker Line & Top Rounded Cap */}
        <motion.div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${doomPercent}%` }}
          animate={{ left: `${doomPercent}%` }}
          transition={SPRING_LIGHT}
        >
          <div
            className={`w-[2px] h-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-all duration-300 ${
              pulse ? 'scale-x-150 bg-white' : ''
            }`}
          />
          <div
            className={`w-2.5 h-2.5 rounded-full bg-white absolute -top-1 -left-[4px] shadow-[0_0_10px_rgba(255,255,255,1)] transition-transform duration-300 ${
              pulse ? 'scale-150' : 'scale-100'
            }`}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Voting Section
────────────────────────────────────────────── */
export function DoomsdayVotingSection() {
  const {
    totalVotes,
    doomPercent,
    avengersPercent,
    doomNames,
    avengersNames,
    hasVoted,
    userVote,
    isSubmitting,
    submitVoteWithName,
  } = useDoomsdayVoting();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);

  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-5%' });

  const handleCardClick = (side) => {
    if (hasVoted || isSubmitting) return;
    setSelectedSide(side);
    setModalOpen(true);
  };

  const handleModalSubmit = async (voterName) => {
    if (!selectedSide) return { success: false };
    const res = await submitVoteWithName(selectedSide, voterName);
    if (res && res.alreadyVoted) {
      alert("You have already voted within the 24-hour window.");
      setModalOpen(false);
      return res;
    }
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

      {/* ── DESKTOP VIEWPORT MARGINS: Live Voter Name Stacks ── */}
      {/* Left Margin Stack: Doom Voters */}
      <div className="hidden xl:flex absolute left-8 top-32 bottom-32 w-64 flex-col gap-2.5 z-20 pointer-events-none overflow-hidden justify-start items-start">
        <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-[#00D6FF]/70 mb-2 flex items-center gap-1.5">
          <Users className="w-3 h-3" /> DOOM VOTERS
        </span>
        <AnimatePresence mode="popLayout">
          {doomNames.slice(0, 12).map((item) => (
            <VoterPill key={item.id} name={item.name} side="doom" />
          ))}
        </AnimatePresence>
      </div>

      {/* Right Margin Stack: Avengers Voters */}
      <div className="hidden xl:flex absolute right-8 top-32 bottom-32 w-64 flex-col gap-2.5 z-20 pointer-events-none overflow-hidden justify-start items-end">
        <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-[#FF5070]/70 mb-2 flex items-center gap-1.5">
          <Users className="w-3 h-3" /> AVENGERS VOTERS
        </span>
        <AnimatePresence mode="popLayout">
          {avengersNames.slice(0, 12).map((item) => (
            <VoterPill key={item.id} name={item.name} side="avengers" />
          ))}
        </AnimatePresence>
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

        {/* Vote Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...SPRING_MEDIUM, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-14"
        >
          <VoteCard
            option="doom"
            label="DOOM WINS"
            sublabel="Victor Von Doom"
            bgImage="/doom.png"
            icon={<DoomIcon size={34} />}
            accentColor="#00D6FF"
            glowColor="#00D6FF"
            isSelected={userVote === 'doom'}
            hasVoted={hasVoted}
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
            isSelected={userVote === 'avengers'}
            hasVoted={hasVoted}
            isSubmitting={isSubmitting}
            onCardClick={handleCardClick}
          />
        </motion.div>

        {/* Live Percentage Results & Total Votes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="space-y-4 max-w-2xl mx-auto pt-6 border-t border-white/10"
        >
          <div className="flex items-center justify-between text-xs md:text-sm font-space font-bold">
            <span className="text-[#00D6FF] tracking-wider">
              DOOM WINS: <CountUpNumber value={doomPercent} format={false} />%
            </span>
            <span className="text-[#FF5070] tracking-wider">
              AVENGERS WIN: <CountUpNumber value={avengersPercent} format={false} />%
            </span>
          </div>

          {/* Upgraded Premium Depth Vote Progress Bar */}
          <PremiumVoteProgressBar
            doomPercent={doomPercent}
            avengersPercent={avengersPercent}
            totalVotes={totalVotes}
          />

          {/* Live Total Votes */}
          <div className="flex items-center justify-center gap-3 text-xs font-space tracking-widest uppercase text-white/50 pt-2 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D6FF] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D6FF]" />
            </span>
            <span>LIVE TOTAL VOTES CAST:</span>
            <CountUpNumber value={totalVotes} className="text-white font-bold" />
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
