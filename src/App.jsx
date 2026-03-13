import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DiscoverScreen from './screens/DiscoverScreen';
import LearnScreen from './screens/LearnScreen';
import ActScreen from './screens/ActScreen';

export default function App() {
  const [screen, setScreen] = useState('discover'); // discover | learn | act
  const [selectedSite, setSelectedSite] = useState(null);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'discover' && (
          <DiscoverScreen
            key="discover"
            onStartTour={(site) => {
              setSelectedSite(site);
              setScreen('learn');
            }}
          />
        )}
        {screen === 'learn' && (
          <LearnScreen
            key="learn"
            site={selectedSite}
            onComplete={() => setScreen('act')}
            onBack={() => setScreen('discover')}
          />
        )}
        {screen === 'act' && (
          <ActScreen
            key="act"
            site={selectedSite}
            onBack={() => setScreen('discover')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
