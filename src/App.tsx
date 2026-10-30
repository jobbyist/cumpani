import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SkipLink from "@/components/SkipLink";
import AgeVerification from "@/components/AgeVerification";
import BottomNav from "@/components/BottomNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import QuickExit from "@/components/QuickExit";
import PreviewBanner from "@/components/PreviewBanner";
import CookieConsent from "@/components/CookieConsent";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrientationProvider } from "@/contexts/OrientationContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Index from "./pages/Index";

// Lazy load non-critical pages
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refunds = lazy(() => import("./pages/Refunds"));
const Cookies = lazy(() => import("./pages/Cookies"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Companions = lazy(() => import("./pages/Companions"));
const CompanionDetail = lazy(() => import("./pages/CompanionDetail"));
const BecomeCompanion = lazy(() => import("./pages/BecomeCompanion"));
const Membership = lazy(() => import("./pages/Membership"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Verify = lazy(() => import("./pages/Verify"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Feed = lazy(() => import("./pages/Feed"));
const Messages = lazy(() => import("./pages/Messages"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EarlyAccess = lazy(() => import("./pages/EarlyAccess"));
const Safety = lazy(() => import("./pages/Safety"));
const Admin = lazy(() => import("./pages/Admin"));
const AcceptableUse = lazy(() => import("./pages/AcceptableUse"));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <OrientationProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <SkipLink />
              <AgeVerification />
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/early-access" element={<EarlyAccess />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/refunds" element={<Refunds />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/acceptable-use" element={<AcceptableUse />} />
                  <Route path="/community-guidelines" element={<CommunityGuidelines />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/become-companion" element={<BecomeCompanion />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Signed-in only */}
                  <Route path="/verify" element={<ProtectedRoute requireVerified={false} requireSubscription={false}><Verify /></ProtectedRoute>} />
                  <Route path="/wallet" element={<ProtectedRoute requireVerified={false} requireSubscription={false}><Wallet /></ProtectedRoute>} />

                  {/* Verified + subscribed members */}
                  <Route path="/companions" element={<ProtectedRoute><Companions /></ProtectedRoute>} />
                  <Route path="/companion/:id" element={<ProtectedRoute><CompanionDetail /></ProtectedRoute>} />
                  <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

                  {/* Administrators */}
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />

                  {/* Companions */}
                  <Route path="/dashboard/*" element={<ProtectedRoute requireCompanion requireSubscription={false}><Dashboard /></ProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <QuickExit />
              <PreviewBanner />
              <BottomNav />
              <CookieConsent />
            </BrowserRouter>
            </TooltipProvider>
          </FavoritesProvider>
          </OrientationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
