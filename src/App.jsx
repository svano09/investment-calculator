import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, PiggyBank, History, LogOut, User, AlertCircle, CheckCircle } from 'lucide-react';
import DCAForm from './components/DCAForm';
import CompoundForm from './components/CompoundForm';
import RetirementForm from './components/RetirementForm';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryPanel from './components/HistoryPanel';
import LoginModal from './components/LoginModal';
import api from './config/api';  

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dca');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadCalculations();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const res = await fetch('https://investment-calculator-2-vnxg.onrender.com/api/auth/me', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const loadCalculations = async () => {
    try {
      const data = await api.getCalculations();
      setCalculations(data.calculations || []);
    } catch (error) {
      console.error('Failed to load calculations:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCalculate = async (type, inputs) => {
    setLoading(true);
    try {
      const data = await api.calculate(type, inputs);
      
      if (data.success) {
        setResults(data.results);
        setChartData(data.chartData);
        
        if (data.saved) {
          showNotification('Calculation saved successfully!');
          loadCalculations();
        } else {
          showNotification('Calculated! Login to save history.', 'info');
        }
      } else {
        showNotification(data.message || 'Calculation failed', 'error');
      }
    } catch (error) {
      showNotification('Calculation failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      showNotification(`Welcome back, ${email}!`);
      setShowLoginModal(false);
      loadCalculations();
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const data = await api.register(email, password);
      setUser(data.user);
      showNotification(`Welcome, ${email}!`);
      setShowLoginModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      setCalculations([]);
      setResults(null);
      setChartData(null);
      showNotification('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoadCalculation = (calc) => {
    setActiveTab(calc.type);
    setResults(calc.results);
    setChartData(calc.chartData);
    setShowHistory(false);
    showNotification('Calculation loaded!');
  };

  const handleDeleteCalculation = async (id) => {
    try {
      await api.deleteCalculation(id);
      setCalculations(calculations.filter(c => c._id !== id));
      showNotification('Calculation deleted');
    } catch (error) {
      showNotification('Failed to delete', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white animate-slide-in`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Investment Calculator
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {user ? user.email : 'Plan your financial future'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all hover:scale-105"
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">History</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Guest Banner */}
        {!user && (
          <div className="mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">🎯 Start Planning Your Future</h2>
                <p className="text-indigo-100 text-sm mb-1">
                  Use all calculators without login, but calculations won't be saved.
                </p>
                <p className="text-indigo-200 text-xs">
                  Create a free account to track your financial journey!
                </p>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveTab('dca')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'dca'
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calculator className="w-5 h-5" />
                  <span className="hidden sm:inline">DCA</span>
                </button>
                <button
                  onClick={() => setActiveTab('compound')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'compound'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="hidden sm:inline">Compound</span>
                </button>
                <button
                  onClick={() => setActiveTab('retirement')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'retirement'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <PiggyBank className="w-5 h-5" />
                  <span className="hidden sm:inline">Retirement</span>
                </button>
              </div>
            </div>

            {/* Forms and Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Input Parameters
                </h3>
                
                {activeTab === 'dca' && <DCAForm onCalculate={handleCalculate} />}
                {activeTab === 'compound' && <CompoundForm onCalculate={handleCalculate} />}
                {activeTab === 'retirement' && <RetirementForm onCalculate={handleCalculate} />}

                {!user && results && (
                  <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-800 mb-1">
                      💾 Save This Calculation?
                    </p>
                    <p className="text-xs text-amber-700 mb-2">
                      Login to track your calculations over time
                    </p>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="text-xs bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all hover:scale-105 font-medium shadow-sm"
                    >
                      Login Now
                    </button>
                  </div>
                )}
              </div>

              {/* Results Display */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Results
                </h3>
                <ResultsDisplay
                  type={activeTab}
                  results={results}
                  chartData={chartData}
                />
              </div>
            </div>

            {/* Mobile History */}
            {showHistory && (
              <div className="lg:hidden bg-white rounded-2xl shadow-lg p-6">
                <HistoryPanel
                  calculations={calculations}
                  onDelete={handleDeleteCalculation}
                  onLoad={handleLoadCalculation}
                  loading={loading}
                  isLoggedIn={!!user}
                />
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <HistoryPanel
                calculations={calculations}
                onDelete={handleDeleteCalculation}
                onLoad={handleLoadCalculation}
                loading={loading}
                isLoggedIn={!!user}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Investment Calculator
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Full Stack Financial Planning Dashboard
            </p>
            <p className="text-xs text-gray-500">
              React + Recharts • Node.js + Express • MongoDB
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs">
              {user ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Logged in as {user.email}</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Guest Mode - Calculations not saved</span>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;