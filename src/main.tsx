import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './news.css'
import './poll.css'
import './nav.css'
import './service.css'
import './plan.css'
import App from './App.tsx'
import { CartProvider } from './components/CartContext.tsx'
import { PlayerProvider } from './components/PlayerContext.tsx'
import { ToastProvider } from './components/Toast.tsx'
import { trackPageView } from './lib/analytics.ts'
import { initTrackingPixelsDeferred } from './lib/pixels.ts'

// /plan links carry the client's name and date in the query string. An inline
// script in index.html already moved it into window.__planQuery before Google
// Analytics loaded; this is the fallback. The ad pixels stay off that page
// entirely (no tracking of who a client is or what they type).
const isPlan = window.location.pathname.replace(/\/+$/, '') === '/plan'
if (isPlan && window.location.search) {
  ;(window as unknown as { __planQuery?: string }).__planQuery = window.location.search
  window.history.replaceState(window.history.state, '', window.location.pathname)
}
if (!isPlan) initTrackingPixelsDeferred()

// Lazy load all non-home routes — they only download when first visited
const EPK        = lazy(() => import('./pages/EPK.tsx'))
const Admin      = lazy(() => import('./pages/Admin.tsx'))
const Terms      = lazy(() => import('./pages/Terms.tsx'))
const Privacy    = lazy(() => import('./pages/Privacy.tsx'))
const Planners   = lazy(() => import('./pages/Planners.tsx'))
const Refunds    = lazy(() => import('./pages/Refunds.tsx'))
const BookingPolicy = lazy(() => import('./pages/BookingPolicy.tsx'))
const OfficePartyPoll = lazy(() => import('./pages/OfficePartyPoll.tsx'))
const PollVote = lazy(() => import('./pages/PollVote.tsx'))
const PollResults = lazy(() => import('./pages/PollResults.tsx'))
const SoulShades = lazy(() => import('./pages/SoulShades.tsx'))
const Music      = lazy(() => import('./pages/Music.tsx'))
const Pricing    = lazy(() => import('./pages/Pricing.tsx'))
const Corporate  = lazy(() => import('./pages/seo/Corporate.tsx'))
const ViolinDJ   = lazy(() => import('./pages/seo/ViolinDJ.tsx'))
const Hamptons   = lazy(() => import('./pages/seo/Hamptons.tsx'))
const PianoDJ    = lazy(() => import('./pages/seo/PianoDJ.tsx'))
const DestinationDJ = lazy(() => import('./pages/seo/DestinationDJ.tsx'))
const WeddingDJ  = lazy(() => import('./pages/seo/WeddingDJ.tsx'))
const WeddingPackage = lazy(() => import('./pages/seo/WeddingPackage.tsx'))
const WeddingDJManhattan   = lazy(() => import('./pages/seo/WeddingDJManhattan.tsx'))
const WeddingDJLongIsland  = lazy(() => import('./pages/seo/WeddingDJLongIsland.tsx'))
const WeddingDJStamford    = lazy(() => import('./pages/seo/WeddingDJStamford.tsx'))
const WeddingDJNorthernNJ  = lazy(() => import('./pages/seo/WeddingDJNorthernNJ.tsx'))
const WeddingDJWestchester = lazy(() => import('./pages/seo/WeddingDJWestchester.tsx'))
const AfrobeatsDJ = lazy(() => import('./pages/seo/AfrobeatsDJ.tsx'))
const RBHipHopDJ  = lazy(() => import('./pages/seo/RBHipHopDJ.tsx'))
const DJForHireNYC = lazy(() => import('./pages/seo/DJForHireNYC.tsx'))
const NewYearsEveDJ = lazy(() => import('./pages/seo/NewYearsEveDJ.tsx'))
const HolidayPartyDJ = lazy(() => import('./pages/seo/HolidayPartyDJ.tsx'))
const CorporateJerseyCity = lazy(() => import('./pages/seo/CorporateJerseyCity.tsx'))
const CorporateBrooklyn = lazy(() => import('./pages/seo/CorporateBrooklyn.tsx'))
const BirthdayPartyDJ = lazy(() => import('./pages/seo/BirthdayPartyDJ.tsx'))
const PrivatePartyDJ = lazy(() => import('./pages/seo/PrivatePartyDJ.tsx'))
const HipHopDJ    = lazy(() => import('./pages/seo/HipHopDJ.tsx'))
const Sweet16DJ   = lazy(() => import('./pages/seo/Sweet16DJ.tsx'))
const Sweet16HudsonValley = lazy(() => import('./pages/seo/Sweet16HudsonValley.tsx'))
const RooftopDJ   = lazy(() => import('./pages/seo/RooftopDJ.tsx'))
const RnBDJ       = lazy(() => import('./pages/seo/RnBDJ.tsx'))
const HouseJerseyClubDJ = lazy(() => import('./pages/seo/HouseJerseyClubDJ.tsx'))
const WeddingDJCost = lazy(() => import('./pages/seo/WeddingDJCost.tsx'))
const EventDJCost = lazy(() => import('./pages/seo/EventDJCost.tsx'))
const News              = lazy(() => import('./pages/News.tsx'))
const NewsArticle       = lazy(() => import('./pages/NewsArticle.tsx'))
const FAQ               = lazy(() => import('./pages/FAQ.tsx'))
const ThankYou          = lazy(() => import('./pages/ThankYou.tsx'))
const Contact           = lazy(() => import('./pages/Contact.tsx'))
const MusicPlan         = lazy(() => import('./pages/MusicPlan.tsx'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    trackPageView(pathname)
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash) as HTMLElement | null
        if (el) {
          const nav = document.querySelector('.nav') as HTMLElement | null
          const offset = (nav?.offsetHeight ?? 70) + 16
          const top = el.getBoundingClientRect().top + window.scrollY - offset
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 120)
    } else {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), 0)
    }
  }, [pathname, hash])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
        <PlayerProvider>
        <ScrollManager />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"           element={<App />} />
            <Route path="/epk"        element={<EPK />} />
            <Route path="/admin"      element={<Admin />} />
            <Route path="/terms"      element={<Terms />} />
            <Route path="/privacy"    element={<Privacy />} />
            <Route path="/refunds"    element={<Refunds />} />
            <Route path="/booking-policy" element={<BookingPolicy />} />
            <Route path="/planners" element={<Planners />} />
            <Route path="/plan" element={<MusicPlan />} />
            <Route path="/office-party-music-poll" element={<OfficePartyPoll />} />
            <Route path="/poll/:pollId" element={<PollVote />} />
            <Route path="/poll/:pollId/results" element={<PollResults />} />
            <Route path="/soul-shades" element={<SoulShades />} />
            <Route path="/music"      element={<Music />} />
            <Route path="/pricing"    element={<Pricing />} />
            <Route path="/corporate-event-dj-nyc-nj-ct" element={<Corporate />} />
            <Route path="/violin-dj-duo-nyc-nj" element={<ViolinDJ />} />
            <Route path="/piano-dj-duo-nyc-nj" element={<PianoDJ />} />
            <Route path="/hamptons-luxury-dj" element={<Hamptons />} />
            <Route path="/destination-wedding-dj" element={<DestinationDJ />} />
            <Route path="/wedding-dj-nyc-nj" element={<WeddingDJ />} />
            <Route path="/wedding-entertainment-package-nyc-nj" element={<WeddingPackage />} />
            <Route path="/wedding-dj-manhattan-nyc" element={<WeddingDJManhattan />} />
            <Route path="/wedding-dj-long-island-ny" element={<WeddingDJLongIsland />} />
            <Route path="/wedding-dj-stamford-ct" element={<WeddingDJStamford />} />
            <Route path="/wedding-dj-northern-nj" element={<WeddingDJNorthernNJ />} />
            <Route path="/wedding-dj-westchester-ny" element={<WeddingDJWestchester />} />
            <Route path="/afrobeats-amapiano-dj-nyc-nj" element={<AfrobeatsDJ />} />
            <Route path="/rb-hip-hop-dj-nyc-nj" element={<RBHipHopDJ />} />
            <Route path="/dj-for-hire-nyc" element={<DJForHireNYC />} />
            <Route path="/new-years-eve-dj-nyc" element={<NewYearsEveDJ />} />
            <Route path="/holiday-party-dj-nyc-nj-ct" element={<HolidayPartyDJ />} />
            <Route path="/corporate-event-dj-jersey-city-nj" element={<CorporateJerseyCity />} />
            <Route path="/corporate-event-dj-brooklyn-ny" element={<CorporateBrooklyn />} />
            <Route path="/birthday-party-dj-nyc-nj" element={<BirthdayPartyDJ />} />
            <Route path="/private-party-dj-nyc-nj" element={<PrivatePartyDJ />} />
            <Route path="/hip-hop-dj-nyc-nj" element={<HipHopDJ />} />
            <Route path="/sweet-16-dj-nyc-nj" element={<Sweet16DJ />} />
            <Route path="/sweet-16-dj-hudson-valley-ny" element={<Sweet16HudsonValley />} />
            <Route path="/rooftop-party-dj-nyc" element={<RooftopDJ />} />
            <Route path="/rb-dj-nyc-nj" element={<RnBDJ />} />
            <Route path="/house-jersey-club-dj-nyc-nj" element={<HouseJerseyClubDJ />} />
            <Route path="/wedding-dj-cost-nyc" element={<WeddingDJCost />} />
            <Route path="/event-dj-cost-nyc-nj-ct" element={<EventDJCost />} />
            <Route path="/news"           element={<News />} />
            <Route path="/news/:slug"     element={<NewsArticle />} />
            <Route path="/faq"            element={<FAQ />} />
            <Route path="/thank-you"      element={<ThankYou />} />
            <Route path="/contact"        element={<Contact />} />
          </Routes>
        </Suspense>
        </PlayerProvider>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
