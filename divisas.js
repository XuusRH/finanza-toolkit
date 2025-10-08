async function fetchRates(base = 'EUR') {
  const res = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`);
  const data = await res.json();   // <-- convierte la respuesta en JSON
  return data;
}
let cacheRates = null;
let cacheBase = 'EUR';
async function convertCurrency() {
  const amount = parseFloat(document.getElementById('fx-amount').value || '0');
  const from = document.getElementById('fx-from').value;
  const to = document.getElementById('fx-to').value;
  if (!amount) { 
    document.getElementById('fx-result').innerText = 'Introduce una cantidad.'; 
    return; 
  }
  if (!cacheRates || cacheBase !== from) {
    document.getElementById('fx-result').innerText = 'Cargando tasas...';
    const data = await fetchRates(from);
    cacheRates = data.rates;
    cacheBase = from;
    document.getElementById('fx-date').innerText = data.date;
  }
  if (from === to) {
    document.getElementById('fx-result').innerText = `${amount} ${from} = ${amount} ${to}`;
    return;
  }
  const rate = cacheRates[to];
  if (!rate) {
    document.getElementById('fx-result').innerText = 'Moneda no disponible.';
    return;
  }
  const out = amount * rate;
  document.getElementById('fx-result').innerText = `${amount} ${from} ≈ ${out.toLocaleString('es-ES')} ${to} (tipo ${rate})`;
}

const COMMON = [
  "AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","EUR","GBP","HKD",
  "HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR","NOK","NZD",
  "PHP","PLN","RON","SEK","SGD","THB","TRY","USD","ZAR"
];

function fillCurrencies() {
  const selFrom = document.getElementById('fx-from');
  const selTo = document.getElementById('fx-to');
  COMMON.forEach(code => {
    const o1 = document.createElement('option'); o1.value = code; o1.textContent = code; selFrom.appendChild(o1);
    const o2 = document.createElement('option'); o2.value = code; o2.textContent = code; selTo.appendChild(o2);
  });
  selFrom.value = 'EUR';
  selTo.value = 'USD';
}
document.addEventListener('DOMContentLoaded', fillCurrencies);
