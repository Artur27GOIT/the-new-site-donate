const donateModal = document.getElementById("donateModal");
const closeDonateBtn = document.getElementById("closeModalBtn");

const messageModal = document.getElementById("messageModal");
const closeMessageBtn = document.getElementById("closeMessageModal");
const messageText = document.getElementById("messageText");

export function openDonateModal() {
  donateModal.classList.add("active");
  setTimeout(() => {
    const first = document.getElementById("firstName");
    if (first) first.focus();
  }, 150);
}

export function closeDonateModal() {
  donateModal.classList.remove("active");
}

export function showMessage(msg) {
  messageText.textContent = msg;
  messageModal.classList.add("active");
}

function closeMessageModal() {
  messageModal.classList.remove("active");
}

function handleBackdropClick(e) {
  if (e.target === donateModal) closeDonateModal();
  if (e.target === messageModal) closeMessageModal();
}

function handleEsc(e) {
  if (e.key === "Escape") {
    closeDonateModal();
    closeMessageModal();
  }
}

export function setupModals() {
  closeDonateBtn.addEventListener("click", closeDonateModal);
  closeMessageBtn.addEventListener("click", closeMessageModal);

  window.addEventListener("click", handleBackdropClick);
  window.addEventListener("keydown", handleEsc);
}
