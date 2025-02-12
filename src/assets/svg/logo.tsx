// icon:shopping-search | Material Design Icons https://materialdesignicons.com/ | Austin Andrews
import * as React from "react";

function Logo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1em"
            width="1em"
            {...props}
        >
            <path d="M19 6h-2A5 5 0 007 6H5a2 2 0 00-2 2v12a2 2 0 002 2h7.05A6.5 6.5 0 019 16.5a6.4 6.4 0 011.25-3.82A5 5 0 017 8h2a3 3 0 003 3h.06a6.22 6.22 0 012-.84A3 3 0 0015 8h2a4.88 4.88 0 01-.46 2.09 6.5 6.5 0 014.46 3V8a2 2 0 00-2-2M9 6a3 3 0 016 0m4.31 12.9a4.5 4.5 0 10-1.43 1.42L21 23.39 22.39 22m-6.89-3a2.5 2.5 0 112.5-2.5 2.5 2.5 0 01-2.5 2.5z" />
        </svg>
    );
}

export default Logo;
