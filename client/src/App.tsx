import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { cn } from './lib/utils';
import { PracticeList } from './components/PracticeList';
import { GroupInformation } from './components/GroupInformation';
import { Info, Home, MapPin, UserRound, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { PracticeSelector } from './components/PracticeSelector';
import { TaskList } from './components/TaskList';
import { LocationList } from './components/LocationList';
import { ProviderList } from './components/ProviderList';
import { EnrollmentList } from './components/EnrollmentList';

function Layout({ 
  children, 
  selectedPracticeId, 
  onPracticeSelect,
  practicesRefreshKey = 0
}: { 
  children: React.ReactNode;
  selectedPracticeId: string | null;
  onPracticeSelect: (practiceId: string) => void;
  practicesRefreshKey?: number;
}) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-semibold">Ply Health</h1>
          </div>
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive("/") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/group-info"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive("/group-info") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Info className="h-5 w-5" />
              <span>Group Information</span>
            </Link>
            <Link
              to="/locations"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive("/locations") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <MapPin className="h-5 w-5" />
              <span>Locations</span>
            </Link>
            <Link
              to="/providers"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive("/providers") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <UserRound className="h-5 w-5" />
              <span>Providers</span>
            </Link>
            <Link
              to="/enrollments"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive("/enrollments") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Enrollments</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header with Practice Selector */}
          <div className="h-16 bg-white shadow-sm px-6 flex items-center justify-end border-b">
            <PracticeSelector 
              selectedPracticeId={selectedPracticeId} 
              onPracticeSelect={onPracticeSelect}
              refreshKey={practicesRefreshKey}
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedPracticeId, setSelectedPracticeId] = useState<string | null>(null);
  const [practicesRefreshKey, setPracticesRefreshKey] = useState(0);

  const handlePracticeUpdate = () => {
    setPracticesRefreshKey(key => key + 1);
  };

  return (
    <Router>
      <Layout 
        selectedPracticeId={selectedPracticeId} 
        onPracticeSelect={setSelectedPracticeId}
        practicesRefreshKey={practicesRefreshKey}
      >
        <Routes>
          <Route path="/" element={
            selectedPracticeId ? 
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Tasks</h2>
                <TaskList practiceId={selectedPracticeId} />
              </div> : 
              <div className="p-6">Please select a practice first</div>
          } />
          <Route path="/group-info" element={
            selectedPracticeId ? 
              <div className="p-6">
                <GroupInformation 
                  practiceId={selectedPracticeId} 
                  onPracticeUpdate={handlePracticeUpdate}
                />
              </div> : 
              <div className="p-6">Please select a practice first</div>
          } />
          <Route path="/locations" element={
            selectedPracticeId ? 
              <LocationList practiceId={selectedPracticeId} /> : 
              <div className="p-6">Please select a practice first</div>
          } />
          <Route path="/providers" element={
            selectedPracticeId ? 
              <ProviderList practiceId={selectedPracticeId} /> : 
              <div className="p-6">Please select a practice first</div>
          } />
          <Route path="/enrollments" element={
            selectedPracticeId ? 
              <EnrollmentList practiceId={selectedPracticeId} /> : 
              <div className="p-6">Please select a practice first</div>
          } />
          <Route path="/practices" element={<PracticeList onPracticeSelect={setSelectedPracticeId} />} />
        </Routes>
      </Layout>
    </Router>
  );
}
