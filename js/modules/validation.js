export function validateName(value) {
  return value.trim().length > 0;
}

export function validateAmount(value) {
  const num = parseInt(value);
  return !isNaN(num) && num >= 50;
}

export function validateTickets(selected, amount) {
  const max = Math.floor(amount / 50);
  if (selected.length === 0) return false;
  if (selected.length > max) return false;
  return true;
}

export function isFormValid({ firstName, lastName, amount, tickets }) {
  if (!validateName(firstName)) return false;
  if (!validateName(lastName)) return false;
  if (!validateAmount(amount)) return false;
  if (!validateTickets(tickets, amount)) return false;
  return true;
}
