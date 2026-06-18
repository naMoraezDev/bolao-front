"use client";

import { useMemo } from "react";
import type { Match, Guess } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { translatePhase } from "@/lib/phases";

const HOUR_MS = 60 * 60 * 1000;

interface MatchCardProps {
  match: Match;
  guess?: Guess;
  onGuessChange?: (
    matchId: string,
    homeGoals: number,
    awayGoals: number,
  ) => void;
  saving?: boolean;
  blocked?: boolean;
}

export default function MatchCard({
  match,
  guess,
  onGuessChange,
  saving,
  blocked,
}: MatchCardProps) {
  const matchDate = new Date(match.date);
  const isInvalidDate =
    !match.date ||
    match.date.includes("Invalid") ||
    match.date.includes("NaN") ||
    isNaN(matchDate.getTime()) ||
    matchDate.getFullYear() < 2020;

  const isTbd = !match.homeTeam?.name?.trim() || !match.awayTeam?.name?.trim();

  const {
    isFinished,
    isLive,
    isLocked,
    isPreMatchLocked,
    isUnscheduled,
    isOpen,
    showScore,
    hasUnprocessedResult,
  } = useMemo(() => {
    if (isInvalidDate) {
      return {
        isFinished: false,
        isLive: false,
        isLocked: true,
        isPreMatchLocked: false,
        isUnscheduled: true,
        showScore: false,
        hasUnprocessedResult: false,
      };
    }
    if (isTbd) {
      return {
        isFinished: false,
        isLive: false,
        isLocked: true,
        isPreMatchLocked: false,
        isUnscheduled: false,
        showScore: false,
        hasUnprocessedResult: false,
      };
    }
    const now = Date.now();
    const startsIn = matchDate.getTime() - now;
    const isPastCutoff = startsIn <= HOUR_MS;

    const hasGameScore = !!match.gameScore;
    const unprocessedResult =
      !match.finished && hasGameScore && startsIn <= -(4 * HOUR_MS);

    return {
      isFinished: match.finished,
      isLive: !match.finished && !unprocessedResult && (match.locked || startsIn <= 0),
      isLocked: match.locked || match.finished || isPastCutoff || (hasGameScore && startsIn <= 0),
      isPreMatchLocked:
        !match.locked && !match.finished && startsIn > 0 && startsIn <= HOUR_MS,
      isUnscheduled: false,
      isOpen: !match.finished && !match.locked && !isPastCutoff,
      showScore: match.finished || unprocessedResult,
      hasUnprocessedResult: unprocessedResult,
    };
  }, [match.finished, match.locked, match.gameScore, matchDate, isInvalidDate, isTbd]);

  return (
    <div
      className={`bg-white rounded-lg border p-4 transition-all hover:shadow-normal ${
        isUnscheduled || isTbd || hasUnprocessedResult
          ? "border-dashed border-gray-200"
          : isLive
            ? "border-line border-l-4 border-l-red-widget"
            : isPreMatchLocked
              ? "border-line border-l-4 border-l-yellow-400"
              : isFinished
                ? "border-green/30"
                : "border-line"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-300 font-medium uppercase tracking-wide">
          {translatePhase(match.phase) &&
            `${translatePhase(match.phase)}${match.round ? ` - ${match.round}` : ""}`}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-widget bg-red-50 px-2 py-0.5 rounded-sm uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-widget animate-pulse" />
              AO VIVO
            </span>
          )}
          {isTbd && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm uppercase">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <circle
                  cx="6"
                  cy="6"
                  r="4.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M6 3.5V6.5M6 7.5V8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              A definir
            </span>
          )}
          {isUnscheduled && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm uppercase">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <rect
                  x="1.5"
                  y="2.5"
                  width="9"
                  height="8"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M4 0.5V3.5M8 0.5V3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M1.5 5.5H10.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Não agendado
            </span>
          )}
          {isPreMatchLocked && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-sm uppercase">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <rect
                  x="2.5"
                  y="5.5"
                  width="7"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M4 5.5V3.5C4 2.4 4.8 1.5 6 1.5C7.2 1.5 8 2.4 8 3.5V5.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              FECHADO
            </span>
          )}
          {isOpen && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green bg-green-50 px-2 py-0.5 rounded-sm uppercase">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 9.5L3.5 8L4.5 9L3 10.5L2 9.5ZM6.5 5.5L5 7L9 11L10.5 9.5L6.5 5.5ZM4.5 4L2 1.5L1.5 2L3 5L4.5 4ZM7.5 3L6 1.5L10.5 1L11 5.5L9.5 4L8.5 5L7 3.5L8.5 2L7.5 3Z"
                  fill="currentColor"
                />
              </svg>
              Palpitar
            </span>
          )}
          {isFinished && (
            <span className="text-[10px] font-semibold text-green bg-green-cover-bg px-2 py-0.5 rounded-sm uppercase">
              Finalizado
            </span>
          )}
          {hasUnprocessedResult && (
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-sm uppercase">
              Não oficial
            </span>
          )}
          <span className="text-xs text-gray-300">
            {isUnscheduled
              ? "Data a definir"
              : hasUnprocessedResult
                ? format(matchDate, "dd/MM 'às' HH:mm", { locale: ptBR })
              : isLive
                ? "Agora"
                : isPreMatchLocked
                  ? format(matchDate, "HH:mm", { locale: ptBR })
                  : format(matchDate, "dd/MM 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 justify-self-end">
          <span
            className={`text-[11px] sm:text-sm font-semibold truncate max-w-[90px] sm:max-w-[120px] ${isTbd ? "text-gray-300 italic" : "text-gray-500"}`}
          >
            {isTbd ? "A definir" : match.homeTeam.name}
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {isTbd ? (
              <span className="text-xs sm:text-sm font-bold text-gray-300">
                ?
              </span>
            ) : match.homeTeam.logo ? (
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            ) : (
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-300">
                H
              </span>
            )}
          </div>
        </div>

        {showScore ? (
          <div className={`flex items-center gap-1 sm:gap-2 ${hasUnprocessedResult ? "opacity-50" : ""}`}>
            <span className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-base sm:text-lg font-bold ${hasUnprocessedResult ? "bg-gray-100 text-gray-400" : "bg-green-cover-bg text-green"}`}>
              {match.gameScore?.homeGoals ?? 0}
            </span>
            <span className="text-gray-300 font-bold text-sm sm:text-base">
              ×
            </span>
            <span className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-base sm:text-lg font-bold ${hasUnprocessedResult ? "bg-gray-100 text-gray-400" : "bg-green-cover-bg text-green"}`}>
              {match.gameScore?.awayGoals ?? 0}
            </span>
          </div>
        ) : (
          <div className="relative flex items-center gap-2">
            {!blocked && isPreMatchLocked && !guess && (
              <div className="absolute inset-0 flex items-center justify-center z-10 rounded-lg bg-white/60 backdrop-blur-[1px]">
                <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200/50">
                  Prazo encerrado
                </span>
              </div>
            )}
            {blocked && (
              <div className="absolute inset-0 flex items-center justify-center z-10 rounded-lg bg-white/60 backdrop-blur-[1px]">
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200/50 inline-flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <rect
                      x="2.5"
                      y="5.5"
                      width="7"
                      height="5"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M4 5.5V3.5C4 2.4 4.8 1.5 6 1.5C7.2 1.5 8 2.4 8 3.5V5.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  Faça login
                </span>
              </div>
            )}
            <input
              type="number"
              min={0}
              max={99}
              value={guess?.homeGoals ?? ""}
              onChange={(e) =>
                onGuessChange?.(
                  match.id,
                  Number(e.target.value),
                  guess?.awayGoals ?? 0,
                )
              }
              disabled={isLocked || blocked}
              placeholder="?"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-line text-center text-sm sm:text-base font-bold text-gray-700 outline-none disabled:opacity-40 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-gray-300 font-bold text-sm sm:text-base">
              ×
            </span>
            <input
              type="number"
              min={0}
              max={99}
              value={guess?.awayGoals ?? ""}
              onChange={(e) =>
                onGuessChange?.(
                  match.id,
                  guess?.homeGoals ?? 0,
                  Number(e.target.value),
                )
              }
              disabled={isLocked || blocked}
              placeholder="?"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-line text-center text-sm sm:text-base font-bold text-gray-700 outline-none disabled:opacity-40 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {saving && (
              <span className="w-2 h-2 rounded-full bg-green animate-pulse flex-shrink-0" />
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 justify-self-start">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {isTbd ? (
              <span className="text-xs sm:text-sm font-bold text-gray-300">
                ?
              </span>
            ) : match.awayTeam.logo ? (
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            ) : (
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-300">
                A
              </span>
            )}
          </div>
          <span
            className={`text-[11px] sm:text-sm font-semibold truncate max-w-[90px] sm:max-w-[120px] ${isTbd ? "text-gray-300 italic" : "text-gray-500"}`}
          >
            {isTbd ? "A definir" : match.awayTeam.name}
          </span>
        </div>
      </div>

      {isFinished && guess?.score !== undefined && (
        <div className="flex justify-center mt-1.5">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              guess.score === 10
                ? "bg-green-cover-bg"
                : guess.score > 0
                  ? "bg-amber-50"
                  : "bg-red-50"
            }`}
          >
            <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wide">
              Seu palpite
            </span>
            <span
              className={`text-sm font-bold ${
                guess.score === 10
                  ? "text-green"
                  : guess.score > 0
                    ? "text-amber-700"
                    : "text-red-widget"
              }`}
            >
              {guess.homeGoals} x {guess.awayGoals}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                guess.score === 10
                  ? "bg-green text-white"
                  : guess.score > 0
                    ? "bg-amber-200 text-amber-800"
                    : "bg-red-200 text-red-800"
              }`}
            >
              {guess.score === 10
                ? "Exato +10"
                : guess.score > 0
                  ? `+${guess.score}`
                  : "0 pts"}
            </span>
          </div>
        </div>
      )}

      {match.odds?.home != null &&
        (() => {
          const odds = [
            match.odds.home,
            match.odds.draw,
            match.odds.away,
          ].filter((v): v is number => v !== null);
          const maxOdd = Math.max(...odds);
          const minOdd = Math.min(...odds);

          const TriangleUp = ({ className }: { className: string }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4L4 20h16z" />
            </svg>
          );
          const TriangleDown = ({ className }: { className: string }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h16L12 20z" />
            </svg>
          );

          const getIndicator = (value: number | null) => {
            if (value == null) return null;
            if (value === maxOdd)
              return <TriangleUp className="w-2 h-2 text-green-500 shrink-0" />;
            if (value === minOdd)
              return <TriangleDown className="w-2 h-2 text-red-500 shrink-0" />;
            return <TriangleUp className="w-2 h-2 text-gray-300 shrink-0" />;
          };

          return (
            <div className="flex items-center justify-between mt-2 gap-2">
              {match.stadium && (
                <span className="text-xs text-gray-300">{match.stadium}</span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                  Superbet
                </span>
                <div className="flex max-w-[155px] bg-white rounded-md border border-line overflow-hidden">
                  <div className="flex flex-1 items-center justify-center px-1.5 py-1.5 border-r border-line">
                    <div className="flex items-center gap-0.5">
                      {getIndicator(match.odds.home)}
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-700">
                        {match.odds.home.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center justify-center px-1.5 py-1.5 border-r border-line bg-gray-50/30">
                    <div className="flex items-center gap-0.5">
                      {getIndicator(match.odds.draw)}
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-700">
                        {match.odds.draw?.toFixed(2) ?? "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center justify-center px-1.5 py-1.5">
                    <div className="flex items-center gap-0.5">
                      {getIndicator(match.odds.away)}
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-700">
                        {match.odds.away?.toFixed(2) ?? "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {!match.odds?.home && match.stadium && (
        <div className="mt-3">
          <span className="text-xs text-gray-300">{match.stadium}</span>
        </div>
      )}
    </div>
  );
}
