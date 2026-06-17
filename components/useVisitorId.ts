'use client'

import { useEffect, useState } from 'react'
import { generateVisitorId } from '@/lib/utils'

export function useVisitorId(): string {
  const [visitorId, setVisitorId] = useState<string>('')

  useEffect(() => {
    let id = localStorage.getItem('ps_user_id')
    if (!id) {
      id = generateVisitorId()
      localStorage.setItem('ps_user_id', id)
    }
    setVisitorId(id)

    // Track referral if present
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) {
      localStorage.setItem('ps_ref', ref)
      fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: ref, visitorId: id }),
      }).catch(() => {})
    }
  }, [])

  return visitorId
}
