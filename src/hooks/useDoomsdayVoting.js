import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'avengers_doomsday_user_vote';

// Fallback initial counts & names if Supabase is offline
const INITIAL_FALLBACK_COUNTS = {
  doom: 4820,
  avengers: 6150,
};

const INITIAL_FALLBACK_NAMES = {
  doom: [
    { id: 'f1', name: 'Victor_99', option: 'doom' },
    { id: 'f2', name: 'LatverianGuard', option: 'doom' },
    { id: 'f3', name: 'IronMonarch', option: 'doom' },
    { id: 'f4', name: 'SorcererSupreme', option: 'doom' },
    { id: 'f5', name: 'DoomProphet', option: 'doom' },
  ],
  avengers: [
    { id: 'f6', name: 'Odinson', option: 'avengers' },
    { id: 'f7', name: 'StarkTech', option: 'avengers' },
    { id: 'f8', name: 'Cap77', option: 'avengers' },
    { id: 'f9', name: 'ThunderStriker', option: 'avengers' },
    { id: 'f10', name: 'AsgardianHero', option: 'avengers' },
  ],
};

export function useDoomsdayVoting() {
  const [counts, setCounts] = useState(INITIAL_FALLBACK_COUNTS);
  const [doomNames, setDoomNames] = useState(INITIAL_FALLBACK_NAMES.doom);
  const [avengersNames, setAvengersNames] = useState(INITIAL_FALLBACK_NAMES.avengers);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const savedVote = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedVote) {
        setHasVoted(true);
        setUserVote(savedVote);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  }, []);

  // Fetch current aggregate counts and recent voter names from Supabase
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch aggregate counts
      const { data: countData, error: selectError } = await supabase
        .from('vote_counters')
        .select('option, count');

      if (selectError) {
        console.error('Error fetching vote counts:', selectError);
      } else if (countData && countData.length > 0) {
        const newCounts = { doom: 0, avengers: 0 };
        countData.forEach((row) => {
          if (row.option === 'doom' || row.option === 'avengers') {
            newCounts[row.option] = Number(row.count);
          }
        });
        setCounts(newCounts);
      }

      // 2. Fetch recent voter names (last 30 ordered by created_at desc)
      const { data: nameData, error: nameError } = await supabase
        .from('vote_names')
        .select('id, name, option, created_at')
        .order('created_at', { ascending: false })
        .limit(30);

      if (nameError) {
        console.warn('Error fetching vote names (run supabase_setup_v2.sql):', nameError);
      } else if (nameData && nameData.length > 0) {
        const doomStack = [];
        const avengersStack = [];

        nameData.forEach((item) => {
          if (item.option === 'doom' && doomStack.length < 15) {
            doomStack.push(item);
          } else if (item.option === 'avengers' && avengersStack.length < 15) {
            avengersStack.push(item);
          }
        });

        if (doomStack.length > 0) setDoomNames(doomStack);
        if (avengersStack.length > 0) setAvengersNames(avengersStack);
      }
    } catch (err) {
      console.error('Failed to fetch voting data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Supabase Realtime subscriptions: listen to vote_counters UPDATE & vote_names INSERT
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Channel for Realtime
    const channel = supabase
      .channel('public:voting_realtime')
      // Listen to aggregate counter updates
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'vote_counters' },
        (payload) => {
          const { option, count } = payload.new;
          if (option === 'doom' || option === 'avengers') {
            setCounts((prev) => ({
              ...prev,
              [option]: Number(count),
            }));
          }
        }
      )
      // Listen to individual name inserts
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vote_names' },
        (payload) => {
          const newVote = payload.new;
          if (newVote.option === 'doom') {
            setDoomNames((prev) => [newVote, ...prev.slice(0, 14)]);
          } else if (newVote.option === 'avengers') {
            setAvengersNames((prev) => [newVote, ...prev.slice(0, 14)]);
          }
        }
      )
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Submit a vote with name ('doom' | 'avengers', voterName)
  const submitVoteWithName = async (option, voterName) => {
    if (hasVoted || isSubmitting) return;
    if (option !== 'doom' && option !== 'avengers') return;

    const trimmedName = voterName.trim();
    if (!trimmedName) return;

    setIsSubmitting(true);
    setError(null);

    // Save to localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, option);
      setHasVoted(true);
      setUserVote(option);
    } catch (e) {
      console.warn('LocalStorage set failed:', e);
    }

    // Optimistic UI updates
    const tempId = `temp-${Date.now()}`;
    const newEntry = { id: tempId, name: trimmedName, option };

    if (option === 'doom') {
      setDoomNames((prev) => [newEntry, ...prev.slice(0, 14)]);
      setCounts((prev) => ({ ...prev, doom: prev.doom + 1 }));
    } else {
      setAvengersNames((prev) => [newEntry, ...prev.slice(0, 14)]);
      setCounts((prev) => ({ ...prev, avengers: prev.avengers + 1 }));
    }

    if (isSupabaseConfigured && supabase) {
      try {
        // Call record_vote_with_name RPC function
        const { data, error: rpcError } = await supabase.rpc('record_vote_with_name', {
          option_name: option,
          voter_name: trimmedName,
        });

        if (rpcError) {
          console.warn('record_vote_with_name RPC error, trying fallback insert:', rpcError);
          // Fallback if RPC function not created yet
          await supabase.from('vote_names').insert({ name: trimmedName, option });
          await supabase.rpc('increment_vote', { option_name: option });
        } else if (data && data.length > 0) {
          const updated = data[0];
          setCounts({
            doom: Number(updated.doom_count || 0),
            avengers: Number(updated.avengers_count || 0),
          });
        }
      } catch (err) {
        console.error('Submit vote failed:', err);
      }
    }

    setIsSubmitting(false);
  };

  const totalVotes = counts.doom + counts.avengers;
  const doomPercent = totalVotes > 0 ? Math.round((counts.doom / totalVotes) * 100) : 50;
  const avengersPercent = totalVotes > 0 ? 100 - doomPercent : 50;

  return {
    counts,
    totalVotes,
    doomPercent,
    avengersPercent,
    doomNames,
    avengersNames,
    hasVoted,
    userVote,
    isLoading,
    isSubmitting,
    isLive,
    error,
    submitVoteWithName,
    refetch: fetchData,
  };
}
