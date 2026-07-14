"use client";
import * as React from "react";

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  discount?: boolean;
}

export function Tab({ text, selected, setSelected, discount }: TabProps) {
  return (
    <button
      type="button"
      onClick={() => setSelected(text)}
      className={`relative rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none border-none outline-none ${
        selected
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >
      <span className="capitalize">{text}</span>
      {discount && (
        <span className="bg-green-100 text-green-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full select-none uppercase tracking-wider">
          Save 10%
        </span>
      )}
    </button>
  );
}
