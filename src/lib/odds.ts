const ODDS_API_KEY = process.env.ODDS_API_KEY || ''
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

export interface OddsOutcome {
  name: string
  price: number
}

export interface OddsMarket {
  key: string
  outcomes: OddsOutcome[]
}

export interface OddsBookmaker {
  key: string
  title: string
  markets: OddsMarket[]
}

export interface OddsEvent {
  id: string
  sportKey: string
  sportTitle: string
  commenceTime: string
  homeTeam: string
  awayTeam: string
  bookmakers: OddsBookmaker[]
}

export interface MatchOdds {
  homeWin: number | null
  draw: number | null
  awayWin: number | null
  bookmaker: string | null
}

function normalizeName(name: string): string {
  if (!name) return ''
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export async function fetchOdds(sportKey: string): Promise<OddsEvent[]> {
  try {
    const url = `${ODDS_API_BASE}/sports/${sportKey}/odds/?apiKey=${ODDS_API_KEY}&regions=uk,eu&markets=h2h&oddsFormat=decimal`
    console.log(`[Odds] Fetching: ${url.replace(ODDS_API_KEY, '***')}`)
    const res = await fetch(url, { next: { revalidate: 120 } })
    if (!res.ok) {
      console.warn(`[Odds] API error: ${res.status} ${res.statusText} for sport=${sportKey}`)
      console.log(`[Odds] Response body:`, await res.text().catch(() => 'N/A'))
      if (sportKey !== 'soccer') {
        console.log(`[Odds] Trying fallback sport 'soccer'`)
        return fetchOdds('soccer')
      }
      return []
    }
    const data = (await res.json()) as OddsEvent[]
    console.log(`[Odds] Received ${data.length} events for sport=${sportKey}`)
    if (data.length > 0) {
      console.log(`[Odds] First event:`, JSON.stringify(data[0], null, 2))
    }
    return data
  } catch (err) {
    console.error(`[Odds] Fetch error:`, err)
    return []
  }
}

export function findMatchOdds(
  events: OddsEvent[],
  homeTeam: string | null | undefined,
  awayTeam: string | null | undefined,
): MatchOdds | null {
  const normalizedHome = normalizeName(homeTeam ?? '')
  const normalizedAway = normalizeName(awayTeam ?? '')

  const event = events.find((e) => {
    if (!e.bookmakers?.length) return false
    return (
      normalizeName(e.homeTeam) === normalizedHome &&
      normalizeName(e.awayTeam) === normalizedAway
    )
  })

  if (!event?.bookmakers?.length) return null

  const best: MatchOdds = { homeWin: null, draw: null, awayWin: null, bookmaker: null }

  for (const bookmaker of event.bookmakers) {
    const h2h = bookmaker.markets.find((m) => m.key === 'h2h')
    if (!h2h?.outcomes) continue

    const homeOutcome = h2h.outcomes.find((o) => normalizeName(o.name) === normalizedHome)
    const awayOutcome = h2h.outcomes.find((o) => normalizeName(o.name) === normalizedAway)
    const drawOutcome = h2h.outcomes.find(
      (o) => normalizeName(o.name) === 'draw' || normalizeName(o.name) === 'empate',
    )

    if (homeOutcome && (!best.homeWin || homeOutcome.price > best.homeWin)) {
      best.homeWin = homeOutcome.price
    }
    if (awayOutcome && (!best.awayWin || awayOutcome.price > best.awayWin)) {
      best.awayWin = awayOutcome.price
    }
    if (drawOutcome && (!best.draw || drawOutcome.price > best.draw)) {
      best.draw = drawOutcome.price
    }
    best.bookmaker = bookmaker.title
  }

  if (best.homeWin === null && best.draw === null && best.awayWin === null) return null

  return best
}

export function getSportKeyFromPool(poolSlug: string): string {
  if (poolSlug.includes('copa') || poolSlug.includes('world-cup') || poolSlug.includes('mundial')) {
    return 'soccer_world_cup'
  }
  if (poolSlug.includes('libertadores')) return 'soccer_conmebol_copa_libertadores'
  if (poolSlug.includes('premier') || poolSlug.includes('epl')) return 'soccer_epl'
  if (poolSlug.includes('la-liga') || poolSlug.includes('laliga')) return 'soccer_spain_la_liga'
  if (poolSlug.includes('serie-a') || poolSlug.includes('seriea')) return 'soccer_italy_serie_a'
  if (poolSlug.includes('bundesliga')) return 'soccer_germany_bundesliga'
  if (poolSlug.includes('ligue-1') || poolSlug.includes('ligue1')) return 'soccer_france_ligue_one'
  if (poolSlug.includes('champions') || poolSlug.includes('uefa')) return 'soccer_uefa_champs_league'
  if (poolSlug.includes('copa-america')) return 'soccer_copa_america'
  return 'soccer'
}
