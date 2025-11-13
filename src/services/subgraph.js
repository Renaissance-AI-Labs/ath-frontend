import axios from 'axios';
import { APP_ENV } from './environment';

const SUBGRAPH_URLS = {
  PROD: 'https://gateway.thegraph.com/api/59ea243e4cb1078db41167f3fb142843/subgraphs/id/ExXtbpnCYZwZU3UwEKg3PUv4ZY8UbeUXCQDWzPtb9Gbz',
  DEV: 'https://api.studio.thegraph.com/query/16009/ath-referral-test/version/latest',
};

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

  try {
    const response = await axios.post(SUBGRAPH_URL, {
      query,
      variables: {
        address: address.toLowerCase(),
      },
    });

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
