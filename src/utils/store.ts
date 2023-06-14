import { create } from 'zustand';

export interface AuthProps {
  idInstance: string;
  apiTokenInstance: string;
}

export interface Contact {
  id: string;
  name: string;
  type: 'user' | 'group';
}

export interface Auth {
  stateInstance: 'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting';
  idInstance: string;
  apiTokenInstance: string;
}
export interface ZState {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isModal: boolean;
  setIsModal: (value: boolean) => void;
  selectedChat: string;
  setSelectedChat: (value: string) => void;
  auth: Auth;
  setAuth: (value: Auth) => void;
  contacts: Contact[];
  setContacts: (value: Contact[]) => void;
}

const useStore = create<ZState>((set) => ({
  isLoading: false,
  isModal: false,
  selectedChat: '',
  allChats: [],
  contacts: [],
  auth: {
    stateInstance: 'notAuthorized',
    idInstance: '',
    apiTokenInstance: '',
  },

  setContacts: (value: Contact[]) =>
    set((state: ZState) => ({
      ...state,
      contacts: value,
    })),

  setAuth: (value: Auth) =>
    set((state: ZState) => ({
      ...state,
      auth: value,
    })),

  setIsLoading: (value: boolean) =>
    set((state: ZState) => ({
      ...state,
      isLoading: value,
    })),

  setIsModal: (value: boolean) =>
    set((state: ZState) => ({
      ...state,
      isModal: value,
    })),

  setSelectedChat: (value: string) =>
    set((state: ZState) => ({
      ...state,
      selectedChat: value,
    })),
}));

export default useStore;
