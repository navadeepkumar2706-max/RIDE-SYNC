import { lazy, Suspense, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Activity, ArrowRight, ArrowUpRight, CarFront, Check, CircleHelp, Compass,
  GraduationCap, LockKeyhole, MapPin, Route, Search, Users, WalletCards,
} from 'lucide-react';
import { Link, Route as WRoute, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const LandingCarScene = lazy(() => import('@/components/LandingCarScene'));

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Activity },
  { href: '/find-rides', label: 'Find rides', icon: Search },
  { href: '/offer-ride', label: 'Offer a ride', icon: CarFront },
  { href: '/my-rides', label: 'My rides', icon: Route },
  { href: '/my-bookings', label: 'My bookings', icon: WalletCards },
  { href: '/profile', label: 'Profile', icon: Users },
];

function Brand() {
  return <Link href="/" className="rs-brand" aria-label="RideSync home" data-testid="link-brand-home">
    <span className="rs-mark"><Route size={18} strokeWidth={2.4} /></span>
    <span>RideSync</span>
  </Link>;
}

function Header({ current = '/' }: { current?: string }) {
  return <header className="rs-header">
    <Brand />
    <nav className="rs-nav" aria-label="Main navigation">
      <Link href="/find-rides" aria-current={current === '/find-rides' ? 'page' : undefined} data-testid="link-find-rides">Find a ride</Link>
      <Link href="/offer-ride" aria-current={current === '/offer-ride' ? 'page' : undefined} data-testid="link-offer-ride">Offer a ride</Link>
      <Link href="/dashboard" aria-current={current === '/dashboard' ? 'page' : undefined} data-testid="link-dashboard">Dashboard</Link>
    </nav>
    <div className="rs-nav-actions">
      <Link href="/login" className="rs-btn" data-testid="link-login">Log in</Link>
      <Link href="/register" className="rs-btn rs-btn-primary" data-testid="link-register">Join RideSync <ArrowRight size={14} /></Link>
    </div>
  </header>;
}

function Landing() {
  return <main className="rs-app rs-grain">
    <div className="rs-shell">
      <Header />
    </div>
    <Suspense fallback={<div className="rs-shell rs-hero-loading" role="status">Preparing the RideSync vehicle experience…</div>}>
      <LandingCarScene />
    </Suspense>
    <div className="rs-shell rs-marquee" aria-label="RideSync principles"><span>Designed for campus</span><span>Routes worth sharing</span><span>Move in good company</span><span>Make the commute count</span></div>
    <section className="rs-shell rs-section">
      <div className="rs-section-heading">
        <div><div className="rs-tag">A better way between here and there</div><h2>Commutes work better when they work together.</h2></div>
        <p>Built around the routes students already travel. Find people headed your way, or make room for someone new.</p>
      </div>
      <div className="rs-feature-grid">
        <article className="rs-feature-main">
          <div><div className="rs-feature-num">01 / THE ROUTE</div><h3>One journey. More possibilities.</h3><p>Bring your everyday campus commute into focus. RideSync is designed to make shared travel feel considered, clear, and easy to navigate.</p></div>
          <div className="rs-route-art" aria-hidden="true"><MapPin size={17} /><i /><MapPin size={17} /></div>
        </article>
        <div className="rs-feature-stack">
          <article className="rs-feature-mini"><div><div className="rs-feature-num">02 / THE MATCH</div><h3>Find your way, together.</h3><p>Search when you need a lift. The campus community is at the heart of every connection.</p></div><Compass size={23} color="#57d5df" /></article>
          <article className="rs-feature-mini"><div><div className="rs-feature-num">03 / THE COMMUNITY</div><h3>Shared routes. Shared trust.</h3><p>A focused place for student commutes, with a thoughtful experience from the first mile.</p></div><GraduationCap size={23} color="#57d5df" /></article>
        </div>
      </div>
    </section>
    <section className="rs-final-cta">
      <div className="rs-shell rs-final-cta-inner">
        <div><div className="rs-tag">Your next ride starts here</div><h2>Make the miles mean more.</h2></div>
        <div className="rs-hero-actions"><Link href="/find-rides" className="rs-btn rs-btn-primary">Find a ride <ArrowUpRight size={15} /></Link><Link href="/offer-ride" className="rs-btn">Offer a ride <ArrowRight size={15} /></Link></div>
      </div>
    </section>
    <footer className="rs-shell rs-footer">
      <Brand /><span>Same Route. Shared Ride. Smarter Commute.</span>
      <div className="rs-footer-links"><Link href="/find-rides">Find rides</Link><Link href="/dashboard">Dashboard</Link><Link href="/login">Log in</Link></div>
    </footer>
  </main>;
}

