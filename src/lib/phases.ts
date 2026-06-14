const translations: Record<string, string> = {
  'Group Stage': 'Fase de Grupos',
  'League Stage': 'Fase de Grupos',
  'Regular Season': 'Temporada Regular',
  'Preliminary Round': 'Fase Preliminar',
  'Qualifying Round': 'Eliminatória',
  '1st Qualifying Round': '1ª Eliminatória',
  '2nd Qualifying Round': '2ª Eliminatória',
  '3rd Qualifying Round': '3ª Eliminatória',
  'Play-off': 'Play-off',
  'Play-offs': 'Play-offs',
  'Knockout Round': 'Mata-mata',
  'Knockout Round Play-offs': 'Play-offs do Mata-mata',
  'Round of 16': 'Oitavas de Final',
  '16th Finals': '16 avos de Final',
  '8th Finals': 'Oitavas de Final',
  'Quarter-finals': 'Quartas de Final',
  'Semi-finals': 'Semifinais',
  'Final': 'Final',
  '3rd Place Final': 'Disputa de 3º Lugar',
  '1st Round': '1ª Rodada',
  '2nd Round': '2ª Rodada',
}

export function translatePhase(phase: string | null | undefined): string | null {
  if (!phase) return null
  return translations[phase] ?? phase
}
