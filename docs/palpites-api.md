# Integração de Palpites — bolao-api

## Visão Geral

O fluxo de palpites usa dois endpoints autenticados:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/v1/user/pools/:poolSlug/leagues/:leagueSlug/guesses` | Listar palpites do usuário logado |
| `POST` | `/v1/pools/:poolSlug/leagues/:leagueSlug/guesses` | Criar ou atualizar um palpite |

## Autenticação

Todos os requests de palpites exigem:

- **`x-api-key`** — chave pública da API (via header)
- **`Authorization: Bearer <firebase-id-token>`** — token do Firebase Authentication (via header)

O token é obtido do Firebase Auth do lado do cliente:

```ts
const token = await firebaseUser.getIdToken()
// enviar como: Authorization: Bearer ${token}
```

## Resposta Padrão

A API sempre retorna um wrapper `ApiResponse`:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-06-12T23:15:09.453Z",
    "requestId": "8efcb890-...",
    "cached": false
  }
}
```

Erros:

```json
{
  "success": false,
  "error": {
    "code": "Unauthorized",
    "message": "Token não fornecido ou formato inválido"
  },
  "meta": { ... }
}
```

---

## 1. Listar Palpites do Usuário

Busca todos os palpites que o usuário logado já registrou em uma liga.

```
GET /v1/user/pools/:poolSlug/leagues/:leagueSlug/guesses
```

### Headers

```
x-api-key: <api-key>
Authorization: Bearer <firebase-id-token>
```

### Exemplo de resposta

```json
{
  "success": true,
  "data": [
    {
      "matchId": "y1ow9ht5baxn64i01hq9moes",
      "homeGoals": 2,
      "awayGoals": 0,
      "score": 5
    },
    {
      "matchId": "abc123def456ghi789jklmno",
      "homeGoals": 1,
      "awayGoals": 1,
      "score": null
    }
  ],
  "meta": { "cached": false, "timestamp": "..." }
}
```

### Tipos (TypeScript)

```ts
interface Guess {
  matchId: string
  homeGoals: number
  awayGoals: number
  score?: number  // null/pending se jogo não finalizou
}
```

### Uso no frontend

```ts
const guesses = await api.guesses.listByUser(poolSlug, leagueSlug)
// guesses: Guess[]
```

---

## 2. Criar / Atualizar Palpite

Cria um palpite novo ou atualiza um existente (identificado por `userId + leagueId + poolId + matchId`).

```
POST /v1/pools/:poolSlug/leagues/:leagueSlug/guesses
```

### Headers

```
Content-Type: application/json
x-api-key: <api-key>
Authorization: Bearer <firebase-id-token>
```

### Body

```json
{
  "matchId": "y1ow9ht5baxn64i01hq9moes",
  "homeGoals": 2,
  "awayGoals": 0
}
```

### Validações

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `matchId` | `string` | sim |
| `homeGoals` | `number` | sim |
| `awayGoals` | `number` | sim |

### Regras de negócio (server-side)

1. **Partida bloqueada** — se a partida foi manualmente travada, retorna `400 Bad Request`.
2. **Deadline** — o palpite só é aceito até **1 hora antes** do início da partida (horário do `isoDate` da Opta). Após esse horário, retorna `400 Bad Request`.
3. **Upsert** — se já existe um palpite do usuário para aquela partida na mesma liga, ele é atualizado; caso contrário, é criado.
4. **Cache** — ao salvar, o cache de palpites e estatísticas do usuário é invalidado.

### Exemplo de resposta (201 Created)

```json
{
  "success": true,
  "data": {
    "matchId": "y1ow9ht5baxn64i01hq9moes",
    "homeGoals": 2,
    "awayGoals": 0
  }
}
```

### Uso no frontend

```ts
await api.guesses.create(poolSlug, leagueSlug, {
  matchId: 'y1ow9ht5baxn64i01hq9moes',
  homeGoals: 2,
  awayGoals: 0,
})
```

---

## 3. Exemplo de Fluxo Completo (React)

```tsx
'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/auth'
import type { Match, Guess } from '@/lib/types'

function Palpites({ matches, poolSlug, leagueSlug }) {
  const { user, loading: authLoading } = useAuth()
  const [guesses, setGuesses] = useState<Record<string, Guess>>({})

  // Carregar palpites existentes após auth ficar pronto
  useEffect(() => {
    if (authLoading || !user) return
    api.guesses.listByUser(poolSlug, leagueSlug).then((data) => {
      const map: Record<string, Guess> = {}
      data.forEach((g) => { map[g.matchId] = g })
      setGuesses(map)
    }).catch(() => {})
  }, [poolSlug, leagueSlug, user, authLoading])

  // Salvar com debounce de 600ms
  const handleChange = useCallback(
    (matchId: string, homeGoals: number, awayGoals: number) => {
      setGuesses((prev) => ({ ...prev, [matchId]: { matchId, homeGoals, awayGoals } }))
      // ... aguardar 600ms e chamar api.guesses.create()
    },
    [poolSlug, leagueSlug],
  )

  // ...
}
```

## 4. Dados das Partidas

As partidas são obtidas separadamente do endpoint de palpites:

```
GET /v1/pools/:poolSlug/matches
```

```json
{
  "success": true,
  "data": {
    "phases": ["Group Stage"],
    "rounds": ["1", "2", "3"],
    "currentRound": "1",
    "currentPhase": "Group Stage",
    "matches": [
      {
        "id": "y1ow9ht5baxn64i01hq9moes",
        "round": "1",
        "phase": "Group Stage",
        "date": "2026-06-12T16:00:00-03:00",
        "stadium": "Toronto Stadium",
        "finished": true,
        "locked": false,
        "homeTeam": {
          "id": "eg7vduna0h3vis1wd47s41za7",
          "name": "Canadá",
          "initials": "CAN",
          "logo": "https://..."
        },
        "awayTeam": {
          "id": "o5iztj2zl6b0v6ed9q5m7p1k",
          "name": "Bósnia-Herzegovina",
          "initials": "BIH",
          "logo": "https://..."
        },
        "gameScore": {
          "homeGoals": 1,
          "awayGoals": 1
        }
      }
    ]
  }
}
```

### Tipo Match

```ts
interface Match {
  id: string
  round?: string
  phase?: string
  date: string
  stadium?: string
  finished: boolean
  locked: boolean
  homeTeam: Team
  awayTeam: Team
  gameScore?: GameScore
}

interface Team {
  id: string
  name: string
  shortName?: string
  logo?: string
}

interface GameScore {
  homeGoals: number
  awayGoals: number
}
```

## 5. Considerações de Implementação

- **Auth loading** — aguardar o Firebase restaurar o token (`onAuthStateChanged`) antes de chamar qualquer endpoint de palpites.
- **Cache** — o endpoint `GET guesses` tem cache de 30 minutos no Redis. O cache é invalidado automaticamente ao salvar um palpite.
- **Deadline** — respeitar a regra de 1h antes do jogo. Sugerir desabilitar os inputs visualmente quando o prazo expirar.
- **Otimismo** — atualizar a UI imediatamente ao digitar e salvar em background com debounce (~600ms).
- **Tratamento de erro** — falhas silenciosas no salvamento são aceitáveis; o usuário pode digitar novamente para repetir a tentativa.
