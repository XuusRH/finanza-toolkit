
function monthlyPayment(principal, annualRatePct, months) {
  const r = (annualRatePct / 100) / 12;
  if (r === 0) return +(principal / months).toFixed(2);
  const pmt = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return +pmt.toFixed(2);
}

function amortizationTable(principal, annualRatePct, months) {
  const r = (annualRatePct / 100) / 12;
  let balance = principal;
  const pmt = monthlyPayment(principal, annualRatePct, months);
  const rows = [];
  for (let i = 1; i <= months; i++) {
    const interest = +(balance * r).toFixed(2);
    const principalPaid = +(pmt - interest).toFixed(2);
    balance = +(balance - principalPaid);
    rows.push({ period: i, payment: pmt, interest, principal: principalPaid, balance: Math.max(0, +balance.toFixed(2)) });
  }
  return rows;
}

function handleLoanCalc() {
  const amount = parseFloat(document.getElementById('loan-amount').value || '0');
  const rate = parseFloat(document.getElementById('loan-rate').value || '0');
  const years = parseInt(document.getElementById('loan-years').value || '0', 10);
  const months = years * 12;
  if (!amount || !years) { 
    document.getElementById('loan-result').innerText = 'Introduce cantidad y años.'; 
    return; 
  }
  const pmt = monthlyPayment(amount, rate, months);
  document.getElementById('loan-result').innerHTML = `<b>Cuota mensual:</b> ${pmt.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`;
  
  const rows = amortizationTable(amount, rate, months);
  const tbody = document.getElementById('loan-table-body');
  tbody.innerHTML = '';
  rows.slice(0, 360).forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.period}</td><td>${pmt.toLocaleString('es-ES')}</td><td>${r.interest.toLocaleString('es-ES')}</td><td>${r.principal.toLocaleString('es-ES')}</td><td>${r.balance.toLocaleString('es-ES')}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('loan-table-wrap').style.display = 'block';
}
