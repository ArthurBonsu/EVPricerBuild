import create, { State } from 'zustand';

export interface SafeStore extends State {
  safeAddress: string;
  ownersAddress: string[];
  contractAddress: string;
  setSafeAddress: (safeAddress: SafeStore['safeAddress']) => void;
  setOwnersAddress: (ownersAddress: SafeStore['ownersAddress']) => void;
  setContractAddress: (contractAddress: SafeStore['contractAddress']) => void;
  setSafeStore: (values: Omit<SafeStore, 'setSafeAddress' | 'setOwnersAddress' | 'setContractAddress' | 'setSafeStore'>) => void;
}

export const INITIAL_STATE = {
  safeAddress: '',
  ownersAddress: [],
  contractAddress: '',
};

export const useSafeStore = create<SafeStore>((set) => ({
  ...INITIAL_STATE,
  setSafeAddress: (safeAddress) => set({ safeAddress }),
  setOwnersAddress: (ownersAddress) => set({ ownersAddress }),
  setContractAddress: (contractAddress) => set({ contractAddress }),
  setSafeStore: (values) => set(values),
}));
