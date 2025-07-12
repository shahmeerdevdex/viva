
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Results from "./pages/Results";
import PrimaryAssessment from "./pages/PrimaryAssessment";
import AnalysisResults from "./pages/AnalysisResults";
import ReversalProtocol from "./pages/ReversalProtocol";
import ViviaTransformation from "./pages/ViviaTransformation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/results" element={<Results />} />
          <Route path="/primary-assessment" element={<PrimaryAssessment />} />
          <Route path="/analysis-results" element={<AnalysisResults />} />
          <Route path="/reversal-protocol" element={<ReversalProtocol />} />
          <Route path="/vivia-transformation" element={<ViviaTransformation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
