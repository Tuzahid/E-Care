(() => {
  "use strict";

  /* =========================================
     E-CARE V3 FINAL
     ========================================= */

  const PAYMENT_NUMBER = "01797937668";
  const WHATSAPP_NUMBER = "8801745221602";

  const USER_KEY = "ecare_user_v3";
  const TOTAL_KEY = "ecare_total_students_v3";
  const PENDING_REG_KEY = "ecare_pending_registration_v3";
  const PENDING_COURSE_KEY = "ecare_pending_course_v3";

  /* FREE COURSES */
  const FREE_COURSES = [
    "Web Development",
    "Digital Marketing"
  ];

  /* PAID COURSES */
  const PAID_COURSES = {
    "Graphic Design": 1000,
    "Video Editing": 800
  };


  /* =========================================
     ELEMENTS
     ========================================= */

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  const modalOverlay = document.getElementById("modalOverlay");


  /* =========================================
     USER DATA
     ========================================= */

  function getUser() {
    try {
      return JSON.parse(
        localStorage.getItem(USER_KEY) || "null"
      );
    } catch (error) {
      return null;
    }
  }


  function saveUser(user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  }


  /* =========================================
     MODAL
     ========================================= */

  function openModal(title, html) {

    modalTitle.textContent = title;

    modalContent.innerHTML = html;

    modal.classList.add("active");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";
  }


  function closeModal() {

    modal.classList.remove("active");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";
  }


  /* =========================================
     SECURITY
     ========================================= */

  function escapeHtml(value) {

    return String(value).replace(
      /[&<>"']/g,
      function (character) {

        const characters = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        };

        return characters[character];
      }
    );
  }


  /* =========================================
     COPY PAYMENT NUMBER
     ========================================= */

  function copyNumber() {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      navigator.clipboard
        .writeText(PAYMENT_NUMBER)

        .then(function () {

          alert(
            "Payment number copied:\n" +
            PAYMENT_NUMBER
          );

        })

        .catch(function () {

          alert(
            "Payment Number:\n" +
            PAYMENT_NUMBER
          );

        });

    } else {

      alert(
        "Payment Number:\n" +
        PAYMENT_NUMBER
      );
    }
  }


  /* =========================================
     PAYMENT INTERFACE
     ========================================= */

  function paymentHTML(
    amount,
    label,
    submitId
  ) {

    return `
      <div class="payment-box">

        <div>
          <strong>
            ${escapeHtml(label)}
          </strong>
        </div>

        <div class="payment-row">

          <span>
            bKash / Nagad Send Money
          </span>

          <strong>
            ${PAYMENT_NUMBER}
          </strong>

          <button
            type="button"
            class="copy-btn"
            id="copyPaymentNumber">
            Copy
          </button>

        </div>

        <div class="small">

          Send exactly
          <strong>৳${amount}</strong>

          using bKash or Nagad Send Money.

        </div>

      </div>

      <div class="form-grid">

        <input
          id="transactionId"
          type="text"
          placeholder="Transaction ID"
          autocomplete="off"
          maxlength="100">

        <button
          type="button"
          class="modal-button"
          id="${submitId}">

          Submit Transaction ID

        </button>

      </div>
    `;
  }


  function attachCopyButton() {

    const button =
      document.getElementById(
        "copyPaymentNumber"
      );

    if (button) {

      button.addEventListener(
        "click",
        copyNumber
      );
    }
  }


  /* =========================================
     MENU
     ========================================= */

  function showMenu() {

    const user = getUser();

    if (user) {

      openModal(
        "E-Care Menu",

        `
        <div class="menu-list">

          <button
            type="button"
            id="profileBtn">

            My Profile

          </button>

          <button
            type="button"
            id="logoutBtn">

            Logout

          </button>

        </div>
        `
      );

      document
        .getElementById("profileBtn")
        .addEventListener(
          "click",
          showProfile
        );


      document
        .getElementById("logoutBtn")
        .addEventListener(
          "click",
          logoutUser
        );

    } else {

      openModal(
        "E-Care Menu",

        `
        <div class="menu-list">

          <button
            type="button"
            id="loginBtn">

            Verify & Login

          </button>

          <button
            type="button"
            id="menuRegBtn">

            Registration

          </button>

        </div>
        `
      );


      document
        .getElementById("loginBtn")
        .addEventListener(
          "click",
          showLogin
        );


      document
        .getElementById("menuRegBtn")
        .addEventListener(
          "click",
          showRegistration
        );
    }
  }


  /* =========================================
     LOGOUT
     ========================================= */

  function logoutUser() {

    localStorage.removeItem(
      USER_KEY
    );

    sessionStorage.removeItem(
      PENDING_REG_KEY
    );

    sessionStorage.removeItem(
      PENDING_COURSE_KEY
    );

    alert(
      "You have been logged out."
    );

    closeModal();
  }


  /* =========================================
     REGISTRATION FORM
     ========================================= */

  function showRegistration() {

    const currentUser = getUser();

    if (currentUser) {

      openModal(
        "Registration",

        `
        <div class="success">

          You are already registered.

          <br><br>

          Registration ID:

          <strong>
            ${escapeHtml(
              currentUser.registrationId
            )}
          </strong>

        </div>

        <button
          type="button"
          class="modal-button"
          id="openProfile">

          Open Student Dashboard

        </button>
        `
      );


      document
        .getElementById("openProfile")
        .addEventListener(
          "click",
          showProfile
        );

      return;
    }


    openModal(
      "Registration",

      `
      <p class="info">

        Fill in all information,
        then continue to the
        ৳30 registration payment.

      </p>

      <form
        id="regForm"
        class="form-grid">

        <input
          id="regName"
          placeholder="Full Name"
          autocomplete="name"
          maxlength="80"
          required>

        <select
          id="regDivision"
          required>

          <option value="">
            Select Division
          </option>

          <option>Dhaka</option>
          <option>Chattogram</option>
          <option>Rajshahi</option>
          <option>Khulna</option>
          <option>Barishal</option>
          <option>Sylhet</option>
          <option>Rangpur</option>
          <option>Mymensingh</option>

        </select>

        <input
          id="regDistrict"
          placeholder="District"
          autocomplete="address-level2"
          maxlength="60"
          required>

        <input
          id="regMobile"
          type="tel"
          placeholder="Mobile Number"
          autocomplete="tel"
          maxlength="20"
          required>

        <input
          id="regGmail"
          type="email"
          placeholder="Gmail"
          autocomplete="email"
          maxlength="120"
          required>

        <button
          class="modal-button"
          type="submit">

          Continue to Payment

        </button>

      </form>
      `
    );


    document
      .getElementById("regForm")
      .addEventListener(
        "submit",
        function (event) {

          event.preventDefault();


          const data = {

            name:
              document
                .getElementById("regName")
                .value
                .trim(),

            division:
              document
                .getElementById("regDivision")
                .value,

            district:
              document
                .getElementById("regDistrict")
                .value
                .trim(),

            mobile:
              document
                .getElementById("regMobile")
                .value
                .trim(),

            gmail:
              document
                .getElementById("regGmail")
                .value
                .trim()

          };


          if (
            !data.name ||
            !data.division ||
            !data.district ||
            !data.mobile ||
            !data.gmail
          ) {

            alert(
              "Please complete all registration fields."
            );

            return;
          }


          sessionStorage.setItem(
            PENDING_REG_KEY,
            JSON.stringify(data)
          );


          showRegistrationPayment();
        }
      );
  }


  /* =========================================
     REGISTRATION PAYMENT
     ========================================= */

  function showRegistrationPayment() {

    openModal(
      "Registration Payment",

      paymentHTML(
        30,
        "Registration Fee — ৳30",
        "regPayBtn"
      )
    );


    attachCopyButton();


    document
      .getElementById("regPayBtn")
      .addEventListener(
        "click",
        function () {

          const transactionId =
            document
              .getElementById(
                "transactionId"
              )
              .value
              .trim();


          if (!transactionId) {

            alert(
              "Please enter the Transaction ID."
            );

            return;
          }


          let data = null;


          try {

            data = JSON.parse(
              sessionStorage.getItem(
                PENDING_REG_KEY
              ) || "null"
            );

          } catch (error) {

            data = null;
          }


          if (!data) {

            showRegistration();

            return;
          }


          let totalStudents =
            Number(
              localStorage.getItem(
                TOTAL_KEY
              ) || "0"
            );


          totalStudents += 1;


          localStorage.setItem(
            TOTAL_KEY,
            String(totalStudents)
          );


          const registrationId =
            "EC" +
            String(
              Date.now()
            ).slice(-8);


          const user = {

            ...data,

            registrationId:

              registrationId,

            serialNumber:

              totalStudents,

            registrationPaid:

              true,

            registrationTransactionId:

              transactionId,

            paidCourses:

              [],

            freeCourses:

              [...FREE_COURSES]

          };


          saveUser(user);


          sessionStorage.removeItem(
            PENDING_REG_KEY
          );


          showRegistrationSuccess(
            user
          );
        }
      );
  }


  /* =========================================
     REGISTRATION SUCCESS
     ========================================= */

  function showRegistrationSuccess(
    user
  ) {

    openModal(
      "Registration Successful",

      `
      <div class="success">

        <strong>
          ${escapeHtml(user.name)}
        </strong>

        <br><br>

        Registration ID:

        <strong>
          ${escapeHtml(
            user.registrationId
          )}
        </strong>

        <br>

        Serial Number:

        <strong>
          ${escapeHtml(
            user.serialNumber
          )}
        </strong>

        <br><br>

        <strong>
          REGISTRATION SUCCESSFUL
        </strong>

        <br><br>

        Web Development:

        <span class="badge">
          FREE
        </span>

        <br>

        Digital Marketing:

        <span class="badge">
          FREE
        </span>

      </div>

      <button
        type="button"
        class="modal-button"
        id="successOk">

        Continue

      </button>
      `
    );


    document
      .getElementById("successOk")
      .addEventListener(
        "click",
        showProfile
      );
  }


  /* =========================================
     VERIFY & LOGIN
     ========================================= */

  function showLogin() {

    openModal(
      "Verify & Login",

      `
      <p class="info">

        Enter your Registration ID
        to verify on this device.

      </p>

      <div class="form-grid">

        <input
          id="loginId"
          placeholder="Registration ID"
          autocomplete="off"
          maxlength="30">

        <button
          type="button"
          class="modal-button"
          id="loginVerifyBtn">

          Verify & Login

        </button>

      </div>
      `
    );


    document
      .getElementById("loginVerifyBtn")
      .addEventListener(
        "click",
        function () {

          const currentUser =
            getUser();


          const enteredId =
            document
              .getElementById(
                "loginId"
              )
              .value
              .trim();


          if (
            currentUser &&
            enteredId &&
            currentUser.registrationId
              .toLowerCase() ===
              enteredId.toLowerCase()
          ) {

            showProfile();

          } else {

            alert(
              "Registration ID was not found on this device."
            );
          }
        }
      );
  }


  /* =========================================
     STUDENT DASHBOARD
     ========================================= */

  function showProfile() {

    const user = getUser();


    if (!user) {

      showLogin();

      return;
    }


    const totalStudents =
      localStorage.getItem(
        TOTAL_KEY
      ) ||
      user.serialNumber ||
      "1";


    const paidCourses =
      user.paidCourses || [];


    openModal(
      "Student Dashboard",

      `
      <div class="profile">

        <div>
          <strong>Name:</strong>
          ${escapeHtml(user.name)}
        </div>

        <div>
          <strong>Registration ID:</strong>
          ${escapeHtml(
            user.registrationId
          )}
        </div>

        <div>
          <strong>Serial Number:</strong>
          ${escapeHtml(
            user.serialNumber
          )}
        </div>

        <div>
          <strong>
            Total Students:
          </strong>
          ${escapeHtml(
            totalStudents
          )}
        </div>

        <br>

        <div>
          <strong>
            Free Courses:
          </strong>

          Web Development,
          Digital Marketing
        </div>

        <br>

        <div>
          <strong>
            Paid / Unlocked Courses:
          </strong>

          ${
            paidCourses.length
              ? paidCourses
                  .map(escapeHtml)
                  .join(", ")
              : "None"
          }

        </div>

      </div>

      <button
        type="button"
        class="modal-button"
        id="dashboardCloseBtn">

        Close

      </button>
      `
    );


    document
      .getElementById(
        "dashboardCloseBtn"
      )
      .addEventListener(
        "click",
        closeModal
      );
  }


  /* =========================================
     REGISTRATION REQUIRED
     ========================================= */

  function showRegistrationRequired() {

    openModal(
      "Registration Required",

      `
      <div class="notice">

        Please complete your
        ৳30 Registration first.

        <br><br>

        After successful registration:

        <br>

        Web Development
        and
        Digital Marketing
        will be FREE.

      </div>

      <button
        type="button"
        class="modal-button"
        id="goRegistrationBtn">

        Registration

      </button>
      `
    );


    document
      .getElementById(
        "goRegistrationBtn"
      )
      .addEventListener(
        "click",
        showRegistration
      );
  }


  /* =========================================
     COURSE SYSTEM
     ========================================= */

  function showCourse(
    course,
    price
  ) {

    const user = getUser();


    /* FREE COURSES */

    if (
      FREE_COURSES.includes(course)
    ) {

      if (!user) {

        showRegistrationRequired();

        return;
      }


      openModal(
        course,

        `
        <div class="success">

          <strong>
            ${escapeHtml(course)}
          </strong>

          <br><br>

          This course is

          <span class="badge">
            FREE
          </span>

          for your registered account.

          <br><br>

          No payment is required.

        </div>
        `
      );


      return;
    }


    /* PAID COURSES */

    if (!user) {

      showRegistrationRequired();

      return;
    }


    if (
      !Object.prototype.hasOwnProperty.call(
        PAID_COURSES,
        course
      )
    ) {

      alert(
        "Course information is unavailable."
      );

      return;
    }


    const actualPrice =
      Number(price) ||
      PAID_COURSES[course];


    const paidCourses =
      user.paidCourses || [];


    /* ALREADY PAID */

    if (
      paidCourses.includes(course)
    ) {

      openModal(
        course,

        `
        <div class="success">

          <strong>
            ${escapeHtml(course)}
          </strong>

          <br><br>

          This course is already

          <span class="badge">
            FREE
          </span>

          for your account.

          <br><br>

          No additional payment
          is required.

        </div>
        `
      );


      return;
    }


    sessionStorage.setItem(
      PENDING_COURSE_KEY,
      course
    );


    openModal(
      course,

      paymentHTML(
        actualPrice,
        `${course} — ৳${actualPrice}`,
        "coursePayBtn"
      )
    );


    attachCopyButton();


    document
      .getElementById("coursePayBtn")
      .addEventListener(
        "click",
        function () {

          const transactionId =
            document
              .getElementById(
                "transactionId"
              )
              .value
              .trim();


          if (!transactionId) {

            alert(
              "Please enter the Transaction ID."
            );

            return;
          }


          const currentUser =
            getUser();


          if (!currentUser) {

            showRegistrationRequired();

            return;
          }


          currentUser.paidCourses =
            currentUser.paidCourses ||
            [];


          if (
            !currentUser.paidCourses.includes(
              course
            )
          ) {

            currentUser.paidCourses.push(
              course
            );
          }


          currentUser.courseTransactions =
            currentUser.courseTransactions ||
            {};


          currentUser.courseTransactions[
            course
          ] = transactionId;


          saveUser(currentUser);


          sessionStorage.removeItem(
            PENDING_COURSE_KEY
          );


          openModal(
            "Payment Submitted",

            `
            <div class="success">

              Transaction ID received
              for

              <strong>
                ${escapeHtml(course)}
              </strong>

              <br><br>

              Course status:

              <span class="badge">
                FREE
              </span>

            </div>

            <button
              type="button"
              class="modal-button"
              id="courseDoneBtn">

              Open Dashboard

            </button>
            `
          );


          document
            .getElementById(
              "courseDoneBtn"
            )
            .addEventListener(
              "click",
              showProfile
            );
        }
      );
  }


  /* =========================================
     WHATSAPP
     ========================================= */

  function openWhatsApp() {

    window.open(
      "https://wa.me/" +
      WHATSAPP_NUMBER,
      "_blank",
      "noopener,noreferrer"
    );
  }


  /* =========================================
     MAIN BUTTONS
     ========================================= */

  const menuButton =
    document.getElementById(
      "menuBtn"
    );

  if (menuButton) {

    menuButton.addEventListener(
      "click",
      showMenu
    );
  }


  const registrationButton =
    document.getElementById(
      "registrationBtn"
    );

  if (registrationButton) {

    registrationButton.addEventListener(
      "click",
      showRegistration
    );
  }


  const whatsappButton =
    document.getElementById(
      "whatsappBtn"
    );

  if (whatsappButton) {

    whatsappButton.addEventListener(
      "click",
      openWhatsApp
    );
  }


  /* =========================================
     COURSE BUTTONS
     ========================================= */

  document
    .querySelectorAll("[data-course]")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const course =
            button.dataset.course;

          const price =
            Number(
              button.dataset.price
            ) || PAID_COURSES[course] || 0;


          showCourse(
            course,
            price
          );
        }
      );
    });


  /* =========================================
     MODAL CLOSE
     ========================================= */

  if (modalClose) {

    modalClose.addEventListener(
      "click",
      closeModal
    );
  }


  if (modalOverlay) {

    modalOverlay.addEventListener(
      "click",
      closeModal
    );
  }


  /* =========================================
     ESC KEY
     ========================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        modal &&
        modal.classList.contains("active")
      ) {

        closeModal();
      }
    }
  );

})();
