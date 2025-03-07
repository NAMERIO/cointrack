import React from 'react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Disclaimer</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Investment Risk</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Cryptocurrency investments are subject to market risks. The information provided on CryptoTracker is for general informational purposes only and should not be considered as financial advice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">No Financial Advice</h2>
              <p className="text-gray-600 dark:text-gray-300">
                CryptoTracker is not a financial advisor. The information provided through our service is for informational purposes only. We recommend consulting with a qualified financial advisor before making any investment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Data Accuracy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the information presented.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}