import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, ShieldAlert, Lock, ArrowUpRight } from 'lucide-react';
import { formatBaseUnitsToDecimal } from '../../packages/shared/constants';
import { AppStateBundle, AuthModalView } from '../types/api';

interface CosmicHeroStageProps {
  state: AppStateBundle | null;
  onOpenAuth: (view: AuthModalView) => void;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const DAILY_SUMMARIES = [
  'NEAR Policy Guard Contract v1 active ($500 max per invoice / $2,000 daily cap).',
  'Whitelisted VENDOR-001 (Acme Dev Labs) & VENDOR-002 (ZK Security DAO) onchain.',
  'Verified GitHub PR #42 commit SHA linked to Purchase Order PO-2026-001.',
  'Restricted Function Call Key operational (4 authorized methods, 0 NEAR transfer capability).',
  'Passed 42/42 adversarial security gates across Custody, TEE Attestation & Intents.',
  'Blocked $10,000 prompt injection attack attempting to override treasury limits.',
  'Settled INV-001 ($250.00 USDC) to Base via NEAR Intents 1Click with verified tx proof.',
];

export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatFullLiveDate(date: Date): string {
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  const dayWithOrdinal = getOrdinalSuffix(date.getDate());
  const year = date.getFullYear();
  return `${weekday}, ${month} ${dayWithOrdinal}, ${year}`;
}

export const CosmicHeroStage: React.FC<CosmicHeroStageProps> = ({ state, onOpenAuth }) => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  const weekDays = useMemo(() => {
    const current = new Date(now);
    const jsDay = current.getDay();
    const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
    const monday = new Date(current);
    monday.setDate(current.getDate() + mondayOffset);

    return DAY_LABELS.map((label, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
      return {
        day: label,
        dateNum: String(d.getDate()),
        fullDate: d,
        formattedNote: formatFullLiveDate(d),
        summary: DAILY_SUMMARIES[idx % DAILY_SUMMARIES.length],
        isToday,
      };
    });
  }, [now]);

  const todayIndex = useMemo(() => {
    const idx = weekDays.findIndex((d) => d.isToday);
    return idx >= 0 ? idx : 0;
  }, [weekDays]);

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(todayIndex);

  useEffect(() => {
    setSelectedDayIdx(todayIndex);
  }, [todayIndex]);

  const selectedDay = weekDays[selectedDayIdx] || weekDays[todayIndex];

  const monthYearHeader = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(selectedDay.fullDate);
  }, [selectedDay]);

  const totalUsdc = state
    ? formatBaseUnitsToDecimal(state.balancesBaseUnits.USDC || '0', 6)
    : '124,750.00';
  const remainingDaily = state
    ? formatBaseUnitsToDecimal(state.spendingUsage.remainingAvailableBaseUnits || '0', 6)
    : '1,430.00';

  return (
    <section className="relative w-full pt-10 pb-16 px-4 sm:px-8 select-none">
      {/* Crisp Institutional Header */}
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Autonomous Treasury Firewall on NEAR</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Treasury Security
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed">
          Cryptographically enforce spending caps, verify invoices with private AI, and settle safely across chains.
        </p>

        {/* Quick Actions */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-base font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onOpenAuth('register')}
            className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-base font-medium transition-colors cursor-pointer"
          >
            Register Account
          </button>
        </div>
      </div>

      {/* Clean Institutional Activity & Metrics Card */}
      <div className="max-w-3xl mx-auto rounded-xl border border-neutral-800 bg-[#0E1311] p-6 sm:p-8 shadow-xl">
        {/* Card Header: Vault Balances & Real Live Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
              Active Ledger Period
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {monthYearHeader}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg px-4 py-2">
              <div className="text-xs text-neutral-400 uppercase font-medium">USDC Vault Reserve</div>
              <div className="text-lg font-bold text-white font-mono">${totalUsdc}</div>
            </div>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg px-4 py-2">
              <div className="text-xs text-neutral-400 uppercase font-medium">Daily Available</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">${remainingDaily}</div>
            </div>
          </div>
        </div>

        {/* 7-Day Clean Date Selector Strip */}
        <div className="grid grid-cols-7 gap-2 text-center py-5 border-b border-neutral-800">
          {weekDays.map((d, idx) => {
            const isSelected = idx === selectedDayIdx;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <span className={`text-xs uppercase font-medium ${isSelected ? 'text-neutral-950 font-bold' : 'text-neutral-400'}`}>
                  {d.day}
                </span>
                <span className="text-base font-bold font-mono">
                  {d.dateNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Status & Ledger Feed */}
        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-base font-bold text-white">
                {selectedDay.formattedNote}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>42/42 Security Gates Enforced</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
            {selectedDay.summary}
          </p>

          {/* Interactive Invoice Status Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="flex items-center justify-between p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer text-left group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>INV-001 SETTLED</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">$250.00 USDC &rarr; Base</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="flex items-center justify-between p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer text-left group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>INV-002 RESERVED</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">$320.00 USDC &rarr; Arbitrum</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="flex items-center justify-between p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer text-left group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>ATTACK BLOCKED</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">$10,000 Prompt Injection</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
