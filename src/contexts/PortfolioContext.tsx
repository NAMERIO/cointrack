import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface PortfolioAsset {
  id: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: Date;
}

interface PriceAlert {
  id: string;
  coinId: string;
  price: number;
  condition: 'above' | 'below';
  active: boolean;
}

interface PortfolioContextType {
  assets: PortfolioAsset[];
  alerts: PriceAlert[];
  addAsset: (asset: Omit<PortfolioAsset, 'id'>) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  updateAsset: (assetId: string, updates: Partial<PortfolioAsset>) => Promise<void>;
  addAlert: (alert: Omit<PriceAlert, 'id'>) => Promise<void>;
  removeAlert: (alertId: string) => Promise<void>;
  toggleAlert: (alertId: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    if (!user) {
      setAssets([]);
      setAlerts([]);
      return;
    }

    const loadPortfolio = async () => {
      const userDoc = doc(db, 'portfolios', user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAssets(data.assets || []);
        setAlerts(data.alerts || []);
      } else {
        await setDoc(userDoc, { assets: [], alerts: [] });
      }
    };

    loadPortfolio();
  }, [user]);

  const addAsset = async (asset: Omit<PortfolioAsset, 'id'>) => {
    if (!user) return;

    const newAsset = {
      ...asset,
      id: crypto.randomUUID()
    };

    const userDoc = doc(db, 'portfolios', user.uid);
    await updateDoc(userDoc, {
      assets: arrayUnion(newAsset)
    });

    setAssets(prev => [...prev, newAsset]);
  };

  const removeAsset = async (assetId: string) => {
    if (!user) return;

    const assetToRemove = assets.find(a => a.id === assetId);
    if (!assetToRemove) return;

    const userDoc = doc(db, 'portfolios', user.uid);
    await updateDoc(userDoc, {
      assets: arrayRemove(assetToRemove)
    });

    setAssets(prev => prev.filter(a => a.id !== assetId));
  };

  const updateAsset = async (assetId: string, updates: Partial<PortfolioAsset>) => {
    if (!user) return;

    const updatedAssets = assets.map(asset =>
      asset.id === assetId ? { ...asset, ...updates } : asset
    );

    const userDoc = doc(db, 'portfolios', user.uid);
    await updateDoc(userDoc, { assets: updatedAssets });

    setAssets(updatedAssets);
  };

  const addAlert = async (alert: Omit<PriceAlert, 'id'>) => {
    if (!user) return;

    const newAlert = {
      ...alert,
      id: crypto.randomUUID()
    };

    const userDoc = doc(db, 'portfolios', user.uid);
    await updateDoc(userDoc, {
      alerts: arrayUnion(newAlert)
    });

    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = async (alertId: string) => {
    if (!user) return;

    const alertToRemove = alerts.find(a => a.id === alertId);
    if (!alertToRemove) return;

    const userDoc = doc(db, 'portfolios', user.uid);
    await updateDoc(userDoc, {
      alerts: arrayRemove(alertToRemove)
    });

    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const toggleAlert = async (alertId: string) => {
    if (!user) return;

    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, active: !alert.active } : alert
    );

    const userDoc = doc(db, 'portfolios', user.uid);
    await updateDoc(userDoc, { alerts: updatedAlerts });

    setAlerts(updatedAlerts);
  };

  const value = {
    assets,
    alerts,
    addAsset,
    removeAsset,
    updateAsset,
    addAlert,
    removeAlert,
    toggleAlert
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};