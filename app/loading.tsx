export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-green-400/50 rounded-full animate-spin mx-auto" />
        <p className="text-white/20 text-xs">Cargando...</p>
      </div>
    </main>
  )
}
