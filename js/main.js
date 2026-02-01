// ===== Функції =====
function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent,
  );
}

const donateButtons = document.querySelectorAll(".donate-btn");
const closeModal = document.getElementById("closeModalBtn");
const modal = document.getElementById("donateModal");

const donateForm = document.querySelector(".donate-form");
const amountInput = document.getElementById("amount");
const ticketCheckboxes = document.querySelectorAll(
  'input[name="ticketNumber"]',
);

const monoJarLink = "https://send.monobank.ua/jar/2pDvqLCWa2";

const messageModal = document.getElementById("messageModal");
const messageText = document.getElementById("messageText");
const closeMessageModal = document.getElementById("closeMessageModal");

function showMessage(msg) {
  messageText.textContent = msg;
  messageModal.classList.add("active");
}

closeMessageModal.addEventListener("click", () => {
  messageModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === messageModal) messageModal.classList.remove("active");
});

// ----------------------------------------Відкриття / закриття модалки---------------------------------------
donateButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.add("active");
    lockTicketsUntilFormValid(); // при відкритті модалки одразу блокуємо/перевіряємо чекбокси
  });
});

closeModal.addEventListener("click", () => modal.classList.remove("active"));

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

// ===== Дані форми =====
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");

// ===== Завантаження зайнятих білетів =====
let takenTickets = [];

fetch("https://sheetdb.io/api/v1/564kk8ptt07xm")
  .then((res) => res.json())
  .then((data) => {
    takenTickets = data.flatMap((row) => row.Tickets.split(","));
    ticketCheckboxes.forEach((cb) => {
      if (takenTickets.includes(cb.value)) {
        cb.disabled = true;
        cb.parentElement.classList.add("taken");
      }
    });
    // після завантаження зайнятих білетів ще раз синхронізуємо стан
    lockTicketsUntilFormValid();
  })
  .catch((err) =>
    console.error("Помилка при отриманні зайнятих білетів:", err),
  );

// ===== Обмеження білетів по сумі =====
function updateTicketAvailability() {
  const amount = parseInt(amountInput.value);
  const maxTickets = Math.floor(amount / 50);

  const checkedCount = Array.from(ticketCheckboxes).filter(
    (cb) => cb.checked,
  ).length;

  ticketCheckboxes.forEach((cb) => {
    if (takenTickets.includes(cb.value)) {
      // зайняті білети завжди заблоковані
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

// ===== Блокування чекбоксів, поки форма не валідна =====
function lockTicketsUntilFormValid() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const amount = parseInt(amountInput.value);

  const formValid = firstName && lastName && !isNaN(amount) && amount >= 50;

  if (!formValid) {
    ticketCheckboxes.forEach((cb) => {
      cb.checked = false;
      cb.disabled = true; // блокуємо всі, незалежно від зайнятості
    });
    return;
  }

  // якщо форма валідна — вмикаємо логіку обмеження по сумі
  updateTicketAvailability();
}

// ===== Слухачі для інпутів форми =====
firstNameInput.addEventListener("input", lockTicketsUntilFormValid);
lastNameInput.addEventListener("input", lockTicketsUntilFormValid);
amountInput.addEventListener("input", lockTicketsUntilFormValid);

ticketCheckboxes.forEach((cb) =>
  cb.addEventListener("change", updateTicketAvailability),
);

// ===== Submit форми =====
donateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const amount = parseInt(amountInput.value) || 0;
  const selectedTickets = Array.from(ticketCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const maxTickets = Math.floor(amount / 50);

  // Перевірка
  if (
    !firstName ||
    !lastName ||
    amount < 50 ||
    selectedTickets.length === 0 ||
    selectedTickets.length > maxTickets
  ) {
    showMessage("Перевірте всі поля та білети.");
    return;
  }

  // Додаткова перевірка на зайняті білети
  const conflict = selectedTickets.some((ticket) =>
    takenTickets.includes(ticket),
  );
  if (conflict) {
    showMessage("Один або більше обраних білетів вже куплені. Оберіть інші.");
    return;
  }

  // ===== Форматуємо Timestamp =====
  const now = new Date();
  const timestamp = `${now.getDate().toString().padStart(2, "0")}/${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${now.getFullYear()} ${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const formData = {
    Timestamp: timestamp,
    "First Name": firstName,
    "Last Name": lastName,
    Amount: amount,
    Tickets: selectedTickets.join(","),
  };

  // ===== Відправка даних =====
  fetch("https://sheetdb.io/api/v1/564kk8ptt07xm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Сервер повернув помилку");
      showMessage("Дані успішно збережено! Дякуємо за донат.");
      if (isMobile()) {
        window.location.href = monoJarLink;
      } else {
        window.open(monoJarLink, "_blank");
      }

      donateForm.reset();

      // після ресету знову блокуємо чекбокси
      ticketCheckboxes.forEach((cb) => {
        cb.checked = false;
        cb.disabled = takenTickets.includes(cb.value) || true;
      });
      lockTicketsUntilFormValid();
    })
    .catch((err) => {
      alert("Помилка при відправці даних");
      console.error(err);
    });
});

// ===== Скрол до розділу розіграшу =====
const scrollBtn = document.getElementById("scrollToRaffle");
const raffleSection = document.getElementById("raffleSection");

scrollBtn.addEventListener("click", () => {
  raffleSection.scrollIntoView({ behavior: "smooth" });
});

// =================== Автоматичне оновлення при зміні таблиці ===================
let lastRowCount = 0;

const updateModal = document.createElement("div");
updateModal.classList.add("modal");
updateModal.innerHTML = `
  <div class="modal-content">
    <h3>🔄 Дані оновились!</h3>
    <p>З’явились нові учасники або білети. Оновити сторінку?</p>
    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
      <button id="refreshConfirm" class="submit-btn">Оновити</button>
      <button id="refreshCancel" class="donate-btn">Пізніше</button>
    </div>
  </div>
`;
document.body.appendChild(updateModal);

const refreshConfirm = updateModal.querySelector("#refreshConfirm");
const refreshCancel = updateModal.querySelector("#refreshCancel");

refreshConfirm.addEventListener("click", () => {
  location.reload();
});

refreshCancel.addEventListener("click", () => {
  updateModal.classList.remove("active");
});

async function checkForNewData() {
  try {
    const res = await fetch("https://sheetdb.io/api/v1/564kk8ptt07xm");
    const data = await res.json();

    const currentRowCount = data.length;

    // якщо є зміни — показуємо модалку
    if (lastRowCount && currentRowCount !== lastRowCount) {
      updateModal.classList.add("active");
      console.log(
        "📢 Виявлено оновлення у таблиці. Пропонуємо перезавантаження...",
      );
    }

    lastRowCount = currentRowCount;
  } catch (err) {
    console.error("❌ Помилка перевірки оновлень:", err);
  }
}

// перевірка кожні 10 секунд
setInterval(checkForNewData, 10000);
checkForNewData();

// початковий стан — все заблоковано, поки форма не валідна
lockTicketsUntilFormValid();
