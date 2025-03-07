import { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Plus, Trash2, Bell, BellOff } from 'lucide-react';
import { fetchCoinData, type CoinData } from '../services/api';

export default function Portfolio() {
  const { assets, alerts, addAsset, removeAsset, addAlert, removeAlert, toggleAlert } = usePortfolio();
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');

  const handleAddAsset = async () => {
    if (!selectedCoin || !amount || !purchasePrice) return;

    await addAsset({
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate: new Date()
    });

    setShowAddAsset(false);
    setSelectedCoin(null);
    setAmount('');
    setPurchasePrice('');
  };

  const handleAddAlert = async () => {
    if (!selectedCoin || !alertPrice) return;

    await addAlert({
      coinId: selectedCoin.id,
      price: parseFloat(alertPrice),
      condition: alertCondition,
      active: true
    });

    setShowAddAlert(false);
    setSelectedCoin(null);
    setAlertPrice('');
    setAlertCondition('above');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddAsset(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Asset
            </button>
            <button
              onClick={() => setShowAddAlert(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Bell size={20} />
              Add Alert
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Assets</h2>
          {assets.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No assets added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map(asset => (
                <div key={asset.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{asset.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Amount: {asset.amount}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Purchase Price: ${asset.purchasePrice}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Price Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No alerts set.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{alert.coinId}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {alert.condition === 'above' ? 'Above' : 'Below'} ${alert.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`${
                          alert.active ? 'text-green-500' : 'text-gray-400'
                        } hover:text-green-600`}
                      >
                        {alert.active ? <Bell size={20} /> : <BellOff size={20} />}
                      </button>
                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}