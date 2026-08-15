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
  const buttonTextColor = isDoom ? '#000000' : '#FFFFFF';
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
        {/* Flat Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80"
        />

        {/* Minimalist Flat Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={SPRING_SNAPPY}
          className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-xl bg-[#0A0A0C] border border-white/10 text-center shadow-xl"
        >
          {/* Minimal Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Simple Eyebrow label */}
          <span
            className="inline-block text-[11px] font-space font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-md mb-4"
            style={{
              color: accentColor,
              backgroundColor: `${accentColor}12`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            VOTING FOR: {sideName}
          </span>

          <h3 className="font-bebas text-4xl text-white tracking-wider mb-1">
            ENTER YOUR NAME
          </h3>
          <p className="font-space text-xs text-white/50 mb-6">
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
                className="w-full px-4 py-3 rounded-lg bg-[#121215] border border-white/15 text-white placeholder-white/30 font-space text-sm focus:outline-none focus:border-white/40 transition-colors"
                style={{
                  borderColor: error ? '#FF5070' : undefined,
                }}
              />
              {error && (
                <span className="block text-left text-xs font-space text-[#FF5070] mt-1.5 font-medium">
                  {error}
                </span>
              )}
            </div>

            {/* Solid Fill Flat Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-cursor="hover"
              className="w-full py-3.5 rounded-lg font-space font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99]"
              style={{
                backgroundColor: accentColor,
                color: buttonTextColor,
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
