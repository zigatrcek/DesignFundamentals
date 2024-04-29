import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Home, About, Projects, Contact } from './pages';

const App = () => {
    return (
        <main className="bg-slate-300/20">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/" element={<About />} />
                    <Route path="/" element={<Projects />} />
                    <Route path="/" element={<Contact />} />
                </Routes>
            </Router>
        </main>
    );
};

export default App;
