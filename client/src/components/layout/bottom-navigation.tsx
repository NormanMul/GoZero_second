import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'wouter';

export function BottomNavigation() {
  const [location] = useLocation();

  // Don't show bottom navigation on scanner page
  if (location === '/scanner') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-10 max-w-md mx-auto">
      <div className="flex h-full">
        <Link href="/">
          <a className={`bottom-nav-item ${location === '/' ? 'active' : ''} flex-1 flex flex-col items-center justify-center`}>
            <FontAwesomeIcon icon="home" className="text-lg" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/history">
          <a className={`bottom-nav-item ${location === '/history' ? 'active' : ''} flex-1 flex flex-col items-center justify-center`}>
            <FontAwesomeIcon icon="history" className="text-lg" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <div className="flex-1 flex items-center justify-center">
          <Link href="/scanner">
            <a className="scan-btn w-14 h-14 bg-[#00AA13] rounded-full flex items-center justify-center text-white">
              <FontAwesomeIcon icon="camera" className="text-xl" />
            </a>
          </Link>
        </div>
        <Link href="/map">
          <a className={`bottom-nav-item ${location === '/map' ? 'active' : ''} flex-1 flex flex-col items-center justify-center`}>
            <FontAwesomeIcon icon="map-marked-alt" className="text-lg" />
            <span className="text-xs mt-1">Map</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`bottom-nav-item ${location === '/profile' ? 'active' : ''} flex-1 flex flex-col items-center justify-center`}>
            <FontAwesomeIcon icon="user" className="text-lg" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
