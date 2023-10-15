import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './HUD/Index';
import ClanWar from './HUD/Clan/ClanWar';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/clanwar" element={<ClanWar />} />
                    <Route path="/clanwar/:clanTag" element={<ClanWar />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
