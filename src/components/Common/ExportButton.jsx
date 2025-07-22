import React from 'react';
import { generateCSV, downloadFile } from '../../utils/reportGenerator';

function ExportButton({ data, headers, filename, className }) {
  const handleExport = () => {
    const csv = generateCSV(data, headers);
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  };

  return (
    <button
      onClick={handleExport}
      className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ${className}`}
    >
      Export CSV
    </button>
  );
}

export default ExportButton;
