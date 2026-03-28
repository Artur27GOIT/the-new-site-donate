import { setupModals, openDonateModal } from "./modules/modal.js";
import { initTickets, setTakenTickets } from "./modules/tickets.js";
import { initForm } from "./modules/form.js";
import { fetchTakenTickets } from "./modules/api.js";
import { initUpdatesWatcher } from "./modules/updates.js";
import initScroll from "./modules/scroll.js";

initScroll();

setupModals();
initTickets();
initForm();
initUpdatesWatcher();

document.querySelectorAll(".donate-btn").forEach((btn) => {
  btn.addEventListener("click", openDonateModal);
});

fetchTakenTickets().then((list) => setTakenTickets(list));
