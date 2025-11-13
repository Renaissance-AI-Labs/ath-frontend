import axios from 'axios';
import { APP_ENV } from './environment';

const SUBGRAPH_URLS = {
  PROD: 'https://gateway.thegraph.com/api/subgraphs/id/ExXtbpnCYZwZU3UwEKg3PUv4ZY8UbeUXCQDWzPtb9Gbz',
  DEV: 'https://api.studio.thegraph.com/query/16009/ath-referral-test/version/latest',
};

const SUBGRAPH_API_KEY = '59ea243e4cb1078db41167f3fb142843';

const SUBGRAPH_URL = SUBGRAPH_URLS[APP_ENV] || SUBGRAPH_URLS.DEV;

console.log(`[Subgraph] Initialized with endpoint for ${APP_ENV}: ${SUBGRAPH_URL}`);

export async function getReferralsFromSubgraph(address) {
  const query = `
    query GetUserReferrals($address: Bytes!) {
      user(id: $address) {
        referralCount
        referrals {
          id
        }
      }
    }
  `;

  const requestConfig = {
    method: 'post',
    url: SUBGRAPH_URL,
    data: {
      query,
      variables: {
        address: address.toLowerCase(),
      },
    }
  };

  // Only add the Authorization header for the production URL
  if (SUBGRAPH_URL === SUBGRAPH_URLS.PROD) {
    requestConfig.headers = {
      Authorization: `Bearer ${SUBGRAPH_API_KEY}`
    };
  }

  try {
    const response = await axios(requestConfig);

    if (response.data.errors) {
      console.error('Subgraph query error:', response.data.errors);
      return { referralCount: 0, referrals: [] };
    }

    const user = response.data.data.user;
    if (!user) {
      return { referralCount: 0, referrals: [] };
    }

    return {
      referralCount: parseInt(user.referralCount, 10),
      referrals: user.referrals.map(r => r.id),
    };
  } catch (error) {
    console.error('Error fetching referrals from subgraph:', error);
    return { referralCount: 0, referrals: [] };
  }
}
