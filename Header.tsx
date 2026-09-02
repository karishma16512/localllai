import {
  Scale
} from 'lucide-react';

interface HeaderProps {
  onOpenComparison: () => void;
}

export default function Header({
  onOpenComparison,
}: HeaderProps) {
  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-end">
        {/* Only Compare Businesses Button in Top Header */}
        <button
          onClick={onOpenComparison}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer shadow-xs active:scale-95"
          title="Compare Dairy vs Grocery/Retail side-by-side"
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Compare Businesses</span>
        </button>
      </div>
    </header>
  );
}

