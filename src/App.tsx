import { BrowserRouter, Route, Routes, useParams } from "react-router";
import { ProgressProvider } from "@bprogress/react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/Navbar";
import { RouteProgress } from "@/components/RouteProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { DateRoute } from "@/routes/DateRoute";
import { HomeRoute } from "@/routes/HomeRoute";
import { NotFound } from "@/routes/NotFound";

const DARK_ACCENT = "#e8c24a";

// ? Remounting per date gives each page a clean loading state instead of
//   showing the previous picture while the next one resolves
function DateRouteKeyed() {
  const { date } = useParams();
  return <DateRoute key={date} />;
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProgressProvider
          height="3px"
          color={DARK_ACCENT}
          options={{ showSpinner: false }}
          shallowRouting
        >
          <RouteProgress />
          <ScrollToTop />
          <div className="starfield" aria-hidden="true" />
          <Navbar />
          <div className="relative z-[2]">
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/:date" element={<DateRouteKeyed />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </ProgressProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
