import { site } from "./data.js";

export function initContact() {
  const button = document.getElementById("copy-email");
  const note = document.getElementById("copy-note");
  if (!button || !note) return;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      note.textContent = "copied";
    } catch {
      note.textContent = site.email;
    }
    setTimeout(() => {
      note.textContent = "";
    }, 2200);
  });
}
