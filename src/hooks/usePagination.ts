import { useState } from 'react'
import { PAGINATION } from '@/utils/constants'

interface UsePaginationReturn {
  page: number
  size: number
  totalPages: number
  totalElements: number
  setPage: (page: number) => void
  setSize: (size: number) => void
  setTotalPages: (totalPages: number) => void
  setTotalElements: (totalElements: number) => void
  reset: () => void
  nextPage: () => void
  previousPage: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function usePagination(
  initialPage = PAGINATION.DEFAULT_PAGE,
  initialSize = PAGINATION.DEFAULT_SIZE
): UsePaginationReturn {
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const reset = () => {
    setPage(initialPage)
  }

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1)
    }
  }

  const previousPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const canGoNext = page < totalPages - 1
  const canGoPrevious = page > 0

  return {
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setSize,
    setTotalPages,
    setTotalElements,
    reset,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
  }
}
