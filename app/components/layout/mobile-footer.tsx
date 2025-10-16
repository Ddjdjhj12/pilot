import { Home, Search, ShoppingCart, User, Menu } from "lucide-react";

export function MobileFooter() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
      <ul className="flex justify-around items-center h-[64px]">
        <li className="flex flex-col items-center text-sm text-gray-700">
          <Home size={22} />
          <span>Home</span>
        </li>
        <li className="flex flex-col items-center text-sm text-gray-700">
          <Menu size={22} />
          <span>Menu</span>
        </li>
        <li className="flex flex-col items-center text-sm text-gray-700">
          <Search size={22} />
          <span>Search</span>
        </li>
        <li className="flex flex-col items-center text-sm text-gray-700">
          <ShoppingCart size={22} />
          <span>Cart</span>
        </li>
        <li className="flex flex-col items-center text-sm text-gray-700">
          <User size={22} />
          <span>Account</span>
        </li>
      </ul>
    </nav>
  );
}
