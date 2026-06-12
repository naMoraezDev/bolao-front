import Link from "next/link";
import { api } from "@/lib/api";
import Tabs from "@/components/Tabs";
import ParticipantsList from "@/components/ParticipantsList";

export const dynamic = "force-dynamic";

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ poolSlug: string; leagueSlug: string }>;
}) {
  const { poolSlug, leagueSlug } = await params;

  let league;
  try {
    league = await api.leagues.getByPoolAndSlug(poolSlug, leagueSlug);
  } catch {
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-red"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 8V12M12 16H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-500 mb-2">
          Liga não encontrada
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          Esta liga não existe ou você não tem acesso.
        </p>
        <Link
          href={`/pools/${poolSlug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
        >
          Voltar para o bolão
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      label: "Palpites",
      value: "palpites",
      href: `/pools/${poolSlug}/leagues/${leagueSlug}/palpites`,
    },
    {
      label: "Classificação",
      value: "classificacao",
      href: `/pools/${poolSlug}/leagues/${leagueSlug}/classificacao`,
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6">
        <Link
          href="/"
          className="hover:text-green transition-colors no-underline"
        >
          Home
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M4.5 9L7.5 6L4.5 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Link
          href="/pools"
          className="hover:text-green transition-colors no-underline"
        >
          Bolões
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M4.5 9L7.5 6L4.5 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-gray-500 font-medium">{poolSlug}</span>
      </nav>

      {/* League Header */}
      <div className="bg-white rounded-lg border border-line p-6 md:p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-cover-bg flex items-center justify-center flex-shrink-0">
            <svg
              width="28"
              height="28"
              viewBox="0 0 20 20"
              fill="none"
              className="text-green"
            >
              <path
                d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-black-lance mb-1">
              {league.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} />
      </div>

      {/* Participants Preview */}
      <ParticipantsList poolSlug={poolSlug} leagueSlug={leagueSlug} />
    </div>
  );
}