function MobileNav({ path }: { path: string }) {
  const items = navItems.slice(0, 5);
  return <nav className="rs-mobile-nav" aria-label="Mobile navigation">
    {items.map(({ href, label, icon: Icon }) => <Link href={href} className={path === href ? 'active' : ''} key={href} aria-current={path === href ? 'page' : undefined} data-testid={`mobile-link-${href.slice(1)}`}>
      <Icon size={17} /><span>{label}</span>
    </Link>)}
  </nav>;
}

function AppShell({ children, path }: { children: ReactNode; path: string }) {
  return <div className="rs-app rs-app-layout rs-grain">
    <aside className="rs-side">
      <Brand /><div className="rs-side-label">Campus commute</div>
      <nav className="rs-side-nav" aria-label="Application navigation">
        {navItems.map(({ href, label, icon: Icon }) => <Link href={href} key={href} className={`rs-side-link ${path === href ? 'active' : ''}`} aria-current={path === href ? 'page' : undefined} data-testid={`side-link-${href.slice(1)}`}><Icon size={16} />{label}</Link>)}
      </nav>
      <div className="rs-side-note">A calmer commute starts with a shared route.<br /><span className="rs-tag">Same route, better together.</span></div>
    </aside>
    <div className="rs-main">
      <div className="rs-app-top"><span>RideSync / {path.split('/').filter(Boolean).join(' / ') || 'Overview'}</span><span>Campus mobility</span></div>
      {children}
    </div>
    <MobileNav path={path} />
  </div>;
}

const backendNotice = 'RideSync’s account, ride, and booking services are not connected in this environment. No data is being created or shown as if it were real.';

function EmptyState({ title, description, icon: Icon = CircleHelp }: { title: string; description: string; icon?: typeof CircleHelp }) {
  return <div className="rs-panel rs-unavailable" role="status" data-testid="status-unavailable">
    <div><div className="rs-empty-icon"><Icon size={21} /></div><h2 className="rs-empty-title">{title}</h2><p className="rs-empty-copy">{description}</p></div>
  </div>;
}

function RoutePage({ path }: { path: string }) {
  const config: Record<string, { title: string; label: string; intro: string; icon: typeof CircleHelp; unavailable: string }> = {
    '/dashboard': { title: 'Your commute, in view.', label: 'Overview', intro: 'Your RideSync home for campus journeys, rides, and bookings.', icon: Activity, unavailable: 'Your dashboard will show real rides and bookings here once RideSync services are connected.' },
    '/my-rides': { title: 'Rides you offer.', label: 'My rides', intro: 'Keep track of your shared trips and the seats you make available.', icon: CarFront, unavailable: 'No ride records are available. Ride publishing is unavailable until a rides service is connected.' },
    '/my-bookings': { title: 'Journeys you join.', label: 'My bookings', intro: 'See the status of the rides you have requested to join.', icon: WalletCards, unavailable: 'Booking records are unavailable because the RideSync booking service is not connected.' },
    '/profile': { title: 'Your campus profile.', label: 'Profile', intro: 'Your account details belong to you. Nothing is stored or shown here yet.', icon: Users, unavailable: 'Profile information cannot be loaded until an account service is connected.' },
    '/offer-ride': { title: 'Make room for one more.', label: 'Offer a ride', intro: 'Share a route you already travel and help make campus commutes more connected.', icon: CarFront, unavailable: 'Publishing a ride is unavailable: this frontend has no RideSync ride API to save your trip.' },
  };
  const page = config[path] || config['/dashboard'];
  return <AppShell path={path}>
    <main className="rs-page">
      <div className="rs-page-head">
        <div><div className="rs-tag">{page.label}</div><h1>{page.title}</h1><p className="rs-page-intro">{page.intro}</p></div>
        {path === '/dashboard' && <div className="rs-tag">CAMPUS / COMMUTE</div>}
      </div>
      <div className="rs-status-note" role="note" data-testid="note-no-backend"><strong>Services not connected.</strong> {backendNotice}</div>
      <div style={{ marginTop: 18 }}><EmptyState title="Nothing to show just yet." description={page.unavailable} icon={page.icon} /></div>
    </main>
  </AppShell>;
}

