import { Auth } from './store';

const baseUrl = 'https://api.green-api.com'

export const setSettings = async (auth: Auth) => {
  const method = 'setSettings'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(
        {
          "outgoingMessageWebhook": "yes",
          "outgoingAPIMessageWebhook": "yes",
          "incomingWebhook": "yes",
          "saveSettings": true
        }
      )
    })
    if (response.ok) {
      const settings = await response.json()
      return settings;
    }
  } catch (error) {
    // console.log('getStateInstance error :>> ', error);
    return 'check your credentials';
  }
}

export const getStateInstance = async (auth: Auth) => {
  const method = 'getStateInstance'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
    if (response.ok) {
      const state = await response.json()
      return state.stateInstance;
    }
  } catch (error) {
    // console.log('getStateInstance error :>> ', error);
    return 'check your credentials';
  }
}
export const getChatHistory = async (auth: Auth, chatId: string, count: number) => {
  const method = 'getChatHistory'
  console.log('!!! getChatHistory request');
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(
        {
          "chatId": chatId,
          "count": count
        }
      )
    })
    if (response.ok) {
      return await response.json();
    } else {
      console.log(await response.json());
    }
  } catch (error) {
    console.log('getChatHistory error :>> ', error);
    return null;
  }
}
export const receiveNotifications = async (auth: Auth) => {
  const method = 'receiveNotification'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`)
    if (response.ok) {
      return await response.json();
    } else {
      console.log(await response.json());
    }
  } catch (error) {
    console.log('receiveNotification error :>> ', error);
    return null;
  }
}
export const deleteNotification = async (auth: Auth, receiptId: number) => {
  const method = 'deleteNotification'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}/${receiptId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(
        {
          receiptId
        }
      )
    })
    if (response.ok) {
      return await response.json();
    } else {
      console.log(await response.json());
    }
  } catch (error) {
    console.log('deleteNotification error :>> ', error);
    return null;
  }
}
export const sendMessage = async (auth: Auth, chatId: string, message: string) => {
  const method = 'sendMessage'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(
        {
          "chatId": chatId,
          "message": message
        }
      )
    })
    if (response.ok) {
      return await response.json();
    } else {
      console.log(await response.json());
    }
  } catch (error) {
    console.log('sendMessage error :>> ', error);
    return null;
  }
}
export const getMessage = async (auth: Auth, chatId: string, idMessage: string) => {
  const method = 'getMessage'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(
        {
          chatId,
          idMessage
        }
      )
    })
    if (response.ok) {
      return await response.json();
    } else {
      console.log(await response.json());
    }
  } catch (error) {
    console.log('getMessage error :>> ', error);
    return null;
  }
}
export const checkWhatsapp = async (auth: Auth, phoneNumber: number) => {
  const method = 'checkWhatsapp'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(
        {
          phoneNumber
        }
      )
    })
    if (response.ok) {
      return await response.json();
    } else {
      console.log(await response.json());
    }
  } catch (error) {
    console.log('getMessage error :>> ', error);
    return null;
  }
}

export const getContactInfo = async (auth: Auth, chatId: string) => {
  const method = 'getContactInfo'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(
        {
          chatId
        }
      )
    })
    if (response.ok) {
      const ContactInfo = await response.json()
      return ContactInfo;
    } else {
      throw (await response.json());
    }
  } catch (error) {
    console.log('getMessage error :>> ', error);
    return null;
  }
}

export const getContacts = async (auth: Auth) => {
  const method = 'getContacts'
  try {
    const response = await fetch(`${baseUrl}/waInstance${auth.idInstance}/${method}/${auth.apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
    if (response.ok) {
      return await response.json();
    } else {
      console.log(await response.json());
    }
  } catch (error) {
    console.log('getMessage error :>> ', error);
    return null;
  }
}