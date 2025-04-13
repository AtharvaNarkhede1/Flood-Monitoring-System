
import { Droplets } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Droplets size={24} className="text-white" />
          <h1 className="text-xl font-bold">Aqua Guardian Insight Hub</h1>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:underline">Dashboard</a></li>
            <li><a href="#" className="hover:underline">Analytics</a></li>
            <li><a href="#" className="hover:underline">Settings</a></li>
          </ul>
        </nav>
        
        <div className="md:hidden">
          <button className="p-2">
            <span className="sr-only">Open menu</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
