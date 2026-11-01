const email = "hello@sultanmahmud.dev"; // placeholder, owner must replace

export function initContact() {
  const button = document.getElementById("copy-email");
  const note = document.getElementById("copy-note");
  if (!button || !note) return;

  let clearTimer = 0;
  button.addEventListener("click", async () => {
    clearTimeout(clearTimer);
    try {
      await navigator.clipboard.writeText(email);
      note.textContent = "copied";
      clearTimer = setTimeout(() => {
        note.textContent = "";
      }, 2200);
    } catch {
      const link = document.createElement("a");
      link.href = `mailto:${email}`;
      link.textContent = email;
      note.replaceChildren(link);
    }
  });
}
