import type { ChatRoom } from '@/types'

// Based on Ethos Network's credibility score system (0-2800 range)
// Reference: https://whitepaper.ethos.network/ethos-mechanisms/credibility-score
// - 0-799: Untrusted
// - ~1200: Neutral (baseline for new users)
// - 1600+: Reputable
// - 2000+: Exemplary/Distinguished

export const CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'untrusted',
    name: 'Untrusted',
    minScore: 0,
    maxScore: 799,
    color: 'var(--color-tier-newcomers)',
    emoji: '⚠️',
    description: 'New or flagged accounts. Build your reputation to unlock more rooms.'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    minScore: 800,
    maxScore: 1199,
    color: 'var(--color-tier-builders)',
    emoji: '🔄',
    description: 'Baseline credibility. Most new verified users start here.'
  },
  {
    id: 'established',
    name: 'Established',
    minScore: 1200,
    maxScore: 1599,
    color: 'var(--color-tier-veterans)',
    emoji: '✓',
    description: 'Verified contributors with a track record of positive interactions.'
  },
  {
    id: 'reputable',
    name: 'Reputable',
    minScore: 1600,
    maxScore: 1999,
    color: 'var(--color-tier-legends)',
    emoji: '⭐',
    description: 'Highly trusted members recognized for consistent credibility.'
  },
  {
    id: 'exemplary',
    name: 'Exemplary',
    minScore: 2000,
    maxScore: 2800,
    color: 'var(--color-tier-elite)',
    emoji: '💎',
    description: 'Top-tier credibility. The most trusted voices in the ecosystem.'
  }
]

export function getRoomForScore(score: number): ChatRoom | undefined {
  return CHAT_ROOMS.find(room => score >= room.minScore && score <= room.maxScore)
}

export function canAccessRoom(userScore: number, room: ChatRoom): boolean {
  return userScore >= room.minScore && userScore <= room.maxScore
}
