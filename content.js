// Content script to enhance Netflix controls visibility
(function () {
  setInterval(() => {
    const controls = document.querySelector(
      ".PlayerControlsNeo__button-control-row"
    );
    if (controls) {
      controls.style.opacity = "1";
      controls.style.visibility = "visible";
      controls.style.pointerEvents = "auto";
    }
  }, 1000);
})();
