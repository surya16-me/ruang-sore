import { LandingIllustration } from '@/components/shared/landing-illustration'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh flex">
      {/* Left: Branding */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-muted/30 p-12">
        <LandingIllustration className="w-full max-w-xs" />
        <div className="mt-8 text-center max-w-xs">
          <p className="text-sm font-semibold text-foreground">RuangSore</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Tempat cerita, bukan tempat solusi.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  )
}
