import axios from 'axios';
export async function getMerchantTransactionHistory(
  upa: string | undefined,
  jwt: string | null | undefined
) {
  try {
    const response = await axios.get(
      'https://bd7t5d9s-5000.inc1.devtunnels.ms/merchant/getMerchantTransactionHistoryOfUser',
      {
        params: { upa },
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const data = response.data;
    const mapped = Array.isArray(data)
      ? data.map((item: any) => ({
          name: item.merchantname || item.merchantupa || '-',
          image: require('../../assets/images/profile_pic.jpg'),
          date: item.transactiontime ? new Date(item.transactiontime).toLocaleDateString() : '-',
          time: item.transactiontime ? new Date(item.transactiontime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          amount: item.amount ? `-₹${item.amount}` : '-',
          transactionId: item.transactionId || item.transactionID || item.transactionid || '-',
        }))
      : [];
    mapped.forEach((item: any) => {
      if (!item.image) {
        item.image = require('../assets/images/profile_pic.jpg');
      }
    });
    return mapped;
  } catch (error: any) {
    return [];
  }
}

export async function makeMerchantPayment(
  amount: number,
  customerUPA: string | undefined,
  merchantUPA: string,
  serviceType: string,
  metadata: object,
  transactionPIN: string,
  jwt: string | null | undefined
) {
  try {
    const response = await axios.post(
      'https://bd7t5d9s-5000.inc1.devtunnels.ms/merchant/makeMerchantPayment',
      {
        amount,
        customerUPA,
        merchantUPA,
        serviceType,
        metadata,
        transactionPIN,
      },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { status: 500, message: 'Network or server error', error };
  }


}

export async function getFullTransactionHistory(
   upa: string | undefined,
   jwt: string | null | undefined
) {
  try {
    const response = await axios.get(
      'https://bd7t5d9s-5000.inc1.devtunnels.ms/transaction/getFullTransactionHistory',
      {
        params: { upa },
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const data = response.data;
    const mapped = Array.isArray(data)
      ? data.map((item: any) => ({
          name: item.name || '-',
          image: require('../../assets/images/profile_pic.jpg'),
          date: item.date || ['-', '-'],
          time: item.time || '-',
          amount: item.amount || '-',
          transactionId: item.transactionId || item.transactionID || item.transactionid || '-',
        }))
      : [];
    mapped.forEach((item: any) => {
      if (!item.image) {
        item.image = require('../assets/images/profile_pic.jpg');
      }
    });
    return mapped;
  } catch (error: any) {
    return [];
  }
}

export async function getTransactionHistory(
  upa: string | undefined,
  jwt: string | null | undefined
) {
  try {
    const response = await axios.get(
      'https://bd7t5d9s-5000.inc1.devtunnels.ms/transaction/getPaymentHistoryOfUser',
      {
        params: { upa },
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const data = response.data;
    const mapped = Array.isArray(data)
      ? data.map((item: any) => ({
          name: item.name || '-',
          image: require('../../assets/images/profile_pic.jpg'),
          date: item.date || ['-', '-'],
          time: item.time || '-',
          amount: item.amount || '-',
          transactionId: item.transactionId || item.transactionID || item.transactionid || '-',
        }))
      : [];
    mapped.forEach((item: any) => {
      if (!item.image) {
        item.image = require('../assets/images/profile_pic.jpg');
      }
    });
    return mapped;
  } catch (error: any) {
    return [];
  }
}

export async function makePayment(
    amount:string|undefined, 
    senderID:string|undefined, 
    receiverID:string|undefined, 
    transactionPIN:string|null|undefined,
    jwt:string|null|undefined) {
  try {
    const response = await axios.post('https://bd7t5d9s-5000.inc1.devtunnels.ms/transaction/makePayment',
      {
        amount,
        senderID,
        receiverID,
        transactionPIN,
      },{ headers: { Authorization: `Bearer ${jwt}` },}
    );
    return response.data;
  } catch (error:any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { status: 500, message: 'Network or server error', error };
  }
}
