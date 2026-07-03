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

              <img src={logo} alt="logo" className="h-5 w-auto opacity-70" />
              <span className="text-[#ff6501ff] mt-2">
                Find in Forecasters
              </span>

            </div>

            {/* Right side */}
            <Search className="w-5 h-5 text-[#ff6501ff] items-center" />
        </div>
    );
};

export default LogoSearch;