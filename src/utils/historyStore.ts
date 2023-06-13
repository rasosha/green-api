import { create } from 'zustand';
import { getContactInfo } from './apiCalls';
import { Auth } from './store';

export interface ChatHistory {
  chatId: string;
  avatar?: string;
  name?: string;
  history?: IMessage[];
  notification?: boolean;
}
export interface IExtendedTextMessage {
  description?: string;
  forwardingScore?: string;
  isForwarded?: string;
  jpegThumbnail?: string;
  previewType?: string;
  text?: string;
  title?: string;
}

export interface IMessage {
  chatId?: string;
  extendedTextMessage?: IExtendedTextMessage;
  idMessage?: string;
  sendByApi?: boolean;
  statusMessage?: string;
  textMessage?: string;
  timestamp?: number;
  type?: 'outgoing' | 'incoming';
  typeMessage?: string;
}

export interface Notification {
  body: {
    idMessage: string;
    senderData: {
      chatId: string;

    },
    messageData: {
      textMessageData: {
        textMessage: string;
      },
      typeMessage: string
    },
    timestamp: number
  },
  receiptId: number
}

export interface HState {
  allChats: ChatHistory[]
  updateChatHistory: ({ chatId, history }: ChatHistory) => void;
  addChat: (auth: Auth, { chatId }: ChatHistory) => void;
  removeChat: ({ chatId }: ChatHistory) => void;
  addNotificationToChat: ({ chatId }: ChatHistory) => void;
  removeNotificationFromChat: ({ chatId }: ChatHistory) => void;
}

const useHistoryStore = create<HState>((set, get) => ({
  allChats: localStorage.allChats ? JSON.parse(localStorage.allChats) : [],
  removeChat: ({ chatId }: ChatHistory) => {
    const tempAllChats = get().allChats;
    const newArr = tempAllChats.filter((chat) => chat.chatId !== chatId)
    try {
      localStorage.setItem('allChats', JSON.stringify(newArr.map((item) => { return { chatId: item.chatId, name: item.name, avatar: item.avatar } })));
    } catch (err) {
      console.log('err :>> ', err);
    }
    set((state: HState) => ({
      ...state,
      allChats: newArr,
    }))
  },

  updateChatHistory: ({ chatId, history = [] }: ChatHistory) => {
    const tempAllChats = get().allChats;
    const newArr = tempAllChats.map((chat) => {
      if (chat.chatId === chatId) {
        const chatHistory = chat.history ? chat.history : []
        return {
          ...chat,
          history: [...history, ...chatHistory]
        }
      }
      else return chat
    })

    set((state: HState) => ({
      ...state,
      allChats: newArr,
    }))
  },

  addChat: async (auth: Auth, { chatId }: ChatHistory) => {
    const tempAllChats = get().allChats;
    const contactInfo = await getContactInfo(auth, chatId);
    tempAllChats.push(contactInfo)
    console.log('contactInfo :>> ', contactInfo);
    try {
      localStorage.setItem('allChats', JSON.stringify(tempAllChats.map((item) => { return { chatId: item.chatId, name: item.name, avatar: item.avatar } })));
    } catch (err) {
      console.log('err :>> ', err);
    }
    set((state: HState) => ({
      ...state,
      allChats: tempAllChats,
    }))
  },

  addNotificationToChat: ({ chatId }: ChatHistory) => {
    const tempAllChats = get().allChats;
    const newArr = tempAllChats.map((chat) => {
      if (chat.chatId === chatId) {
        return {
          ...chat,
          notification: true,
        }
      }
      else return chat
    })

    set((state: HState) => ({
      ...state,
      allChats: newArr,
    }))
  },

  removeNotificationFromChat: ({ chatId }: ChatHistory) => {
    const tempAllChats = get().allChats;
    const newArr = tempAllChats.map((chat) => {
      if (chat.chatId === chatId) {
        return {
          ...chat,
          notification: false,
        }
      }
      else return chat
    })

    set((state: HState) => ({
      ...state,
      allChats: newArr,
    }))
  }


}))

export default useHistoryStore;