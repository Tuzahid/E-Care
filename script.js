(() => {
  "use strict";


  /* =========================================================
     E-CARE FINAL JAVASCRIPT
     ========================================================= */


  /* =========================================================
     PAYMENT / WHATSAPP
     ========================================================= */

  const PAYMENT_NUMBER = "01797937668";

  const WHATSAPP_NUMBER = "8801745221602";


  /* =========================================================
     LOCAL STORAGE KEYS
     ========================================================= */

  const USER_KEY =
    "ecare_user_v3";

  const TOTAL_KEY =
    "ecare_total_students_v3";

  const PENDING_REG_KEY =
    "ecare_pending_registration_v3";

  const PENDING_COURSE_KEY =
    "ecare_pending_course_v3";

  /*
     Permanent student database.
     Logout will NOT delete this database.
  */
  const USERS_DB_KEY =
    "ecare_users_database_v3";


  /* =========================================================
     COURSE INFORMATION
     ========================================================= */

  const FREE_COURSES = [
    "Web Development",
    "Digital Marketing"
  ];


  const PAID_COURSES = {
    "Graphic Design": 1000,
    "Video Editing": 800
  };


  /* =========================================================
     GET ELEMENTS
     ========================================================= */

  const modal =
    document.getElementById("modal");

  const modalTitle =
    document.getElementById("modalTitle");

  const modalContent =
    document.getElementById("modalContent");

  const modalClose =
    document.getElementById("modalClose");


  /* =========================================================
     REQUIRED ELEMENT CHECK
     ========================================================= */

  if (
    !modal ||
    !modalTitle ||
    !modalContent ||
    !modalClose
  ) {

    console.error(
      "E-Care: Required modal elements are missing."
    );

    return;
  }


  /* =========================================================
     USER DATA
     ========================================================= */

  function getUser() {

    try {

      return JSON.parse(
        localStorage.getItem(USER_KEY) || "null"
      );

    } catch (error) {

      console.error(
        "E-Care: Could not read user data.",
        error
      );

      return null;
    }
  }


  function saveUser(user) {

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  }


  /* =========================================================
     PERMANENT STUDENT DATABASE
     ========================================================= */

  function getUsersDatabase() {

    try {

      const users =
        JSON.parse(
          localStorage.getItem(
            USERS_DB_KEY
          ) || "[]"
        );


      return Array.isArray(users)
        ? users
        : [];

    } catch (error) {

      console.error(
        "E-Care: Could not read users database.",
        error
      );

      return [];
    }
  }


  function saveUsersDatabase(users) {

    localStorage.setItem(
      USERS_DB_KEY,
      JSON.stringify(users)
    );
  }


  function saveUserToDatabase(user) {

    if (
      !user ||
      !user.registrationId
    ) {

      return;
    }


    const users =
      getUsersDatabase();


    const index =
      users.findIndex(
        function(existingUser) {

          return (
            existingUser &&
            existingUser.registrationId &&
            existingUser.registrationId
              .trim()
              .toLowerCase() ===
            user.registrationId
              .trim()
              .toLowerCase()
          );

        }
      );


    if (index >= 0) {

      users[index] = user;

    } else {

      users.push(user);

    }


    saveUsersDatabase(users);
  }


  function findUserByRegistrationId(
    registrationId
  ) {

    if (!registrationId) {
      return null;
    }


    const users =
      getUsersDatabase();


    const normalizedId =
      String(registrationId)
        .trim()
        .toLowerCase();


    return (
      users.find(
        function(user) {

          return (
            user &&
            user.registrationId &&
            String(
              user.registrationId
            )
              .trim()
              .toLowerCase() ===
            normalizedId
          );

        }
      ) || null
    );
  }


  /* =========================================================
     MIGRATE CURRENT USER
     ========================================================= */

  /*
     If a student is already registered before this
     updated version is installed, their current record
     will automatically be added to the permanent database.
  */

  const existingUser =
    getUser();


  if (
    existingUser &&
    existingUser.registrationId
  ) {

    saveUserToDatabase(
      existingUser
    );
  }


  /* =========================================================
     MODAL
     ========================================================= */

  function openModal(title, html) {

    modalTitle.textContent =
      title;

    modalContent.innerHTML =
      html;

    modal.classList.add(
      "active"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";
  }


  function closeModal() {

    modal.classList.remove(
      "active"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";
  }


  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHtml(value) {

    return String(value).replace(
      /[&<>"']/g,
      function(character) {

        const characters = {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"

        };

        return characters[
          character
        ];
      }
    );
  }


  /* =========================================================
     COPY PAYMENT NUMBER
     ========================================================= */

  function copyNumber() {

    const number =
      PAYMENT_NUMBER;


    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      navigator.clipboard
        .writeText(number)

        .then(function() {

          alert(
            "Payment number copied:\n" +
            number
          );

        })

        .catch(function() {

          alert(
            "Payment Number:\n" +
            number
          );
        });

    } else {

      alert(
        "Payment Number:\n" +
        number
      );
    }
  }


  /* =========================================================
     PAYMENT INTERFACE
     ========================================================= */

  function paymentHTML(
    amount,
    label,
    submitId
  ) {

    return `

      <div class="payment-card">


        <!-- PAYMENT FEE -->

        <div class="payment-fee">

          <div class="payment-fee-left">

            <div class="payment-icon">
              💰
            </div>

            <div>

              <div class="payment-label">
                ${escapeHtml(label)}
              </div>

              <div class="payment-amount">
                ৳${escapeHtml(amount)}
              </div>

            </div>

          </div>

        </div>


        <!-- PAYMENT METHOD -->

        <div class="payment-title">
          Choose Payment Method
        </div>


        <div class="payment-methods">


          <!-- BKASH -->

          <button
            type="button"
            class="payment-method bkash-method"
            id="bkashPaymentBtn"
          >

            <div class="payment-logo">
              bKash
            </div>

            <div class="payment-method-text">
              bKash Send Money
            </div>

          </button>


          <!-- NAGAD -->

          <button
            type="button"
            class="payment-method nagad-method"
            id="nagadPaymentBtn"
          >

            <div class="payment-logo">
              নগদ
            </div>

            <div class="payment-method-text">
              Nagad Send Money
            </div>

          </button>


        </div>


        <!-- NUMBER BOX -->

        <div
          id="paymentNumberBox"
          class="payment-number-box"
        >

          <div
            id="paymentNumberTitle"
            class="payment-number-title"
          >
          </div>


          <div class="payment-number">
            ${PAYMENT_NUMBER}
          </div>


          <button
            type="button"
            class="copy-btn"
            id="copyPaymentNumber"
          >
            Copy Number
          </button>


          <div class="payment-instruction">
            Send exactly
            <strong>৳${escapeHtml(amount)}</strong>
            using Send Money.
          </div>

        </div>


        <!-- SECURITY -->

        <div class="secure-payment">
          🔒 Send Money &amp; Transaction ID
        </div>


        <!-- TRANSACTION -->

        <div class="form-grid">

          <div class="form-group">

            <label for="transactionId">
              Transaction ID
            </label>

            <input
              id="transactionId"
              type="text"
              placeholder="Enter Transaction ID"
              autocomplete="off"
              maxlength="100"
              required
            >

          </div>


          <button
            type="button"
            class="modal-button"
            id="${submitId}"
          >
            Submit Transaction ID
          </button>

        </div>


      </div>

    `;
  }


  /* =========================================================
     ATTACH PAYMENT BUTTONS
     ========================================================= */

  function attachPaymentButtons() {

    const bkashButton =
      document.getElementById(
        "bkashPaymentBtn"
      );

    const nagadButton =
      document.getElementById(
        "nagadPaymentBtn"
      );

    const numberBox =
      document.getElementById(
        "paymentNumberBox"
      );

    const numberTitle =
      document.getElementById(
        "paymentNumberTitle"
      );

    const copyButton =
      document.getElementById(
        "copyPaymentNumber"
      );


    function showPaymentNumber(
      type,
      selectedButton
    ) {

      if (!numberBox) {
        return;
      }


      numberBox.style.display =
        "block";


      if (numberTitle) {

        if (type === "bkash") {

          numberTitle.textContent =
            "bKash Send Money Number";

        } else {

          numberTitle.textContent =
            "Nagad Send Money Number";
        }
      }


      if (bkashButton) {

        bkashButton.classList.remove(
          "selected"
        );
      }


      if (nagadButton) {

        nagadButton.classList.remove(
          "selected"
        );
      }


      if (selectedButton) {

        selectedButton.classList.add(
          "selected"
        );
      }
    }


    if (bkashButton) {

      bkashButton.addEventListener(
        "click",
        function() {

          showPaymentNumber(
            "bkash",
            bkashButton
          );
        }
      );
    }


    if (nagadButton) {

      nagadButton.addEventListener(
        "click",
        function() {

          showPaymentNumber(
            "nagad",
            nagadButton
          );
        }
      );
    }


    if (copyButton) {

      copyButton.addEventListener(
        "click",
        copyNumber
      );
    }
  }


  /* =========================================================
     MENU
     ========================================================= */

  function showMenu() {

    const user =
      getUser();


    if (user) {

      openModal(
        "E-Care Menu",

        `

        <div class="menu-list">


          <button
            type="button"
            id="profileBtn"
          >
            My Profile
          </button>


          <button
            type="button"
            id="logoutBtn"
          >
            Logout
          </button>


        </div>

        `
      );


      const profileBtn =
        document.getElementById(
          "profileBtn"
        );

      const logoutBtn =
        document.getElementById(
          "logoutBtn"
        );


      if (profileBtn) {

        profileBtn.addEventListener(
          "click",
          showProfile
        );
      }


      if (logoutBtn) {

        logoutBtn.addEventListener(
          "click",
          logoutUser
        );
      }


    } else {

      openModal(
        "E-Care Menu",

        `

        <div class="menu-list">


          <button
            type="button"
            id="loginBtn"
          >
            Verify &amp; Login
          </button>


          <button
            type="button"
            id="menuRegBtn"
          >
            Registration
          </button>


        </div>

        `
      );


      const loginBtn =
        document.getElementById(
          "loginBtn"
        );

      const menuRegBtn =
        document.getElementById(
          "menuRegBtn"
        );


      if (loginBtn) {

        loginBtn.addEventListener(
          "click",
          showLogin
        );
      }


      if (menuRegBtn) {

        menuRegBtn.addEventListener(
          "click",
          showRegistration
        );
      }
    }
  }


  /* =========================================================
     LOGOUT
     ========================================================= */

  function logoutUser() {

    /*
       Only the active login is removed.
       Permanent student database remains safe.
    */

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


  /* =========================================================
     REGISTRATION FORM
     ========================================================= */

  function showRegistration() {

    const currentUser =
      getUser();


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
          id="openProfile"
        >
          Open Student Dashboard
        </button>

        `
      );


      const openProfile =
        document.getElementById(
          "openProfile"
        );


      if (openProfile) {

        openProfile.addEventListener(
          "click",
          showProfile
        );
      }


      return;
    }


    openModal(
      "Registration",

      `

      <p class="info">

        Fill in all information,
        then continue to the
        <strong>৳30 registration payment.</strong>

      </p>


      <form
        id="regForm"
        class="form-grid"
      >


        <!-- NAME -->

        <div class="form-group">

          <label for="regName">
            Full Name
          </label>

          <input
            id="regName"
            type="text"
            placeholder="Full Name"
            autocomplete="name"
            maxlength="80"
            required
          >

        </div>


        <!-- DIVISION -->

        <div class="form-group">

          <label for="regDivision">
            Division
          </label>

          <select
            id="regDivision"
            required
          >

            <option value="">
              Select Division
            </option>

            <option value="Dhaka">
              Dhaka
            </option>

            <option value="Chattogram">
              Chattogram
            </option>

            <option value="Rajshahi">
              Rajshahi
            </option>

            <option value="Khulna">
              Khulna
            </option>

            <option value="Barishal">
              Barishal
            </option>

            <option value="Sylhet">
              Sylhet
            </option>

            <option value="Rangpur">
              Rangpur
            </option>

            <option value="Mymensingh">
              Mymensingh
            </option>

          </select>

        </div>


        <!-- DISTRICT -->

        <div class="form-group">

          <label for="regDistrict">
            District
          </label>

          <select
            id="regDistrict"
            required
          >

            <option value="">
              Select District
            </option>


            <!-- DHAKA -->

            <optgroup label="Dhaka Division">

              <option value="ঢাকা">
                ঢাকা
              </option>

              <option value="ফরিদপুর">
                ফরিদপুর
              </option>

              <option value="গাজীপুর">
                গাজীপুর
              </option>

              <option value="গোপালগঞ্জ">
                গোপালগঞ্জ
              </option>

              <option value="কিশোরগঞ্জ">
                কিশোরগঞ্জ
              </option>

              <option value="মাদারীপুর">
                মাদারীপুর
              </option>

              <option value="মানিকগঞ্জ">
                মানিকগঞ্জ
              </option>

              <option value="মুন্সীগঞ্জ">
                মুন্সীগঞ্জ
              </option>

              <option value="নারায়ণগঞ্জ">
                নারায়ণগঞ্জ
              </option>

              <option value="নরসিংদী">
                নরসিংদী
              </option>

              <option value="রাজবাড়ী">
                রাজবাড়ী
              </option>

              <option value="শরীয়তপুর">
                শরীয়তপুর
              </option>

              <option value="টাঙ্গাইল">
                টাঙ্গাইল
              </option>

            </optgroup>


            <!-- KHULNA -->

            <optgroup label="Khulna Division">

              <option value="বাগেরহাট">
                বাগেরহাট
              </option>

              <option value="চুয়াডাঙ্গা">
                চুয়াডাঙ্গা
              </option>

              <option value="যশোর">
                যশোর
              </option>

              <option value="ঝিনাইদহ">
                ঝিনাইদহ
              </option>

              <option value="খুলনা">
                খুলনা
              </option>

              <option value="কুষ্টিয়া">
                কুষ্টিয়া
              </option>

              <option value="মাগুরা">
                মাগুরা
              </option>

              <option value="মেহেরপুর">
                মেহেরপুর
              </option>

              <option value="নড়াইল">
                নড়াইল
              </option>

              <option value="সাতক্ষীরা">
                সাতক্ষীরা
              </option>

            </optgroup>


            <!-- CHATTOGRAM -->

            <optgroup label="Chattogram Division">

              <option value="বান্দরবান">
                বান্দরবান
              </option>

              <option value="ব্রাহ্মণবাড়িয়া">
                ব্রাহ্মণবাড়িয়া
              </option>

              <option value="চাঁদপুর">
                চাঁদপুর
              </option>

              <option value="চট্টগ্রাম">
                চট্টগ্রাম
              </option>

              <option value="কুমিল্লা">
                কুমিল্লা
              </option>

              <option value="কক্সবাজার">
                কক্সবাজার
              </option>

              <option value="ফেনী">
                ফেনী
              </option>

              <option value="খাগড়াছড়ি">
                খাগড়াছড়ি
              </option>

              <option value="লক্ষ্মীপুর">
                লক্ষ্মীপুর
              </option>

              <option value="নোয়াখালী">
                নোয়াখালী
              </option>

              <option value="রাঙ্গামাটি পার্বত্য জেলা">
                রাঙ্গামাটি পার্বত্য জেলা
              </option>

            </optgroup>


            <!-- RAJSHAHI -->

            <optgroup label="Rajshahi Division">

              <option value="বগুড়া">
                বগুড়া
              </option>

              <option value="জয়পুরহাট">
                জয়পুরহাট
              </option>

              <option value="নওগাঁ">
                নওগাঁ
              </option>

              <option value="নাটোর">
                নাটোর
              </option>

              <option value="চাঁপাইনবাবগঞ্জ">
                চাঁপাইনবাবগঞ্জ
              </option>

              <option value="পাবনা">
                পাবনা
              </option>

              <option value="রাজশাহী">
                রাজশাহী
              </option>

              <option value="সিরাজগঞ্জ">
                সিরাজগঞ্জ
              </option>

            </optgroup>


            <!-- SYLHET -->

            <optgroup label="Sylhet Division">

              <option value="হবিগঞ্জ">
                হবিগঞ্জ
              </option>

              <option value="মৌলভীবাজার">
                মৌলভীবাজার
              </option>

              <option value="সুনামগঞ্জ">
                সুনামগঞ্জ
              </option>

              <option value="সিলেট">
                সিলেট
              </option>

            </optgroup>


            <!-- RANGPUR -->

            <optgroup label="Rangpur Division">

              <option value="দিনাজপুর">
                দিনাজপুর
              </option>

              <option value="গাইবান্ধা">
                গাইবান্ধা
              </option>

              <option value="কুড়িগ্রাম">
                কুড়িগ্রাম
              </option>

              <option value="লালমনিরহাট">
                লালমনিরহাট
              </option>

              <option value="নীলফামারী">
                নীলফামারী
              </option>

              <option value="পঞ্চগড়">
                পঞ্চগড়
              </option>

              <option value="রংপুর">
                রংপুর
              </option>

              <option value="ঠাকুরগাঁও">
                ঠাকুরগাঁও
              </option>

            </optgroup>


            <!-- MYMENSINGH -->

            <optgroup label="Mymensingh Division">

              <option value="জামালপুর">
                জামালপুর
              </option>

              <option value="ময়মনসিংহ">
                ময়মনসিংহ
              </option>

              <option value="নেত্রকোণা">
                নেত্রকোণা
              </option>

              <option value="শেরপুর">
                শেরপুর
              </option>

            </optgroup>


            <!-- BARISHAL -->

            <optgroup label="Barishal Division">

              <option value="বরগুনা">
                বরগুনা
              </option>

              <option value="বরিশাল">
                বরিশাল
              </option>

              <option value="ভোলা">
                ভোলা
              </option>

              <option value="ঝালকাঠি">
                ঝালকাঠি
              </option>

              <option value="পটুয়াখালী">
                পটুয়াখালী
              </option>

              <option value="পিরোজপুর">
                পিরোজপুর
              </option>

            </optgroup>

          </select>

        </div>


        <!-- MOBILE -->

        <div class="form-group">

          <label for="regMobile">
            Mobile Number
          </label>

          <input
            id="regMobile"
            type="tel"
            placeholder="Mobile Number"
            autocomplete="tel"
            maxlength="20"
            required
          >

        </div>


        <!-- GMAIL -->

        <div class="form-group">

          <label for="regGmail">
            Gmail
          </label>

          <input
            id="regGmail"
            type="email"
            placeholder="Gmail"
            autocomplete="email"
            maxlength="120"
            required
          >

        </div>


        <!-- PAYMENT BUTTON -->

        <button
          class="modal-button"
          type="submit"
        >
          Continue to Payment
        </button>


      </form>

      `
    );


    const registrationForm =
      document.getElementById(
        "regForm"
      );


    if (!registrationForm) {
      return;
    }


    registrationForm.addEventListener(
      "submit",
      function(event) {

        event.preventDefault();


        const name =
          document
            .getElementById("regName")
            .value
            .trim();


        const division =
          document
            .getElementById("regDivision")
            .value;


        const district =
          document
            .getElementById("regDistrict")
            .value;


        const mobile =
          document
            .getElementById("regMobile")
            .value
            .trim();


        const gmail =
          document
            .getElementById("regGmail")
            .value
            .trim();


        const data = {

          name:
            name,

          division:
            division,

          district:
            district,

          mobile:
            mobile,

          gmail:
            gmail
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


  /* =========================================================
     REGISTRATION PAYMENT
     ========================================================= */

  function showRegistrationPayment() {

    openModal(
      "Registration Payment",

      paymentHTML(
        30,
        "Registration Fee",
        "regPayBtn"
      )
    );


    attachPaymentButtons();


    const paymentButton =
      document.getElementById(
        "regPayBtn"
      );


    if (!paymentButton) {
      return;
    }


    paymentButton.addEventListener(
      "click",
      function() {

        const transactionInput =
          document.getElementById(
            "transactionId"
          );


        const transactionId =
          transactionInput
            ? transactionInput.value.trim()
            : "";


        if (!transactionId) {

          alert(
            "Please enter the Transaction ID."
          );

          if (transactionInput) {
            transactionInput.focus();
          }

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

          alert(
            "Registration information was lost. Please register again."
          );

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

          /*
             These two courses are automatically
             FREE after successful registration.
          */
          freeCourses:
            [...FREE_COURSES],

          courseTransactions:
            {}
        };


        /*
           Save active user.
        */
        saveUser(user);


        /*
           Save permanently in student database.
        */
        saveUserToDatabase(user);


        sessionStorage.removeItem(
          PENDING_REG_KEY
        );


        showRegistrationSuccess(
          user
        );
      }
    );
  }


  /* =========================================================
     REGISTRATION SUCCESS
     ========================================================= */

  function showRegistrationSuccess(
    user
  ) {

    openModal(
      "Registration Complete",

      `

      <div class="registration-success-card">


        <!-- SUCCESS ICON -->

        <div class="success-icon">
          ✓
        </div>


        <h3>
          Registration Successful!
        </h3>


        <p class="success-subtitle">
          Your registration is complete.
        </p>


        <!-- NAME + REGISTRATION ID -->

        <div class="registration-result">


          <div class="result-row">

            <span>
              Name
            </span>

            <strong>
              ${escapeHtml(
                user.name
              )}
            </strong>

          </div>


          <div class="result-row">

            <span>
              Registration ID
            </span>

            <strong>
              ${escapeHtml(
                user.registrationId
              )}
            </strong>

          </div>


        </div>


        <!-- REGISTRATION COMPLETE -->

        <div class="registration-complete">

          REGISTRATION COMPLETE

          <br><br>

          Web Development
          <span class="badge">
            FREE
          </span>

          <br>

          Digital Marketing
          <span class="badge">
            FREE
          </span>

        </div>


      </div>


      <button
        type="button"
        class="modal-button"
        id="successOk"
      >
        Go to My Account →
      </button>

      `
    );


    const successButton =
      document.getElementById(
        "successOk"
      );


    if (successButton) {

      successButton.addEventListener(
        "click",
        showProfile
      );
    }
  }


  /* =========================================================
     LOGIN
     ========================================================= */

  function showLogin() {

    openModal(
      "Verify & Login",

      `

      <p class="info">

        Enter your Registration ID
        to verify on this device.

      </p>


      <div class="form-grid">


        <div class="form-group">

          <label for="loginId">
            Registration ID
          </label>

          <input
            id="loginId"
            type="text"
            placeholder="Registration ID"
            autocomplete="off"
            maxlength="30"
          >

        </div>


        <button
          type="button"
          class="modal-button"
          id="loginVerifyBtn"
        >
          Verify &amp; Login
        </button>


      </div>

      `
    );


    const loginButton =
      document.getElementById(
        "loginVerifyBtn"
      );


    if (!loginButton) {
      return;
    }


    loginButton.addEventListener(
      "click",
      function() {

        const input =
          document.getElementById(
            "loginId"
          );


        const enteredId =
          input
            ? input.value.trim()
            : "";


        if (!enteredId) {

          alert(
            "Please enter your Registration ID."
          );

          if (input) {
            input.focus();
          }

          return;
        }


        /*
           Search the permanent student database,
           NOT only the currently logged-in user.
        */

        const foundUser =
          findUserByRegistrationId(
            enteredId
          );


        if (foundUser) {

          /*
             Restore the complete student record
             as the active user on this device.
          */

          saveUser(
            foundUser
          );


          showProfile();

        } else {

          alert(
            "Registration ID was not found."
          );
        }
      }
    );
  }


  /* =========================================================
     STUDENT PROFILE
     ========================================================= */

  function showProfile() {

    const user =
      getUser();


    if (!user) {

      showLogin();

      return;
    }


    /*
       Ensure older/current records always remain
       synchronized with the permanent database.
    */

    saveUserToDatabase(
      user
    );


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


        <h3>
          Student Information
        </h3>


        <div class="info">

          <strong>
            Name:
          </strong>

          ${escapeHtml(
            user.name
          )}

        </div>


        <div class="info">

          <strong>
            Registration ID:
          </strong>

          ${escapeHtml(
            user.registrationId
          )}

        </div>


        <div class="info">

          <strong>
            Serial Number:
          </strong>

          ${escapeHtml(
            user.serialNumber
          )}

        </div>


        <div class="info">

          <strong>
            Division:
          </strong>

          ${escapeHtml(
            user.division
          )}

        </div>


        <div class="info">

          <strong>
            District:
          </strong>

          ${escapeHtml(
            user.district
          )}

        </div>


        <div class="info">

          <strong>
            Mobile:
          </strong>

          ${escapeHtml(
            user.mobile
          )}

        </div>


        <div class="info">

          <strong>
            Gmail:
          </strong>

          ${escapeHtml(
            user.gmail
          )}

        </div>


        <div class="info">

          <strong>
            Total Students:
          </strong>

          ${escapeHtml(
            totalStudents
          )}

        </div>


        <br>


        <!-- FREE COURSES -->

        <div class="info">

          <strong>
            Free Courses:
          </strong>

          <br><br>


          <span class="badge">
            Web Development — FREE
          </span>


          <span class="badge">
            Digital Marketing — FREE
          </span>

        </div>


        <br>


        <!-- UNLOCKED COURSES -->

        <div class="info">

          <strong>
            Paid / Unlocked Courses:
          </strong>

          <br><br>


          ${
            paidCourses.length

              ? paidCourses
                  .map(
                    function(course) {

                      return `

                        <span class="badge">

                          ${escapeHtml(
                            course
                          )}

                          — FREE

                        </span>

                      `;

                    }
                  )
                  .join("")

              : "None"
          }


        </div>


      </div>


      <button
        type="button"
        class="modal-button"
        id="dashboardCloseBtn"
      >
        Close
      </button>

      `
    );


    const dashboardClose =
      document.getElementById(
        "dashboardCloseBtn"
      );


    if (dashboardClose) {

      dashboardClose.addEventListener(
        "click",
        closeModal
      );
    }
  }


  /* =========================================================
     REGISTRATION REQUIRED
     ========================================================= */

  function showRegistrationRequired() {

    openModal(
      "Registration Required",

      `

      <div class="notice">

        Please complete your
        <strong>৳30 Registration</strong>
        first.

        <br><br>

        After successful registration:

        <br><br>

        Web Development
        and
        Digital Marketing
        will be

        <strong>
          FREE
        </strong>.

      </div>


      <button
        type="button"
        class="modal-button"
        id="goRegistrationBtn"
      >
        Registration
      </button>

      `
    );


    const button =
      document.getElementById(
        "goRegistrationBtn"
      );


    if (button) {

      button.addEventListener(
        "click",
        showRegistration
      );
    }
  }


  /* =========================================================
     COURSE SYSTEM
     ========================================================= */

  function showCourse(
    course,
    price
  ) {

    const user =
      getUser();


    /* =======================================================
       FREE COURSE
       ======================================================= */

    if (
      FREE_COURSES.includes(course)
    ) {

      if (!user) {

        showRegistrationRequired();

        return;
      }


      /*
         Make sure these courses are recorded
         as free for this registered student.
      */

      user.freeCourses =
        user.freeCourses || [];


      FREE_COURSES.forEach(
        function(freeCourse) {

          if (
            !user.freeCourses.includes(
              freeCourse
            )
          ) {

            user.freeCourses.push(
              freeCourse
            );
          }

        }
      );


      saveUser(user);

      saveUserToDatabase(user);


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


    /* =======================================================
       PAID COURSE
       ======================================================= */

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


    /* ALREADY UNLOCKED */

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
        course + " Payment",
        "coursePayBtn"
      )
    );


    attachPaymentButtons();


    const coursePayButton =
      document.getElementById(
        "coursePayBtn"
      );


    if (!coursePayButton) {
      return;
    }


    coursePayButton.addEventListener(
      "click",
      function() {

        const transactionInput =
          document.getElementById(
            "transactionId"
          );


        const transactionId =
          transactionInput
            ? transactionInput.value.trim()
            : "";


        if (!transactionId) {

          alert(
            "Please enter the Transaction ID."
          );

          if (transactionInput) {
            transactionInput.focus();
          }

          return;
        }


        const currentUser =
          getUser();


        if (!currentUser) {

          showRegistrationRequired();

          return;
        }


        currentUser.paidCourses =
          currentUser.paidCourses || [];


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
        ] =
          transactionId;


        /*
           Save both active user and
           permanent student database.
        */

        saveUser(
          currentUser
        );


        saveUserToDatabase(
          currentUser
        );


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
            id="courseDoneBtn"
          >
            Open Dashboard
          </button>

          `
        );


        const doneButton =
          document.getElementById(
            "courseDoneBtn"
          );


        if (doneButton) {

          doneButton.addEventListener(
            "click",
            showProfile
          );
        }
      }
    );
  }


  /* =========================================================
     WHATSAPP
     ========================================================= */

  function openWhatsApp() {

    window.open(
      "https://wa.me/" +
      WHATSAPP_NUMBER,
      "_blank",
      "noopener,noreferrer"
    );
  }


  /* =========================================================
     MAIN BUTTONS
     ========================================================= */

  const menuButton =
    document.getElementById(
      "menuButton"
    );


  if (menuButton) {

    menuButton.addEventListener(
      "click",
      showMenu
    );
  }


  const registrationButton =
    document.getElementById(
      "registrationButton"
    );


  if (registrationButton) {

    registrationButton.addEventListener(
      "click",
      showRegistration
    );
  }


  const whatsappButton =
    document.getElementById(
      "whatsappButton"
    );


  if (whatsappButton) {

    whatsappButton.addEventListener(
      "click",
      openWhatsApp
    );
  }


  /* =========================================================
     COURSE BUTTONS
     ========================================================= */

  document
    .querySelectorAll(
      ".course-area[data-course]"
    )
    .forEach(
      function(button) {

        button.addEventListener(
          "click",
          function() {

            const course =
              button.getAttribute(
                "data-course"
              );


            const dataPrice =
              Number(
                button.getAttribute(
                  "data-price"
                )
              );


            const price =
              dataPrice ||
              PAID_COURSES[course] ||
              0;


            showCourse(
              course,
              price
            );
          }
        );
      }
    );


  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  modalClose.addEventListener(
    "click",
    closeModal
  );


  /* =========================================================
     CLICK OUTSIDE MODAL
     ========================================================= */

  modal.addEventListener(
    "click",
    function(event) {

      if (
        event.target === modal
      ) {

        closeModal();
      }
    }
  );


  /* =========================================================
     ESC KEY
     ========================================================= */

  document.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Escape" &&
        modal.classList.contains("active")
      ) {

        closeModal();
      }
    }
  );


  /* =========================================================
     INITIAL STATE
     ========================================================= */

  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  console.log(
    "E-Care Final Website loaded successfully."
  );

})();
