import { AuthProvider, useAuth } from './hooks/useAuth';
import Newsfeed from './pages/Newsfeed';
import Login from './pages/Login';
import './index.css';

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Simple routing based on authentication status
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated, show the newsfeed
  return <Newsfeed />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;
