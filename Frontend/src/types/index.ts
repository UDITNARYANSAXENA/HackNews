export interface HNStory {
  id: number
  title: string
  url?: string | null
  score: number
  by: string
  time: number
  descendants: number
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface StoriesResponse {
  success: boolean
  data: {
    stories: HNStory[]
    pagination: PaginationInfo
  }
}