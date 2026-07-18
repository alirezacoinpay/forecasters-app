import React from "react";
import logo from "@/assets/logo.svg";
import { Search } from "lucide-react";

interface LogoSearchProps {
    onClick?: () => void;
    placeholder?: string;
    className?: string;
    inputMode?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRef?: React.Ref<HTMLInputElement>;
}

const LogoSearch = ({
                        onClick,
                        placeholder = "Find anything",
                        className = "",
                        inputMode = false,
                        value,
                        onChange,
                        onKeyDown,
                        inputRef,
                    }: LogoSearchProps) => {
    return (
        <div
            onClick={() => !inputMode && onClick?.()}
            className={`
        flex
        items-center
        justify-between
        h-[42px]
        border
        rounded-full
        px-4
        ${inputMode ? '' : 'cursor-pointer hover:border-orange-400 hover:shadow-sm'}
        transition
        bg-white
        ${className}
      `}
        >
            {/* Left side */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img src={logo} alt="logo" className="h-5 w-auto opacity-70 shrink-0" />
              {inputMode ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-sm text-[#ff6501ff] placeholder:text-[#ff6501ff]/50 min-w-0 mt-1.5"
                />
              ) : (
                <span className="text-[#ff6501ff] mt-2">
                  Find in Forecasters
                </span>
              )}
            </div>

            {/* Right side */}
            <Search className="w-5 h-5 text-[#ff6501ff] items-center shrink-0" />
        </div>
    );
};

export default LogoSearch;