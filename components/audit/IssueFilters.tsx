import { Filter, Search } from 'lucide-react';

export type FilterStatus = 'ALL' | 'CRITICAL' | 'WARNING' | 'PASS';

interface IssueFiltersProps {
  categories: string[];
  selectedStatus: FilterStatus;
  selectedCategory: string;
  searchQuery: string;
  onStatusChange: (status: FilterStatus) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export default function IssueFilters({
  categories,
  selectedStatus,
  selectedCategory,
  searchQuery,
  onStatusChange,
  onCategoryChange,
  onSearchChange
}: IssueFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 sticky top-4 z-20 flex flex-col lg:flex-row gap-4">
      
      {/* Search Bar */}
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search issues, descriptions, or URLs..."
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-9 p-2.5 outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Status Pills */}
        <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100 overflow-x-auto hide-scrollbar shrink-0">
          <Filter size={16} className="text-gray-400 mx-1 hidden sm:block" />
          {(['ALL', 'CRITICAL', 'WARNING', 'PASS'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {status === 'ALL' ? 'All' : status === 'PASS' ? 'Passed' : status === 'WARNING' ? 'Warnings' : 'Critical'}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full sm:w-auto p-2.5 appearance-none outline-none cursor-pointer shrink-0"
        >
          <option value="ALL">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

    </div>
  );
}
