import { create } from 'zustand';
import { getContactInfo } from './apiCalls';
import { Auth } from './store';

export interface ChatInstance {
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
  allChats: ChatInstance[]
  addChat: (auth: Auth, { chatId }: ChatInstance) => void;
  removeChat: ({ chatId }: ChatInstance) => void;
  updateChatInstance: ({ chatId, avatar, name, history, notification }: ChatInstance) => void;
}

const useHistoryStore = create<HState>((set, get) => ({
  allChats: localStorage.allChats ? JSON.parse(localStorage.allChats) : [],

  updateChatInstance: ({ chatId, avatar, name, history, notification }: ChatInstance) => {
    const tempAllChats = get().allChats;
    const newAllChats = tempAllChats.map((chatInstance) => {
      if (chatInstance.chatId === chatId) {
        if (avatar) {
          chatInstance.avatar = avatar
        }
        if (name) {
          chatInstance.name = name
        }
        if (history) {
          let newHistory: IMessage[]

          if (chatInstance.history) {
            if (chatInstance.history.find((message) => message.idMessage === history[0].idMessage)) {
              newHistory = chatInstance.history.map((message) => message.idMessage === history[0].idMessage ? history[0] : message)
            } else {
              newHistory = [...history, ...chatInstance.history]
            }
          } else {
            newHistory = [...history]
          }
          chatInstance.history = newHistory
        }

        if (notification !== undefined) {
          if (!notification) {
            chatInstance.notification = false;
          } else {
            chatInstance.notification = true
          }
        }
      }
      return chatInstance
    })

    set((state: HState) => ({
      ...state,
      allChats: newAllChats,
    }))
  },


  removeChat: ({ chatId }: ChatInstance) => {
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

  addChat: async (auth: Auth, { chatId, notification }: ChatInstance) => {
    const tempAllChats = get().allChats;
    const contactInfo = await getContactInfo(auth, chatId);
    if (notification) {
      contactInfo.notification = true;
    }
    tempAllChats.push(contactInfo)
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

}))

export default useHistoryStore;