function FindRides() {
  const [searchText, setSearchText] = useState('');
  const [searched, setSearched] = useState(false);
  return <AppShell path="/find-rides"><main className="rs-page">
    <div className="rs-page-head"><div><div className="rs-tag">Campus commute / search</div><h1>Find your way there.</h1><p className="rs-page-intro">Look for a ride that lines up with your day. Search is ready to connect when ride services are available.</p></div></div>
    <div className="rs-panel rs-search-controls">
      <form className="rs-search-grid" onSubmit={(e) => { e.preventDefault(); setSearched(true); }}>
        <label><span className="rs-label">Pickup</span><input className="rs-input" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Your starting point" data-testid="input-pickup" /></label>
        <label><span className="rs-label">Destination</span><input className="rs-input" placeholder="Campus or destination" data-testid="input-destination" /></label>
        <label><span className="rs-label">Travel date</span><input className="rs-input" type="date" data-testid="input-date" /></label>
        <label><span className="rs-label">Departure time</span><input className="rs-input" type="time" data-testid="input-time" /></label>
        <label><span className="rs-label">Seats needed</span><select className="rs-input" defaultValue="1" data-testid="input-seats"><option value="1">1 seat</option><option value="2">2 seats</option><option value="3">3 seats</option><option value="4">4 seats</option></select></label>
        <div style={{ display: 'flex', alignItems: 'end' }}><button type="submit" className="rs-btn rs-btn-primary" disabled aria-disabled="true" title="Ride search is unavailable until the RideSync API is connected" data-testid="button-search-rides"><Search size={15} />Search rides</button></div>
      </form>
    </div>
    <div className="rs-status-note" role="note"><strong>Search unavailable.</strong> {searched ? 'Your search was not sent or saved.' : 'These fields do not submit anywhere: no ride search API is configured.'}</div>
    <div style={{ marginTop: 18 }}><EmptyState title="No ride results to display." description="Search results need live RideSync ride data. This page intentionally shows no sample drivers or invented trips." icon={Route} /></div>
  </main></AppShell>;
}

function RideDetail({ params }: { params: { id?: string } }) {
  const id = params.id || '';
  return <AppShell path="/find-rides"><main className="rs-page">
    <div className="rs-page-head"><div><div className="rs-tag">Ride details</div><h1>Journey overview.</h1><p className="rs-page-intro">A ride record is required to show trip details or request a seat.</p></div><Link href="/find-rides" className="rs-btn"><ArrowRight size={14} />Back to search</Link></div>
    <div className="rs-status-note"><strong>Ride details unavailable.</strong> No ride API is connected; this route does not look up or invent a ride record.</div>
    <div style={{ marginTop: 18 }}><EmptyState title="This ride could not be loaded." description={id ? `Ride reference: ${id}. No record was requested because rides are not connected.` : 'Choose a ride from search results when the service is available.'} icon={CarFront} /></div>
  </main></AppShell>;
}

