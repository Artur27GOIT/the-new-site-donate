<script>
// ======== ВІДКРИТТЯ / ЗАКРИТТЯ МОДАЛКИ ========
const donateBtn = document.getElementById('donateBtn');
const modal = document.getElementById('donateModal');
const closeModal = document.getElementById('closeModal');

donateBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// ======== ЛОГІКА ФОРМИ ========
const donateForm = document.getElementById('donateForm');
const amountInput = document.getElementById('amount');
const ticketInputs = document.querySelectorAll('input[name="ticket"]');
const monoJar = "2pDvqLCWa2"; // ID твоєї банки Монобанку

// Кожен білет = 50 грн
const ticketPrice = 50;

// Слідкуємо за зміною суми
amountInput.addEventListener('input', () => {
  const amount = parseInt(amountInput.value) || 0;
  const availableTickets = Math.floor(amount / ticketPrice);

  // Скидаємо всі вибори
  ticketInputs.forEach((input, index) => {
    if (index < availableTickets) {
      input.disabled = false;
    } else {
      input.disabled = true;
      input.checked = false;
    }
  });
});

// ======== ВІДПРАВКА ФОРМИ ========
donateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const amount = parseInt(amountInput.value);
  const selectedTicket = document.querySelector('input[name="ticket"]:checked');

  if (!firstName || !lastName || !amount || !selectedTicket) {
    alert('Будь ласка, заповніть усі поля та виберіть білет.');
    return;
  }

  const comment = encodeURIComponent(`${firstName} ${lastName} — Білет №${selectedTicket.value}`);
  const monoLink = `https://send.monobank.ua/jar/${monoJar}?amount=${amount}&comment=${comment}`;

  // Відкриваємо лінк у новій вкладці
  window.open(monoLink, '_blank');

  // Очищаємо форму після відправки
  donateForm.reset();
  ticketInputs.forEach(input => input.disabled = false);
  modal.classList.remove('active');
});
</script>
