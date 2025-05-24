import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'wouter';

export function QuickActions() {
  return (
    <div className="p-4">
      <h2 className="text-base font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-2">
        <Link href="/scanner">
          <a className="bg-white gozero-shadow rounded-xl p-3 flex flex-col items-center">
            <div className="w-10 h-10 mb-2 rounded-full bg-[#00AA13] bg-opacity-10 flex items-center justify-center">
              <FontAwesomeIcon icon="camera" className="text-[#00AA13]" />
            </div>
            <span className="text-xs font-medium">Scan Item</span>
          </a>
        </Link>
        <Link href="/pickup">
          <a className="bg-white gozero-shadow rounded-xl p-3 flex flex-col items-center">
            <div className="w-10 h-10 mb-2 rounded-full bg-[#3D7CF4] bg-opacity-10 flex items-center justify-center">
              <FontAwesomeIcon icon="motorcycle" className="text-[#3D7CF4]" />
            </div>
            <span className="text-xs font-medium">Schedule Pickup</span>
          </a>
        </Link>
        <Link href="/map">
          <a className="bg-white gozero-shadow rounded-xl p-3 flex flex-col items-center">
            <div className="w-10 h-10 mb-2 rounded-full bg-[#FF5252] bg-opacity-10 flex items-center justify-center">
              <FontAwesomeIcon icon="map-marker-alt" className="text-[#FF5252]" />
            </div>
            <span className="text-xs font-medium">Find Centers</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
