"use client";

import Link from "next/link";
import Image from "next/image";
import { Pill, ShoppingCart, Home } from 'lucide-react';

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full text-white p-4 z-50 backdrop-blur-md bg-black/70 transition-colors duration-300 flex justify-center items-center">
        {/* Logo a la izquierda */}
        <div className="absolute left-4 flex items-center gap-2">
          <Image
            src="https://i.pinimg.com/474x/e8/65/bf/e865bffe00e4911cc1a7fc90de8d382a.jpg"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold hidden sm:block">MarketLab</span>
        </div>

        {/* Enlaces responsivos con íconos */}
        <ul className="flex flex-row justify-center items-center gap-10">
          {[
            { href: "/", label: "Inicio", icon: <Home className="w-5 h-5 sm:hidden" /> },
            { href: "/medicamentos", label: "Medicamentos", icon: <Pill className="w-5 h-5 sm:hidden" /> },
            { href: "/detalle", label: "Detalle", icon: <ShoppingCart className="w-5 h-5 sm:hidden" /> },
          ].map(({ href, label, icon }) => (
            <li key={href} className="relative cursor-pointer flex items-center h-10">
              <Link
                href={href}
                className="relative text-white text-lg font-medium px-2 py-1 nav-link flex items-center gap-2"
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        a.nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: white;
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.3s ease;
          z-index: 10;
        }

        a.nav-link:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </>
  );
}
