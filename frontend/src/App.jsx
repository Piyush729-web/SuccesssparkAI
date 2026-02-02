import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import Analytics from './pages/Home/Analytics';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep.jsx';
import UserProvider from './context/userContext.jsx';

function App() {

  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/*default route*/}
            <Route path="/" element={<LandingPage />} />


            {/*Dashboard route*/}
            <Route path="/dashboard" element={<Dashboard />} />

            {/*Analytics route*/}
            <Route path="/analytics" element={<Analytics />} />

            {/*Interview Preparation route*/}
            <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
          </Routes>
        </Router>

        <Toaster
          toastOptions={
            {
              className: '',
              style: {
                fontSize: '13px',
              },
            }
          }
        />
      </div>
    </UserProvider>
  )
}

export default App
