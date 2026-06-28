import React from "react";
import logo from "@/assets/logo.svg";
import { Search } from "lucide-react";

const LogoSearch = ({
                        onClick,
                        placeholder = "Find anything",
                        className = ""
                    }) => {
    return (
        <div
            onClick={() => onClick?.()}
            className={`
        flex
        items-center
        justify-between
        w-[260px]
        h-[42px]
        border
        rounded-full
        px-4
        cursor-pointer
        hover:border-orange-400
        hover:shadow-sm
        transition
        bg-white
        ${className}
      `}
        >
            {/* Left side */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 flex items-center mt-2">
                Find in
              </span>

              <img src={logo} alt="logo" className="h-5 w-auto opacity-70" />
            </div>

            {/* Right side */}
            <Search className="w-5 h-5 text-gray-400 flex items-center" />
        </div>
    );
};

export default LogoSearch;