export interface User {
  id: string
  username: string
  twitterId?: string
  ethosScore: number
  avatar?: string
}

export interface Message {
  id: string
  userId: string
  username: string
  text: string
  timestamp: number
  roomId: string
}

export interface ChatRoom {
  id: string
  name: string
  minScore: number
  maxScore: number
  color: string
  emoji: string
  description: string
}

export interface EthosApiResponse {
  score?: number
  username?: string
  profileId?: number
}
