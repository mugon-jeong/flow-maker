'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';

interface ModalProviderProps {
  children: ReactNode;
}

export type ModalData = object;

interface ModalContextProps {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: ReactNode, fetchData?: () => Promise<unknown>) => void;
  setClose: () => void;
}

export const ModalContext = createContext<ModalContextProps>({
  data: {},
  isOpen: false,
  setOpen: (modal: ReactNode, fetchData?: () => Promise<unknown>) => {},
  setClose: () => {},
});

export const ModalProvider = ({children}: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<ReactNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const setOpen = async (
    modal: ReactNode,
    fetchData?: () => Promise<unknown>,
  ) => {
    if (modal) {
      if (fetchData) {
        setData({...data, ...((await fetchData()) || {})});
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };
  const setClose = () => {
    setData({});
    setIsOpen(false);
  };
  if (!isMounted) return null;
  return (
    <ModalContext.Provider
      value={{
        data,
        setOpen,
        setClose,
        isOpen,
      }}
    >
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
