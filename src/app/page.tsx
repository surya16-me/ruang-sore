import Link from 'next/link'
import { LandingIllustration } from '@/components/shared/landing-illustration'

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* NAV */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <text
                x="50" y="53" textAnchor="middle" dominantBaseline="central"
                fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700"
                fontSize="32" fill="white" letterSpacing="-1"
              >
                RS
              </text>
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">RuangSore</span>
        </div>
        <Link
          href="/auth/login"
          className="rounded-md px-4 py-2 text-sm font-medium text-coral hover:bg-coral/10 transition-colors"
        >
          Masuk
        </Link>
      </header>

      {/* HERO */}
      <section className="flex-1 flex items-center px-6 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text */}
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground">
              Tempat cerita,<br />
              <span className="text-coral">bukan tempat solusi.</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              RuangSore adalah teman ngobrol yang hangat. Cerita aja apa
              yang lagi kamu rasain — tanpa takut dihakimi.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/80">
              Bukan terapis, bukan AI cold call center. Cuma tempat yang aman
              buat ngungkapin isi hati.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-md bg-coral text-white px-6 py-3 text-sm font-medium hover:bg-coral/90 transition-colors"
              >
                Mulai cerita
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
              >
                Udah punya akun
              </Link>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden md:flex justify-center">
            <LandingIllustration className="w-full max-w-sm" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center mx-auto">
                <span className="text-coral font-bold text-sm">1</span>
              </div>
              <h3 className="mt-3 font-semibold text-sm text-foreground">Kamu cerita</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Tulis apa pun yang lagi kamu rasain
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <span className="text-sage font-bold text-sm">2</span>
              </div>
              <h3 className="mt-3 font-semibold text-sm text-foreground">Aku dengerin</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Validasi tanpa menghakimi atau memaksa
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center mx-auto">
                <span className="text-indigo font-bold text-sm">3</span>
              </div>
              <h3 className="mt-3 font-semibold text-sm text-foreground">Lanjutin kapan aja</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Obrolan tersimpan, bisa dilanjut nanti
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="py-10 px-6 bg-muted/50">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            RuangSore adalah AI, bukan tenaga profesional kesehatan mental.
            Kalau kamu lagi dalam krisis atau butuh bantuan darurat,
            hubungi <span className="font-medium text-foreground">Into The Light Indonesia</span> di{' '}
            <span className="font-medium text-foreground">119 ext 8</span>.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>&copy; 2026 RuangSore</span>
          <div className="flex gap-4">
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Masuk
            </Link>
            <Link href="/chat" className="hover:text-foreground transition-colors">
              Mulai cerita
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
