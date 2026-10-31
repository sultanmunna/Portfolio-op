const email = "hello@sultanmahmud.dev"; // placeholder, owner must replace

export function initContact() {
  const button = document.getElementById("copy-email");
  const note = document.getElementById("copy-note");
  if (!button || !note) return;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      note.textContent = "copied";
    } catch {
      note.textContent = email;
    }
    setTimeout(() => {
      note.textContent = "";
    }, 2200);
  });
}
