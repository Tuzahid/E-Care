/*
==================================================
E-CARE FINAL DESIGN INTERACTIONS
==================================================
*/


const modal = document.getElementById("modal");

const modalTitle =
  document.getElementById("modalTitle");

const modalMessage =
  document.getElementById("modalMessage");

const modalClose =
  document.getElementById("modalClose");

const modalOk =
  document.getElementById("modalOk");

const modalOverlay =
  document.getElementById("modalOverlay");


/*
==================================================
OPEN MODAL
==================================================
*/

function openModal(title, message) {

  modalTitle.textContent = title;

  modalMessage.textContent = message;

  modal.classList.add("active");

  document.body.style.overflow = "hidden";
}


/*
==================================================
CLOSE MODAL
==================================================
*/

function closeModal() {

  modal.classList.remove("active");

  document.body.style.overflow = "";
}


/*
==================================================
CLOSE BUTTONS
==================================================
*/

modalClose.addEventListener(
  "click",
  closeModal
);

modalOk.addEventListener(
  "click",
  closeModal
);

modalOverlay.addEventListener(
  "click",
  closeModal
);


/*
==================================================
MENU
==================================================
*/

document
  .getElementById("menuBtn")
  .addEventListener("click", function () {

    openModal(
      "E-Care Menu",
      "E-Care menu is ready."
    );

  });


/*
==================================================
REGISTRATION
==================================================
*/

document
  .getElementById("registrationBtn")
  .addEventListener("click", function () {

    openModal(
      "Registration",
      "E-Care registration is ready."
    );

  });


/*
==================================================
WHATSAPP
==================================================
*/

document
  .getElementById("whatsappBtn")
  .addEventListener("click", function () {

    window.open(
      "https://wa.me/",
      "_blank",
      "noopener,noreferrer"
    );

  });


/*
==================================================
COURSES
==================================================
*/

document
  .querySelectorAll("[data-course]")
  .forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const course =
          button.getAttribute("data-course");

        openModal(
          course,
          course + " course selected."
        );

      }
    );

  });


/*
==================================================
ESC KEY
==================================================
*/

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      modal.classList.contains("active")
    ) {

      closeModal();

    }

  }
);
