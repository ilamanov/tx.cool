import type { Address } from 'viem';

import type { ChatMessageTx } from '@/lib/types/chat';

const fetchConversation = async (
  address1: Address,
  address2: Address,
  page: number,
): Promise<ChatMessageTx[]> => {
  const response = await fetch('https://api.evm.storage/canvas_api.v1.CanvasApiService/Query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      canvas_id: '9bd2632b-a0f4-40db-84c1-985c866e997e',
      api_endpoint: 'get_conversation',
      api_key: 'sim-api-e80d0a607c29a0d2',
      query_parameters: {
        chain_id: '1',
        addr1: address1.toLowerCase(),
        addr2: address2.toLowerCase(),
        offset: (page * 10).toString(),
      },
    }),
  });

  const data = await response.json();
  const rows = data.rows;
  if (!rows) return [];

  // data.columns will be ['block_number', 'from_addr', 'to_addr', 'value', 'message', 'msg_time', 'txn_hash']

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((row: any) => {
    // row will be something like this:
    // {
    //   value: [
    //     { bigDecimal: '46349' },
    //     { string: '0x22f2dcff5ad78c3eb6850b5cb951127b659522e6' },
    //     { string: '0x9aa9205faa68e731703c633b53fe5af8ece59d38' },
    //     { bigDecimal: '1000000000000000000' },
    //     { string: 'Franko is Freedom.' },
    //     { string: '2015-08-07 04:27:57' },
    //     {
    //       string: '0x4a110de8110bb9eb250bdeb772ecafd517dfa109c14ff5d93dcfb96e9c562bb8'
    //     }
    //   ]
    // }
    const value = row.value;
    return {
      blockNumber: Number(value[0].bigDecimal),
      from: value[1].string,
      to: value[2].string,
      value: Number(value[3].bigDecimal),
      message: value[4].string,
      timestamp: new Date(value[5].string),
      txHash: value[6].string,
    };
  });
};

export default fetchConversation;
