'use client';

import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';

// Types for MiniKit integration
interface MiniKitContextType {
  isInstalled: boolean;
  isWorldApp: boolean;
  walletAddress: string | null;
  username: string | null;
  isAuthenticated: boolean;
  authenticateWallet: () => Promise<boolean>;
  verifyUser: (action: string) => Promise<boolean>;
  payForPremium: (amount: string, token: 'WLD' | 'USDC') => Promise<boolean>;
}

interface MiniKitProviderProps {
  children: ReactNode;
  appId?: string;
}

// Mock MiniKit for development when not in World App
const mockMiniKit = {
  install: (appId: string) => console.log('Mock MiniKit installed with appId:', appId),
  isInstalled: () => false,
  user: { username: null },
  walletAddress: null,
  commandsAsync: {
    walletAuth: async (payload: any) => ({
      commandPayload: null,
      finalPayload: { status: 'error', error: 'Not in World App' }
    }),
    verify: async (payload: any) => ({
      finalPayload: { status: 'error', error: 'Not in World App' }
    }),
    pay: async (payload: any) => ({
      finalPayload: { status: 'error', error: 'Not in World App' }
    })
  }
};

const MiniKitContext = createContext<MiniKitContextType>({
  isInstalled: false,
  isWorldApp: false,
  walletAddress: null,
  username: null,
  isAuthenticated: false,
  authenticateWallet: async () => false,
  verifyUser: async () => false,
  payForPremium: async () => false,
});

export const useMiniKit = () => useContext(MiniKitContext);

export default function MiniKitProvider({ 
  children, 
  appId = 'app_love_actually_game_couples_therapy' 
}: MiniKitProviderProps) {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isWorldApp, setIsWorldApp] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [MiniKit, setMiniKit] = useState<any>(mockMiniKit);

  useEffect(() => {
    const initializeMiniKit = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { MiniKit: WorldMiniKit } = await import('@worldcoin/minikit-js');
        
        WorldMiniKit.install(appId);
        const installed = WorldMiniKit.isInstalled();
        
        setMiniKit(WorldMiniKit);
        setIsInstalled(installed);
        setIsWorldApp(installed);
        
        if (installed) {
          // Check if user is already authenticated
          const storedWallet = WorldMiniKit.walletAddress;
          const storedUsername = WorldMiniKit.user?.username;
          
          if (storedWallet) {
            setWalletAddress(storedWallet);
            setUsername(storedUsername);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error);
        setIsInstalled(false);
        setIsWorldApp(false);
      }
    };

    initializeMiniKit();
  }, [appId]);

  const authenticateWallet = async (): Promise<boolean> => {
    if (!isInstalled) {
      console.log('MiniKit not installed - user not in World App');
      return false;
    }

    try {
      // Get nonce from backend
      const nonceResponse = await fetch('/api/minikit/nonce', { method: 'GET' });
      const { nonce } = await nonceResponse.json();

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'Sign in to Love, Actually... The Game - Transform your relationship with Dr. Marcie!',
      });

      if (finalPayload.status === 'success') {
        // Verify authentication with backend
        const verifyResponse = await fetch('/api/minikit/verify-siwe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload: finalPayload, nonce }),
        });

        const verification = await verifyResponse.json();
        
        if (verification.isValid) {
          setWalletAddress(finalPayload.address);
          setUsername(MiniKit.user?.username || null);
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch (error) {
      console.error('Wallet authentication failed:', error);
    }

    return false;
  };

  const verifyUser = async (action: string): Promise<boolean> => {
    if (!isInstalled || !isAuthenticated) return false;

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action,
        signal: `love-actually-${Date.now()}`,
        verification_level: 'orb' as any, // World ID Orb verification for human uniqueness
      });

      if (finalPayload.status === 'success') {
        // Verify proof with backend
        const verifyResponse = await fetch('/api/minikit/verify-proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: finalPayload,
            action,
            signal: `love-actually-${Date.now()}`,
          }),
        });

        const verification = await verifyResponse.json();
        return verification.success;
      }
    } catch (error) {
      console.error('User verification failed:', error);
    }

    return false;
  };

  const payForPremium = async (amount: string, token: 'WLD' | 'USDC'): Promise<boolean> => {
    if (!isInstalled || !isAuthenticated) return false;

    try {
      // Initialize payment with backend
      const initResponse = await fetch('/api/minikit/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, token }),
      });
      
      const { id, recipientAddress } = await initResponse.json();

      const { finalPayload } = await MiniKit.commandsAsync.pay({
        reference: id,
        to: recipientAddress,
        tokens: [{
          symbol: token,
          token_amount: amount,
        }],
        description: 'Love, Actually... The Game - Premium Upgrade',
      });

      if (finalPayload.status === 'success') {
        // Confirm payment with backend
        const confirmResponse = await fetch('/api/minikit/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload),
        });

        const confirmation = await confirmResponse.json();
        return confirmation.success;
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }

    return false;
  };

  const contextValue: MiniKitContextType = {
    isInstalled,
    isWorldApp,
    walletAddress,
    username,
    isAuthenticated,
    authenticateWallet,
    verifyUser,
    payForPremium,
  };

  return (
    <MiniKitContext.Provider value={contextValue}>
      <div data-minikit-installed={isInstalled} data-world-app={isWorldApp}>
        {children}
      </div>
    </MiniKitContext.Provider>
  );
}