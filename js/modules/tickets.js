const ticketGrid = document.getElementById("ticketGrid");
const amountInput = document.getElementById("amount");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");

let takenTickets = [];
let ticketCheckboxes = [];

export function generateTickets(count = 37) {
  ticketGrid.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const label = document.createElement("label");
    label.className = "ticket";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "ticketNumber";
    input.value = i;

    const span = document.createElement("span");
    span.textContent = i;

    label.appendChild(input);
    label.appendChild(span);
    ticketGrid.appendChild(label);
  }

  ticketCheckboxes = Array.from(
    document.querySelectorAll('input[name="ticketNumber"]'),
  );

  ticketCheckboxes.forEach((cb) =>
    cb.addEventListener("change", updateTicketAvailability),
  );
}

export function setTakenTickets(list) {
  takenTickets = list;
  ticketCheckboxes.forEach((cb) => {
    if (takenTickets.includes(cb.value)) {
      cb.disabled = true;
      cb.parentElement.classList.add("taken");
    }
  });
}

export function updateTicketAvailability() {
  const amount = parseInt(amountInput.value);
  const maxTickets = Math.floor(amount / 50);

  const checkedCount = ticketCheckboxes.filter((cb) => cb.checked).length;

  ticketCheckboxes.forEach((cb) => {
    if (takenTickets.includes(cb.value)) {
      cb.disabled = true;
      return;
    }

    if (!cb.checked && checkedCount >= maxTickets) {
      cb.disabled = true;
    } else {
      cb.disabled = false;
    }
  });
}

export function lockTicketsUntilFormValid() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const amount = parseInt(amountInput.value);

  const valid = firstName && lastName && !isNaN(amount) && amount >= 50;

  if (!valid) {
    ticketCheckboxes.forEach((cb) => {
      cb.checked = false;
      cb.disabled = true;
    });
    return;
  }

  updateTicketAvailability();
}

export function initTickets() {
  generateTickets();
  firstNameInput.addEventListener("input", lockTicketsUntilFormValid);
  lastNameInput.addEventListener("input", lockTicketsUntilFormValid);
  amountInput.addEventListener("input", lockTicketsUntilFormValid);
}
