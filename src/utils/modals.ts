export const openModal = (element: string) => {
  const modal = document.getElementById(element);
  if (modal != null) {
    modal.style.display = "flex";
    // document.body.style.overflowY = "hidden";
    window.onclick = (e) => {
      if (e.target == modal) {
        hiddenModal(modal);
      }
    };

    window.onkeydown = (e) => {
      if (e.key === "Escape") {
        hiddenModal(modal);
      }
    };
  }
};

function hiddenModal(modal: HTMLElement) {
  modal.style.display = "none";
  // document.body.style.overflowY = "initial";
  window.onclick = null;
}
