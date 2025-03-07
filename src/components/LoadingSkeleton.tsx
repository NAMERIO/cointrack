import React from 'react';

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
        <div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-right whitespace-nowrap">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
    </td>
    <td className="px-6 py-4 text-right whitespace-nowrap">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
    </td>
    <td className="px-6 py-4 text-right whitespace-nowrap">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
    </td>
  </tr>
);

export const CoinDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>

      <div className="h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);