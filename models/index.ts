import mongoose, { Schema, Document } from 'mongoose'

// ─── Participation ───────────────────────────────────────────────────────────
export interface IParticipation extends Document {
  paymentId: string
  email: string
  name: string
  quantity: number
  assignedNumbers: number[]
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  weekId: string
  visitorId?: string
  referralCode?: string
  createdAt: Date
}

const ParticipationSchema = new Schema<IParticipation>({
  paymentId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, default: '' },
  quantity: { type: Number, required: true },
  assignedNumbers: [{ type: Number }],
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  weekId: { type: String, required: true },
  visitorId: String,
  referralCode: String,
}, { timestamps: true })

// ─── Cause ───────────────────────────────────────────────────────────────────
export interface ICause extends Document {
  title: string
  description: string
  images: string[]
  instagram?: string
  facebook?: string
  whatsapp?: string
  city: string
  votes: number
  approved: boolean
  weekId?: string
  createdAt: Date
}

const CauseSchema = new Schema<ICause>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  instagram: String,
  facebook: String,
  whatsapp: String,
  city: { type: String, required: true },
  votes: { type: Number, default: 0 },
  approved: { type: Boolean, default: false },
  weekId: String,
}, { timestamps: true })

// ─── Donation ────────────────────────────────────────────────────────────────
export interface IDonation extends Document {
  causeId: mongoose.Types.ObjectId
  amount: number
  proofImage?: string
  proofText: string
  weekId: string
  createdAt: Date
}

const DonationSchema = new Schema<IDonation>({
  causeId: { type: Schema.Types.ObjectId, ref: 'Cause', required: true },
  amount: { type: Number, required: true },
  proofImage: String,
  proofText: { type: String, default: '' },
  weekId: { type: String, required: true },
}, { timestamps: true })

// ─── Prize ───────────────────────────────────────────────────────────────────
export interface IPrize extends Document {
  title: string
  sponsor: string
  image?: string
  value: number
  weekId: string
  active: boolean
  createdAt: Date
}

const PrizeSchema = new Schema<IPrize>({
  title: { type: String, required: true },
  sponsor: { type: String, required: true },
  image: String,
  value: { type: Number, required: true },
  weekId: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })

// ─── Winner ──────────────────────────────────────────────────────────────────
export interface IWinner extends Document {
  name: string
  email: string
  winningNumber: number
  prizeId: mongoose.Types.ObjectId
  weekId: string
  randomOrgProof?: string
  createdAt: Date
}

const WinnerSchema = new Schema<IWinner>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  winningNumber: { type: Number, required: true },
  prizeId: { type: Schema.Types.ObjectId, ref: 'Prize' },
  weekId: { type: String, required: true },
  randomOrgProof: String,
}, { timestamps: true })

// ─── Pool ────────────────────────────────────────────────────────────────────
export interface IPool extends Document {
  weekId: string
  total: number
  donationsAmount: number
  prizesAmount: number
  platformAmount: number
  participationCount: number
  lastNumberAssigned: number
  updatedAt: Date
}

const PoolSchema = new Schema<IPool>({
  weekId: { type: String, required: true, unique: true },
  total: { type: Number, default: 0 },
  donationsAmount: { type: Number, default: 0 },
  prizesAmount: { type: Number, default: 0 },
  platformAmount: { type: Number, default: 0 },
  participationCount: { type: Number, default: 0 },
  lastNumberAssigned: { type: Number, default: 10000 },
}, { timestamps: true })

// ─── Referral ────────────────────────────────────────────────────────────────
export interface IReferral extends Document {
  referralCode: string
  visitorId: string
  visits: number
  conversions: number
  freeNumbersEarned: number
  freeNumbersRedeemed: number
  createdAt: Date
}

const ReferralSchema = new Schema<IReferral>({
  referralCode: { type: String, required: true, unique: true },
  visitorId: { type: String, required: true },
  visits: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  freeNumbersEarned: { type: Number, default: 0 },
  freeNumbersRedeemed: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Vote ────────────────────────────────────────────────────────────────────
export interface IVote extends Document {
  causeId: mongoose.Types.ObjectId
  visitorId: string
  fingerprint: string
  weekId: string
  createdAt: Date
}

const VoteSchema = new Schema<IVote>({
  causeId: { type: Schema.Types.ObjectId, ref: 'Cause', required: true },
  visitorId: { type: String, required: true },
  fingerprint: { type: String, default: '' },
  weekId: { type: String, required: true },
}, { timestamps: true })

VoteSchema.index({ causeId: 1, visitorId: 1, weekId: 1 }, { unique: true })

// ─── Exports ─────────────────────────────────────────────────────────────────
export const Participation = mongoose.models.Participation || mongoose.model('Participation', ParticipationSchema)
export const Cause = mongoose.models.Cause || mongoose.model('Cause', CauseSchema)
export const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema)
export const Prize = mongoose.models.Prize || mongoose.model('Prize', PrizeSchema)
export const Winner = mongoose.models.Winner || mongoose.model('Winner', WinnerSchema)
export const Pool = mongoose.models.Pool || mongoose.model('Pool', PoolSchema)
export const Referral = mongoose.models.Referral || mongoose.model('Referral', ReferralSchema)
export const Vote = mongoose.models.Vote || mongoose.model('Vote', VoteSchema)
