import create, { State } from 'zustand'

export interface Safe extends State {
  selectedSafe: string | null
  isModuleEnabled: boolean
  setIsModuleEnabled: (isEnabled: boolean) => void
  // safetransaction id set 
  // use safe store 
}

export const useSafeStore = create<Safe>((set) => ({
  selectedSafe: null,
  isModuleEnabled: false,
  setIsModuleEnabled: (isModuleEnabled) => set({ isModuleEnabled }),
  // use safe stpre 
}))
