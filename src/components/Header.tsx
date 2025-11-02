import {useEffect, useState} from 'react';
import {Search, ChevronDown, HomeIcon} from 'lucide-react';
import { Button } from './ui/button';
import { categories } from '../data/mockData';

interface HeaderProps {
  isVisible: boolean;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function Header({ isVisible, selectedCategory, onCategoryChange }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {

     if (!isVisible) setShowDropdown(false);
  }, [isVisible]);
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {

    onCategoryChange(categoryId);
    setShowDropdown(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-transform duration-300 text-yekanBakh ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">

            {/* Right Side - Category Dropdown */}
            <div className="flex items-center gap-3 relative">
                <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <span className="text-[#FF6B35] text-xl font-black">{currentCategory?.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </Button>
            </div>
          {/* Left Side - Search */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div
            className="fixed top-[52px] right-4 z-50 bg-background border border-border shadow-lg rounded-2xl"
            dir="rtl"
          >
            <div className="py-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full flex items-center justify-right pr-6 pl-14 py-3 hover:bg-gray-100 transition-colors font-semibold ${selectedCategory === category.id ? 'bg-gray-100' : ''}`}
                >
                  <HomeIcon className='w-5 h-5' />
                  <span className={selectedCategory === category.id ? 'text-[#FF6B35] mr-2' : 'mr-2'}>
                    {category.label}
                  </span>

                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
