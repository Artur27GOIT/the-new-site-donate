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

let lastRowCount = 0;

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

    if (lastRowCount && currentRowCount !== lastRowCount) {
      updateModal.classList.add("active");
    }

    lastRowCount = currentRowCount;
  } catch (err) {}
}

export function initUpdatesWatcher() {
  checkForNewData();
  setInterval(checkForNewData, 10000);
}
