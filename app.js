"use strict";

(function () {
  var usedIds = createRandomIds(50);
  var users = loadUsers();
  var currentUser = null;
  var checkedId = "";

  var authModal = document.getElementById("authModal");
  var loginForm = document.getElementById("loginForm");
  var signupForm = document.getElementById("signupForm");
  var loginMessage = document.getElementById("loginMessage");
  var signupMessage = document.getElementById("signupMessage");
  var signupPhone = document.getElementById("signupPhone");
  var signupEmail = document.getElementById("signupEmail");
  var signupId = document.getElementById("signupId");
  var signupPassword = document.getElementById("signupPassword");
  var signupPasswordConfirm = document.getElementById("signupPasswordConfirm");
  var phoneHint = document.getElementById("phoneHint");
  var emailHint = document.getElementById("emailHint");
  var idHint = document.getElementById("idHint");
  var passwordHint = document.getElementById("passwordHint");
  var confirmHint = document.getElementById("confirmHint");
  var welcomeName = document.getElementById("welcomeName");
  var welcomeText = document.getElementById("welcomeText");
  var openLoginBtn = document.getElementById("openLoginBtn");
  var reviewActionBtn = document.getElementById("reviewActionBtn");

  function createRandomIds(count) {
    var adjectives = ["green", "blue", "smart", "pass", "study", "happy", "fast", "daily", "bright", "solid"];
    var nouns = ["coder", "learner", "tiger", "runner", "planner", "master", "pilot", "maker", "hero", "worker"];
    var ids = [];

    while (ids.length < count) {
      var id = adjectives[Math.floor(Math.random() * adjectives.length)] +
        nouns[Math.floor(Math.random() * nouns.length)] +
        Math.floor(100 + Math.random() * 900);
      if (ids.indexOf(id) === -1) ids.push(id);
    }

    return ids;
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem("landing_users")) || [];
    } catch (error) {
      return [];
    }
  }

  function saveUsers() {
    localStorage.setItem("landing_users", JSON.stringify(users));
  }

  function openAuth(panelId) {
    authModal.hidden = false;
    switchPanel(panelId || "loginPanel");
  }

  function closeAuth() {
    authModal.hidden = true;
    loginMessage.textContent = "";
    signupMessage.textContent = "";
  }

  function switchPanel(panelId) {
    document.querySelectorAll(".auth-tab").forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-panel") === panelId);
    });
    document.querySelectorAll(".auth-panel").forEach(function (panel) {
      panel.classList.toggle("active", panel.id === panelId);
    });
  }

  function setHint(input, hint, message, statusClass) {
    hint.textContent = message;
    hint.classList.remove("is-info", "is-valid", "is-invalid");
    input.classList.remove("valid", "invalid");

    if (statusClass) {
      hint.classList.add(statusClass);
      if (statusClass === "is-valid") input.classList.add("valid");
      if (statusClass === "is-invalid") input.classList.add("invalid");
    }
  }

  function isValidPhone(value) {
    return /^010\d{7,8}$/.test(value);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function isValidUserId(value) {
    return /^[A-Za-z0-9]{4,16}$/.test(value);
  }

  function isValidPassword(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
  }

  function userExists(id) {
    return usedIds.indexOf(id) !== -1 || users.some(function (user) {
      return user.id === id;
    });
  }

  function updateLoginState(user) {
    currentUser = user;
    welcomeName.textContent = user.id + "님";
    welcomeText.textContent = "환영합니다. 이제 후기 작성과 관심 자격증 저장 기능을 사용할 수 있습니다.";
    openLoginBtn.textContent = "로그아웃";
    reviewActionBtn.textContent = "후기 작성";
  }

  signupPhone.addEventListener("input", function () {
    var onlyNumbers = signupPhone.value.replace(/\D/g, "");
    signupPhone.value = onlyNumbers;

    if (!onlyNumbers) {
      setHint(signupPhone, phoneHint, "숫자만 입력할 수 있습니다.", "is-info");
    } else if (isValidPhone(onlyNumbers)) {
      setHint(signupPhone, phoneHint, "사용 가능한 전화번호입니다.", "is-valid");
    } else {
      setHint(signupPhone, phoneHint, "010으로 시작하는 10~11자리 숫자를 입력하세요.", "is-invalid");
    }
  });

  signupEmail.addEventListener("input", function () {
    if (isValidEmail(signupEmail.value.trim())) {
      setHint(signupEmail, emailHint, "사용 가능한 이메일입니다.", "is-valid");
    } else {
      setHint(signupEmail, emailHint, "이메일 형식이 올바르지 않습니다.", "is-invalid");
    }
  });

  signupId.addEventListener("input", function () {
    checkedId = "";
    var value = signupId.value.trim();
    if (!value) {
      setHint(signupId, idHint, "아이디를 입력한 뒤 중복 확인을 눌러주세요.", "is-info");
    } else if (!isValidUserId(value)) {
      setHint(signupId, idHint, "아이디는 4~16자 영문/숫자만 사용할 수 있습니다.", "is-invalid");
    } else {
      setHint(signupId, idHint, "중복 확인이 필요합니다.", "is-info");
    }
  });

  document.getElementById("checkIdBtn").addEventListener("click", function () {
    var value = signupId.value.trim();

    if (!isValidUserId(value)) {
      setHint(signupId, idHint, "아이디는 4~16자 영문/숫자만 사용할 수 있습니다.", "is-invalid");
      return;
    }

    if (userExists(value)) {
      checkedId = "";
      setHint(signupId, idHint, "이미 사용 중인 아이디입니다.", "is-invalid");
    } else {
      checkedId = value;
      setHint(signupId, idHint, "사용 가능한 아이디입니다.", "is-valid");
    }
  });

  signupPassword.addEventListener("input", function () {
    if (isValidPassword(signupPassword.value)) {
      setHint(signupPassword, passwordHint, "안전한 비밀번호입니다.", "is-valid");
    } else {
      setHint(signupPassword, passwordHint, "8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.", "is-invalid");
    }
    validateConfirmPassword();
  });

  signupPasswordConfirm.addEventListener("input", validateConfirmPassword);

  function validateConfirmPassword() {
    if (!signupPasswordConfirm.value) {
      setHint(signupPasswordConfirm, confirmHint, "비밀번호를 한 번 더 입력하세요.", "is-info");
    } else if (signupPassword.value === signupPasswordConfirm.value) {
      setHint(signupPasswordConfirm, confirmHint, "비밀번호가 일치합니다.", "is-valid");
    } else {
      setHint(signupPasswordConfirm, confirmHint, "비밀번호가 일치하지 않습니다.", "is-invalid");
    }
  }

  document.querySelectorAll(".toggle-password").forEach(function (button) {
    button.addEventListener("click", function () {
      var input = document.getElementById(button.getAttribute("data-target"));
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-label", show ? "비밀번호 숨기기" : "비밀번호 보기");
    });
  });

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var id = signupId.value.trim();
    var email = signupEmail.value.trim();
    var phone = signupPhone.value.trim();
    var password = signupPassword.value;

    if (!isValidPhone(phone) || !isValidEmail(email) || !isValidUserId(id) || checkedId !== id || !isValidPassword(password) || password !== signupPasswordConfirm.value) {
      signupMessage.textContent = "입력값과 중복 확인을 다시 확인해주세요.";
      signupMessage.className = "form-message is-invalid";
      return;
    }

    var user = { id: id, email: email, phone: phone, password: password };
    users.push(user);
    saveUsers();
    updateLoginState(user);
    alert("환영합니다, " + id + "님!");
    signupForm.reset();
    checkedId = "";
    closeAuth();
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var id = document.getElementById("loginId").value.trim();
    var password = document.getElementById("loginPassword").value;
    var user = users.find(function (item) {
      return item.id === id && item.password === password;
    });

    if (!user) {
      loginMessage.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
      loginMessage.className = "form-message is-invalid";
      return;
    }

    updateLoginState(user);
    loginForm.reset();
    closeAuth();
  });

  openLoginBtn.addEventListener("click", function () {
    if (currentUser) {
      currentUser = null;
      welcomeName.textContent = "비회원";
      welcomeText.textContent = "로그인하면 후기를 작성하고 관심 자격증을 저장할 수 있습니다.";
      openLoginBtn.textContent = "로그인";
      reviewActionBtn.textContent = "로그인 후 작성";
      return;
    }
    openAuth("loginPanel");
  });

  document.getElementById("heroLoginBtn").addEventListener("click", function () {
    openAuth("loginPanel");
  });

  document.getElementById("heroSignupBtn").addEventListener("click", function () {
    openAuth("signupPanel");
  });

  reviewActionBtn.addEventListener("click", function () {
    if (!currentUser) {
      openAuth("loginPanel");
      return;
    }
    alert(currentUser.id + "님, 후기 작성 기능을 사용할 수 있습니다.");
  });

  document.getElementById("closeAuthBtn").addEventListener("click", closeAuth);

  authModal.addEventListener("click", function (event) {
    if (event.target === authModal) closeAuth();
  });

  document.querySelectorAll(".auth-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchPanel(tab.getAttribute("data-panel"));
    });
  });

  setHint(signupPhone, phoneHint, "숫자만 입력할 수 있습니다.", "is-info");
  setHint(signupId, idHint, "아이디를 입력한 뒤 중복 확인을 눌러주세요.", "is-info");
  validateConfirmPassword();
})();
