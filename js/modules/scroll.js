export default function initScroll() {
  const scrollBtn = document.getElementById("scrollToRaffle");
  const raffleSection = document.getElementById("raffleSection");

  if (!scrollBtn || !raffleSection) return;

  scrollBtn.addEventListener("click", () => {
    raffleSection.scrollIntoView({ behavior: "smooth" });
  });
}
