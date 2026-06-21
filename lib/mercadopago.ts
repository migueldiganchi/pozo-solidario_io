import { PRICE_PER_NUMBER } from './utils'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:1369'

export async function createPreference({
  quantity,
  visitorId,
  referralCode,
  weekId,
}: {
  quantity: number
  visitorId: string
  referralCode?: string
  weekId: string
}) {
  const unitPrice = PRICE_PER_NUMBER
  const total = unitPrice * quantity

  const body = {
    items: [
      {
        id: `ps-ticket-${weekId}`,
        title: `Pozo Solidario — ${quantity} número${quantity > 1 ? 's' : ''}`,
        description: `Participá del sorteo solidario. ${quantity} número${quantity > 1 ? 's' : ''} asignado${quantity > 1 ? 's' : ''} automáticamente.`,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: total,
      },
    ],
    back_urls: {
      success: `${BASE_URL}/gracias?status=success`,
      failure: `${BASE_URL}/gracias?status=failure`,
      pending: `${BASE_URL}/gracias?status=pending`,
    },
    auto_return: 'approved',
    notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
    metadata: {
      visitorId,
      quantity,
      weekId,
      referralCode: referralCode || '',
    },
    statement_descriptor: 'POZO SOLIDARIO',
    payment_methods: {
      excluded_payment_types: [],
      installments: 1,
    },
  }

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MP Error: ${error}`)
  }

  return response.json()
}

export async function getPayment(paymentId: string) {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
  })

  if (!response.ok) throw new Error('No se pudo obtener el pago')
  return response.json()
}
