import React from 'react';

function FilterBar({ filters, setFilters, options }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="input-field"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        {options.map((option) => (
          <select
            key={option.key}
            className="input-field"
            value={filters[option.key]}
            onChange={(e) => setFilters(prev => ({ ...prev, [option.key]: e.target.value }))}
          >
            <option value="">{option.placeholder}</option>
            {option.values.map((value) => (
              <option key={value.value} value={value.value}>
                {value.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
