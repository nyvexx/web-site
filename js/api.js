document.addEventListener('DOMContentLoaded', () => {
  // USD к RUB
  fetch('https://api.exchangerate-api.com/v4/latest/USD')
    .then(res => res.json())
    .then(data => {
      document.getElementById('usd-rate').textContent = data.rates.RUB.toFixed(2) + ' ₽';
    })
    .catch(() => {
      document.getElementById('usd-rate').textContent = 'Ошибка';
    });

  // Цена биткойна через CoinGecko
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    .then(res => res.json())
    .then(data => {
      const btcPrice = data.bitcoin.usd;
      document.getElementById('btc-price').textContent = `${btcPrice.toLocaleString()} $`;
    })
    .catch(() => {
      document.getElementById('btc-price').textContent = 'Ошибка';
    });

  // Погода в
  fetch('https://wttr.in/Kostroma?format=j1')
  .then(res => res.json())
  .then(data => {
    const temp = data.current_condition[0].FeelsLikeC;
    const desc = data.current_condition[0].weatherDesc[0].value;
    document.getElementById('weather').textContent = `${temp}°C, ${desc}`;
  })
  .catch(() => {
    document.getElementById('weather').textContent = 'Ошибка';
  });
});