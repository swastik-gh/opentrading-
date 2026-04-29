import axios from 'axios';

export async function fetchPrice(coinId: string) {
  // CoinGecko Simple Price endpoint
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
    params: { ids: coinId, vs_currencies: 'usd' }
  });
  return response.data[coinId].usd;
}