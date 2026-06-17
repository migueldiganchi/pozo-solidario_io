'use client'

import { useState, useCallback } from 'react'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Causes } from '@/components/sections/Causes'
import { Prizes } from '@/components/sections/Prizes'
import { Winners } from '@/components/sections/Winners'
import { Donations } from '@/components/sections/Donations'
import { Share } from '@/components/sections/Share'
import { ParticipationModal } from '@/components/ParticipationModal'
import { MyNumbers } from '@/components/MyNumbers'
import { AIAssistant } from '@/components/AIAssistant'
import { Footer } from '@/components/Footer'
import { useVisitorId } from '@/components/useVisitorId'

export default function Home() {
  const visitorId = useVisitorId()
  const [participationOpen, setParticipationOpen] = useState(false)
  const [myNumbersOpen, setMyNumbersOpen] = useState(false)

  const handleAIAction = useCallback((action: string) => {
    switch (action) {
      case 'open_participation':
        setParticipationOpen(true)
        break
      case 'scroll_causes':
        document.getElementById('causas')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'scroll_prizes':
        document.getElementById('premios')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'scroll_winners':
        document.getElementById('ganadores')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'scroll_donations':
        document.getElementById('donaciones')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'show_my_numbers':
        setMyNumbersOpen(true)
        break
      case 'show_share':
        document.getElementById('compartir')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'open_propose_cause':
        document.getElementById('causas')?.scrollIntoView({ behavior: 'smooth' })
        break
    }
  }, [])

  return (
    <main>
      <Navbar onParticipate={() => setParticipationOpen(true)} />

      <Hero onParticipate={() => setParticipationOpen(true)} />

      <Causes visitorId={visitorId} />

      <Prizes />

      <Winners />

      <Donations />

      <Share visitorId={visitorId} />

      <Footer />

      <ParticipationModal
        isOpen={participationOpen}
        onClose={() => setParticipationOpen(false)}
        visitorId={visitorId}
      />

      <MyNumbers
        visitorId={visitorId}
        isOpen={myNumbersOpen}
        onClose={() => setMyNumbersOpen(false)}
      />

      <AIAssistant onAction={handleAIAction} />
    </main>
  )
}
