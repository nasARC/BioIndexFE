import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from './routes/home';
import AboutPage from './routes/about';
import ChatbotPage from './routes/chatbot';
import SearchPage from './routes/search';
import ErrorPage from './routes/error';
import Sidebar from './components/sidebar';
import { AnimatePresence } from 'framer-motion';
import { useMemo } from "react";
import { useScreenSize } from "./lib/hooks";

function App() {
  const location = useLocation();

  const screensize = useScreenSize();
    const wClosed = useMemo(() => {
        return (
            screensize.width >= 1024
                ? undefined
                : screensize.width >= 768
                    ? undefined
                    : screensize.width >= 640
                        ? 100 - 12
                        : 100 - 15
        );
    }, [screensize.width]);

  return (
    <>
      <div className="h-main w-full bg-image"></div>
      <Sidebar pathname={location.pathname} />
      <AnimatePresence mode="wait">
        <main key={location.pathname} id={`${location.pathname.replace('/', '')}-page`} className="flex flex-col h-full max-h-full md:flex-1 md:w-[unset] items-center justify-start py-4 md:px-4" style={{
                width: `${wClosed}%`
            }}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </AnimatePresence>
    </>
  )
}

export default App
