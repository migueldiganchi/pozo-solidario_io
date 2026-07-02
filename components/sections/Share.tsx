'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface ShareProps {
  visitorId: string
}

export function Share({ visitorId }: ShareProps) {
  const [referralData, setReferralData] = useState<any>(null)

  useEffect(() => {
    if (!visitorId) return
    fetch(`/api/referrals?visitorId=${visitorId}`)
      .then(r => r.json())
      .then(setReferralData)
      .catch(() => {})
  }, [visitorId])

  const referralLink = referralData
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://pozosolidario.com'}/?ref=${referralData.referralCode}`
    : ''

  const handleCopy = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink)
    toast.success('¡Link copiado!')
  }

  const handleShare = () => {
    if (!referralLink) return
    if (navigator.share) {
      navigator.share({
        title: 'Pozo Solidario',
        text: 'Participá del pozo solidario, ayudá causas reales y ganá premios.',
        url: referralLink,
      }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  return (
    <section id="compartir" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-gradient rounded-3xl p-10 text-center space-y-8"
        >
          <div className="space-y-3">
            <div className="text-4xl">🔗</div>
            <h2 className="font-display text-3xl md:text-4xl text-white">Compartí y ganá</h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Por cada 10 personas que participen desde tu link,<br />
              recibís <span className="text-white/70">1 número gratis</span>.
            </p>
          </div>

          {referralData && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-2xl px-4 py-3">
                <span className="text-white/30 text-xs font-mono flex-1 truncate">{referralLink}</span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  Copiar
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/8 hover:text-white active:scale-[0.98] transition-all"
              >
                Compartir link
              </button>
            </div>
          )}

          {referralData && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="text-center">
                <div className="text-2xl font-display text-white">{referralData.visits || 0}</div>
                <div className="text-xs text-white/30 mt-1">Visitas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display text-white">{referralData.conversions || 0}</div>
                <div className="text-xs text-white/30 mt-1">Participaron</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display text-green-400">{referralData.pendingFreeNumbers || 0}</div>
                <div className="text-xs text-white/30 mt-1">Núm. gratis</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
