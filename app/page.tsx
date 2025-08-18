import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UtensilsCrossed } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 text-center md:px-6">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <UtensilsCrossed className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Restaurant Portal
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Manage your restaurant information, packages, bookings, and promotions in one place.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="transition-all hover:scale-105">
              Sign In
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="transition-all hover:scale-105">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}