const certifications = [
  {
    id: 1,
    name: "정보처리기사",
    examDate: "2026-03-15",
    category: "IT",
  },
  {
    id: 2,
    name: "SQLD",
    examDate: "2026-04-10",
    category: "IT",
  },
  {
    id: 3,
    name: "컴활 1급",
    examDate: "2026-02-28",
    category: "Office",
  }
];

function getDDay(date) {
  const today = new Date();
  const target = new Date(date);

  const diff = target - today;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renderDDay() {
  const ddayElement = document.querySelector(".kpi-dday");

  const nearestExam = certifications[0]; // 예시 (추후 정렬 가능)

  const dday = getDDay(nearestExam.examDate);

  ddayElement.innerHTML = `
    D-DAY<br><strong>${dday}</strong>
  `;
}

renderDDay();

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function toggleWish(certId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.includes(certId)) {
    wishlist = wishlist.filter(id => id !== certId);
  } else {
    wishlist.push(certId);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function isWished(id) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(id);
}

function renderCards() {
  const container = document.querySelector(".grid");

  container.innerHTML = certifications.map(cert => `
    <div class="card">
      <h3>${cert.name}</h3>
      <p>D-${getDDay(cert.examDate)}</p>

      <button onclick="toggleWish(${cert.id})">
        ${isWished(cert.id) ? "❤️ 찜됨" : "🤍 찜하기"}
      </button>
    </div>
  `).join("");
}

renderCards();

function login(id, pw) {
  const user = {
    id,
    pw,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function checkLogin() {
  const user = getUser();
  const authBtn = document.querySelector(".auth");

  if (user) {
    authBtn.innerHTML = `
      <span>${user.id}님</span>
      <button onclick="logout()">Logout</button>
    `;
  }
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

checkLogin();

function mockLogin() {
  const id = prompt("아이디 입력");
  const pw = prompt("비밀번호 입력");

  login(id, pw);
  checkLogin();
}

function renderCalendarList() {
  const calendar = document.querySelector(".calendar");

  calendar.innerHTML = certifications.map(cert => {
    const dday = getDDay(cert.examDate);

    let status = "safe";
    if (dday <= 7) status = "danger";
    else if (dday <= 30) status = "warning";

    return `
      <div class="calendar-item ${status}">
        <h4>${cert.name}</h4>
        <p>${cert.examDate}</p>
        <span>D-${dday}</span>
      </div>
    `;
  }).join("");
}