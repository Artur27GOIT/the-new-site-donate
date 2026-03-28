import { showMessage } from "./modal.js";
import { lockTicketsUntilFormValid } from "./tickets.js";
import { saveDonation, getTimestamp } from "./api.js";
import { isFormValid } from "./validation.js";

const donateForm = document.querySelector(".donate-form");
const amountInput = document.getElementById("amount");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const submitBtn = donateForm?.querySelector(".submit-btn");

export function initForm() {
  if (
    !donateForm ||
    !amountInput ||
    !firstNameInput ||
    !lastNameInput ||
    !submitBtn
  )
    return;

  donateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const amount = parseInt(amountInput.value, 10) || 0;

    const selectedTickets = Array.from(
      document.querySelectorAll('input[name="ticketNumber"]:checked'),
    ).map((cb) => cb.value);

    const valid = isFormValid({
      firstName,
      lastName,
      amount,
      tickets: selectedTickets,
    });

    if (!valid) {
      showMessage("Перевірте всі поля та білети.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    submitBtn.textContent = "Відправляємо...";

    const timestamp = getTimestamp();

    const formData = {
      Timestamp: timestamp,
      "First Name": firstName,
      "Last Name": lastName,
      Amount: amount,
      Tickets: selectedTickets.join(","),
    };

    try {
      await saveDonation(formData);

      const comment = `${firstName} ${lastName} | ${selectedTickets.join(",")}`;
      const amountInCoins = amount * 100;

      const monoUrl = `https://send.monobank.ua/jar/3gf5BDfB2z?amount=${amountInCoins}&comment=${encodeURIComponent(comment)}`;

      window.open(monoUrl, "_blank");

      donateForm.reset();
      lockTicketsUntilFormValid();
    } catch (err) {
      showMessage("Помилка при відправці даних.");
    }

    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    submitBtn.textContent = "Взяти участь";
  });
}
