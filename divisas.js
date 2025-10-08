async function fillCurrencies() {
  const selFrom = document.getElementById('fx-from');
  const selTo = document.getElementById('fx-to');

  try {
    // Pide a la API las divisas soportadas
    const res = await fetch('https://api.frankfurter.app/currencies');
    const data = await res.json();   // { "USD": "United States Dollar", "EUR": "Euro", ... }

    // Limpia los selects antes de llenarlos
    selFrom.innerHTML = '';
    selTo.innerHTML = '';

    // Rellena las opciones dinámicamente
    for (const [code, name] of Object.entries(data)) {
      const o1 = document.createElement('option');
      o1.value = code;
      o1.textContent = `${code} – ${name}`;
      selFrom.appendChild(o1);

      const o2 = document.createElement('option');
      o2.value = code;
      o2.textContent = `${code} – ${name}`;
      selTo.appendChild(o2);
    }

    // Selecciones por defecto
    selFrom.value = 'EUR';
    selTo.value = 'USD';

  } catch (err) {
    console.error('Error cargando divisas', err);
  }
}

// Llamar la función cuando la página esté lista
document.addEventListener('DOMContentLoaded', fillCurrencies);

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

async function loadCurrencies() {
  try {
    // Llamamos a la API para obtener las divisas disponibles
    const res = await fetch('https://api.frankfurter.app/currencies');
    const currencies = await res.json();

    const selFrom = document.getElementById('fx-from');
    const selTo = document.getElementById('fx-to');

    // Limpiar opciones previas
    selFrom.innerHTML = '';
    selTo.innerHTML = '';

    // Rellenar con las divisas que devuelve la API
    Object.keys(currencies).forEach(code => {
      const option1 = document.createElement('option');
      option1.value = code;
      option1.textContent = `${code} – ${currencies[code]}`;
      selFrom.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = code;
      option2.textContent = `${code} – ${currencies[code]}`;
      selTo.appendChild(option2);
    });

    // Selección por defecto
    selFrom.value = 'EUR';
    selTo.value = 'USD';
  } catch (err) {
    console.error('Error cargando divisas:', err);
    document.getElementById('fx-result').innerText = 'Error cargando lista de divisas.';
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', loadCurrencies);

