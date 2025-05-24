import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'wouter';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
  onBackClick?: () => void;
  showUserIcon?: boolean;
  showNotification?: boolean;
}

export function AppHeader({
  title = 'GoZero',
  showBackButton = false,
  backUrl = '/',
  onBackClick,
  showUserIcon = true,
  showNotification = true,
}: AppHeaderProps) {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        {showBackButton ? (
          <button onClick={handleBackClick} className="mr-2">
            <FontAwesomeIcon icon="arrow-left" className="text-dark" />
          </button>
        ) : null}
        <div className={showBackButton ? "text-dark font-bold" : "text-[#00AA13] font-bold text-xl"}>
          {title}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {showNotification && (
          <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
            <FontAwesomeIcon icon="bell" className="text-[#757575]" />
          </div>
        )}
        {showUserIcon && (
          <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
            <FontAwesomeIcon icon="user" className="text-[#757575]" />
          </div>
        )}
      </div>
    </header>
  );
}
