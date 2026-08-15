import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING_SNAPPY } from '../config/motionVariants';
import { X, Check } from 'lucide-react';

export function VoterNameModal({ isOpen, selectedOption, onClose, onSubmit, isSubmitting }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isDoom = selectedOption === 'doom';
  const accentColor = isDoom ? '#00D6FF' : '#FF5070';
  const sideName = isDoom ? 'DOOM WINS' : 'AVENGERS WIN';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Please enter your name to confirm your vote.');
      return;
    }

    if (trimmed.length > 20) {
      setError('Name must be 20 characters or fewer.');
      return;
    }

    setError('');
    const res = await onSubmit(trimmed);
    if (res && res.error) {
      setError(res.error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 10 }}
          transition={SPRING_SNAPPY}
          className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl border glass-panel shadow-2xl text-center overflow-hidden"
          style={{
            borderColor: `${accentColor}44`,
            boxShadow: `0 0 50px ${accentColor}22`,
          }}
        >
          {/* Ambient Glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{ backgroundColor: accentColor }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Eyebrow badge */}
          <span
            className="inline-block text-[11px] font-space font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border mb-4"
            style={{
              color: accentColor,
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}15`,
            }}
          >
            VOTING FOR: {sideName}
          </span>

          <h3 className="font-bebas text-4xl md:text-5xl text-white tracking-wider mb-2">
            ENTER YOUR NAME
          </h3>
          <p className="font-space text-xs md:text-sm text-white/55 mb-6">
            Record your stance in the live multiversal battle log.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Your name"
                autoFocus
                className="w-full px-5 py-3.5 rounded-xl bg-black/60 border text-white placeholder-white/30 font-space text-sm focus:outline-none transition-all"
                style={{
                  borderColor: error ? '#FF2A5F' : 'rgba(255,255,255,0.15)',
                  boxShadow: error ? '0 0 10px rgba(255,42,95,0.3)' : 'none',
                }}
              />
              {error && (
                <span className="block text-left text-xs font-space text-[#FF5070] mt-1.5 font-medium">
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              data-cursor="hover"
              className="w-full py-4 rounded-xl font-space font-bold text-sm tracking-wider uppercase text-black transition-all flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98]"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${accentColor}66`,
              }}
            >
              {isSubmitting ? (
                'RECORDING VOTE...'
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  CONFIRM VOTE
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
