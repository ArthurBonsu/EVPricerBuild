import create, { State } from 'zustand';

export interface SafeStore extends State {
  safeAddress: string;
  ownersAddress: string[];
  contractAddress: string;
  isPendingSafeCreation: boolean;
  pendingSafeData: any; // or a more specific type if needed
  isPendingAddOwner: boolean;
  pendingAddOwnerData: any; // or a more specific type if needed
  setSafeAddress: (safeAddress: SafeStore['safeAddress']) => void;
  setOwnersAddress: (ownersAddress: SafeStore['ownersAddress']) => void;
  setContractAddress: (contractAddress: SafeStore['contractAddress']) => void;
  setIsPendingSafeCreation: (isPendingSafeCreation: SafeStore['isPendingSafeCreation']) => void;
  setPendingSafeData: (pendingSafeData: SafeStore['pendingSafeData']) => void;
  setIsPendingAddOwner: (isPendingAddOwner: SafeStore['isPendingAddOwner']) => void;
  setPendingAddOwnerData: (pendingAddOwnerData: SafeStore['pendingAddOwnerData']) => void;
  setSafeStore: (values: { safeAddress: string; contractAddress: string }) => void;
}

export const INITIAL_STATE = {
  safeAddress: '',
  ownersAddress: [],
  contractAddress: '',
  isPendingSafeCreation: false,
  pendingSafeData: null,
  isPendingAddOwner: false,
  pendingAddOwnerData: null,
};

export const useSafeStore = create<SafeStore>((set) => ({
  ...INITIAL_STATE,
  setSafeAddress: (safeAddress) => set({ safeAddress }),
  setOwnersAddress: (ownersAddress) => set({ ownersAddress }),
  setContractAddress: (contractAddress) => set({ contractAddress }),
  setIsPendingSafeCreation: (isPendingSafeCreation) => set({ isPendingSafeCreation }),
  setPendingSafeData: (pendingSafeData) => set({ pendingSafeData }),
  setIsPendingAddOwner: (isPendingAddOwner) => set({ isPendingAddOwner }),
  setPendingAddOwnerData: (pendingAddOwnerData) => set({ pendingAddOwnerData }),
  setSafeStore: (values) => set({ ...values, ownersAddress: INITIAL_STATE.ownersAddress }),
}));
