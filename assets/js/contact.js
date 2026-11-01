const email = "hello@sultanmahmud.dev"; // placeholder, owner must replace

export function initContact() {
  const button = document.getElementById("copy-email");
  const note = document.getElementById("copy-note");
  if (!button || !note) return;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      note.textContent = "copied";
      setTimeout(() => {
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