function AuthPage({ register = false }: { register?: boolean }) {
  return <main className="rs-app rs-auth-grid rs-grain">
    <section className="rs-auth-visual">
      <Brand /><div className="rs-auth-visual-content"><div className="rs-tag">Campus mobility / RideSync</div><h1>Same route.<br />Better together.</h1><p>The daily commute deserves a better rhythm. Find fellow students heading your way and make every journey count.</p>
        <div className="rs-auth-perks"><div className="rs-auth-perk"><Check size={15} /> A community made for student commutes</div><div className="rs-auth-perk"><Check size={15} /> Designed around routes you already travel</div><div className="rs-auth-perk"><Check size={15} /> Clear, considered journey planning</div></div>
      </div><div className="rs-auth-foot">SAME ROUTE. SHARED RIDE. SMARTER COMMUTE.</div>
    </section>
    <section className="rs-auth-form-wrap"><div className="rs-auth-form">
      <div className="rs-tag">{register ? 'Create an account' : 'Welcome back'}</div><h2>{register ? 'Join RideSync.' : 'Good to see you.'}</h2><p>{register ? 'Your RideSync account starts with your campus community.' : 'Sign in to get back to your RideSync commute.'}</p>
      <form className="rs-form" onSubmit={e => e.preventDefault()}>
        {register && <label><span className="rs-label">Full name</span><input className="rs-input" autoComplete="name" placeholder="Your name" disabled data-testid="input-full-name" /></label>}
        <label><span className="rs-label">Student email</span><input className="rs-input" type="email" autoComplete="email" placeholder="you@campus.edu" disabled data-testid="input-email" /></label>
        {register && <label><span className="rs-label">College name</span><input className="rs-input" placeholder="Your college or university" disabled data-testid="input-college" /></label>}
        <label><span className="rs-label">Password</span><input className="rs-input" type="password" autoComplete={register ? 'new-password' : 'current-password'} placeholder="Enter your password" disabled data-testid="input-password" /></label>
        {register && <label><span className="rs-label">Confirm password</span><input className="rs-input" type="password" autoComplete="new-password" placeholder="Confirm your password" disabled data-testid="input-confirm-password" /></label>}
        <button type="submit" className="rs-btn rs-btn-primary" disabled aria-disabled="true" data-testid="button-auth-submit">{register ? 'Create account' : 'Log in'} <ArrowRight size={14} /></button>
      </form>
      <div className="rs-disabled-box"><div className="rs-note"><LockKeyhole size={16} /><span><strong>Account services are not connected.</strong> This form is intentionally disabled. Your details are not submitted, and no account is created.</span></div></div>
      <div className="rs-auth-switch">{register ? 'Already have an account?' : 'New to RideSync?'} {' '}<Link href={register ? '/login' : '/register'} data-testid={register ? 'link-auth-login' : 'link-auth-register'}>{register ? 'Log in' : 'Register'}</Link></div>
      <div style={{ marginTop: 25, textAlign: 'center' }}><Link href="/" className="rs-tag" data-testid="link-auth-home">Return to RideSync home</Link></div>
    </div></section>
  </main>;
}

function Router() {
  const [location] = useLocation();
  return <RoutedErrorBoundary>
    <Switch>
      <WRoute path="/" component={Landing} />
      <WRoute path="/login"><AuthPage /></WRoute>
      <WRoute path="/register"><AuthPage register /></WRoute>
      <WRoute path="/dashboard"><RoutePage path="/dashboard" /></WRoute>
      <WRoute path="/find-rides" component={FindRides} />
      <WRoute path="/offer-ride"><RoutePage path="/offer-ride" /></WRoute>
      <WRoute path="/rides/:id" component={RideDetail} />
      <WRoute path="/my-rides"><RoutePage path="/my-rides" /></WRoute>
      <WRoute path="/my-bookings"><RoutePage path="/my-bookings" /></WRoute>
      <WRoute path="/profile"><RoutePage path="/profile" /></WRoute>
      <WRoute component={NotFound} />
    </Switch>
  </RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;
