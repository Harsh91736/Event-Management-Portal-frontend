import React from 'react';

function PageHeader({ title, description, action }) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            )}
          </div>
          {action && (
            <div className="ml-4">{action}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
