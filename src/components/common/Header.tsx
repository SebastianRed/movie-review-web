import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold text-gray-800">MovieReviews</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Inicio
            </Link>
            
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Buscar
            </Link>
            
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Mis Reviews
            </Link>

            {/* User info */}
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-300">
              <span className="text-gray-700 font-medium">
                {user?.username}
              </span>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;