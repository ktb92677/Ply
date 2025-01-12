import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Building2, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { PracticeSelector } from './PracticeSelector';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        {/* Brand */}
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-xl font-bold">Ply Health</span>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1 p-4">
          <Link
            to="/"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
              isActive('/') ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/practices"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
              isActive('/practices') ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Building2 className="h-5 w-5" />
            <span>Practices</span>
          </Link>
          <Link
            to="/providers"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
              isActive('/providers') ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Users className="h-5 w-5" />
            <span>Providers</span>
          </Link>
          <Link
            to="/enrollments"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
              isActive('/enrollments') ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <FileText className="h-5 w-5" />
            <span>Enrollments</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <header className="sticky top-0 z-30 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <PracticeSelector />
          </div>
        </header>

        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
} 