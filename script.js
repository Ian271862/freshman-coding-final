const WEATHER_API_KEY = "b7efa27cad39347c3d0075af7b170cd4";

let tasks = [];

const quotes = [
  "Great job!",
  "You’re crushing it!",
  "Keep going!",
  "Momentum creates success.",
  "Nice work!",
  "One more win today.",
  "Stay consistent.",
  "You did it!",
  "Progress matters.",
  "Excellent work!"
];

const $ = id => document.getElementById(id);

let currentDate = new Date();
let currentView = "month";

const months = [
  "January","February","March",
  "April","May","June",
  "July","August","September",
  "October","November","December"
];

const days = [
  "Sun","Mon","Tue",
  "Wed","Thu","Fri","Sat"
];

/* =========================
   NOTIFICATIONS
========================= */

async function enableNotifications() {

  if (!("Notification" in window)) {
    alert("Notifications are not supported.");
    return;
  }

  if (Notification.permission === "granted") {

    new Notification(
      "Notifications Enabled 🔔",
      {
        body: "Smart reminders are active."
      }
    );

    return;
  }

  const permission =
    await Notification.requestPermission();

  if (permission === "granted") {

    new Notification(
      "Notifications Enabled 🔔",
      {
        body: "Smart reminders are active."
      }
    );

  } else {

    alert("Notifications blocked.");

  }

}

/* =========================
   WEATHER
========================= */

async function getWeatherTasks() {

  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(

    async position => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
        );

        const data = await response.json();

        if (!data.list) {
          alert("Weather API error.");
          return;
        }

        const forecast = data.list[0];

        const weather =
          forecast.weather[0].main.toLowerCase();

        const temp =
          forecast.main.temp;

        if (weather.includes("rain")) {

          createWeatherTask(
            "Take an umbrella ☔",
            "Rain expected today."
          );

        }

        if (temp >= 90) {

          createWeatherTask(
            "Drink extra water 🥤",
            "Hot weather expected."
          );

        }

        if (temp <= 45) {

          createWeatherTask(
            "Bring a jacket 🧥",
            "Cold weather expected."
          );

        }

        renderTasks();
        renderCalendar();

        alert(
          "Weather smart tasks updated."
        );

      } catch (error) {

        console.error(error);

        alert(
          "Could not load weather."
        );

      }

    }

  );

}

function createWeatherTask(title, description) {

  const exists = tasks.some(
    t => t.text === title
  );

  if (exists) return;

  tasks.push({
    id: Date.now() + Math.random(),
    text: title,
    description,
    priority: "medium",
    dueDate: new Date()
      .toISOString()
      .slice(0,16),
    recurring: "none",
    done: false
  });

}

/* =========================
   TASKS
========================= */

function addTask() {

  const text =
    $("taskInput").value.trim();

  if (!text) {
    alert("Enter a task.");
    return;
  }

  tasks.push({
    id: Date.now() + Math.random(),
    text,
    description:
      $("descriptionInput").value.trim(),
    priority:
      $("priority").value,
    dueDate:
      $("dueDate").value,
    recurring:
      $("recurring").value,
    done: false
  });

  $("taskInput").value = "";
  $("descriptionInput").value = "";
  $("dueDate").value = "";
  $("recurring").value = "none";

  renderTasks();
  renderCalendar();

}

function toggleTask(id) {

  const task =
    tasks.find(t => t.id === id);

  if (!task) return;

  task.done = !task.done;

  showPopup();

  renderTasks();
  renderCalendar();

}

function deleteTask(id) {

  tasks =
    tasks.filter(
      t => t.id !== id
    );

  renderTasks();
  renderCalendar();

}

function editTask(id) {

  const task =
    tasks.find(t => t.id === id);

  if (!task) return;

  const newText =
    prompt(
      "Edit task name:",
      task.text
    );

  if (newText === null) return;

  task.text = newText;

  const newDescription =
    prompt(
      "Edit description:",
      task.description
    );

  if (newDescription !== null) {

    task.description =
      newDescription;

  }

  renderTasks();
  renderCalendar();

}

function getCountdown(date) {

  if (!date) return "";

  const target = new Date(date);

  const diff =
    target - new Date();

  if (diff <= 0)
    return "Overdue";

  const d =
    Math.floor(diff / 86400000);

  const h =
    Math.floor(diff / 3600000 % 24);

  const m =
    Math.floor(diff / 60000 % 60);

  return `${d}d ${h}h ${m}m`;

}

function renderTasks() {

  const taskList = $("taskList");

  if (!taskList) return;

  taskList.innerHTML = tasks.map(task => {

    return `
<div class="task ${task.done ? "done" : ""}">

  <div class="task-left">

    <h3>${task.text}</h3>

    <div class="description">
      ${task.description || ""}
    </div>

    <span class="badge ${task.priority}">
      ${task.priority.toUpperCase()}
    </span>

    <br><br>

    ${
      task.dueDate
      ? `<strong>Due:</strong>
         ${new Date(task.dueDate).toLocaleString()}`
      : ""
    }

    <br><br>

    ${getCountdown(task.dueDate)}

    ${
      task.recurring !== "none"
      ? `<div class="repeat-label">
           🔁 ${task.recurring}
         </div>`
      : ""
    }

  </div>

  <div class="task-buttons">

    <button onclick="toggleTask(${task.id})">
      ${task.done ? "Undo" : "Done"}
    </button>

    <button onclick="editTask(${task.id})">
      Edit
    </button>

    <button onclick="deleteTask(${task.id})">
      Delete
    </button>

  </div>

</div>
`;

  }).join("");

}

/* =========================
   POPUP
========================= */

function showPopup() {

  const popup =
    document.createElement("div");

  popup.className = "popup";

  popup.innerHTML = `
<h3>Task Completed 🎉</h3>
<p>
${quotes[
Math.floor(
Math.random() * quotes.length
)
]}
</p>
`;

  document.body.appendChild(popup);

  setTimeout(
    () => popup.remove(),
    3000
  );

}

/* =========================
   CALENDAR
========================= */

function setView(view) {

  currentView = view;

  renderCalendar();

}

function renderCalendar() {

  const calendar =
    $("calendar");

  if (!calendar) return;

  calendar.innerHTML = "";

  const title = $("monthTitle");

  if (title) {

    title.textContent =
      `${months[currentDate.getMonth()]}
      ${currentDate.getFullYear()}`;

  }

  if (currentView === "month") {

    renderMonthView();

  } else if (
    currentView === "week"
  ) {

    renderWeekView();

  } else if (
    currentView === "day"
  ) {

    renderDayView();

  } else {

    renderYearView();

  }

}

function renderMonthView() {

  const calendar =
    $("calendar");

  calendar.className =
    "calendar-grid month-view";

  days.forEach(day => {

    calendar.innerHTML += `
<div class="day-name">
${day}
</div>
`;

  });

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay =
    new Date(year, month, 1)
    .getDay();

  const daysInMonth =
    new Date(year, month + 1, 0)
    .getDate();

  for (let i = 0; i < firstDay; i++) {

    calendar.innerHTML +=
      `<div class="empty"></div>`;

  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const date =
      `${year}-${String(month + 1)
      .padStart(2,"0")}-${String(day)
      .padStart(2,"0")}`;

    const taskHTML =
      tasks
      .filter(
        t =>
        t.dueDate &&
        t.dueDate.startsWith(date)
      )
      .map(
        t => `
<div class="calendar-task">
${t.text}
</div>
`
      )
      .join("");

    calendar.innerHTML += `

<div class="day"
onclick="selectDate('${date}')">

<div class="small-date">
${day}
</div>

${taskHTML}

</div>

`;

  }

}

function renderWeekView() {

  const calendar =
    $("calendar");

  calendar.className =
    "calendar-grid week-view";

  const start =
    new Date(currentDate);

  start.setDate(
    currentDate.getDate()
    - currentDate.getDay()
  );

  for (let i = 0; i < 7; i++) {

    const dayDate =
      new Date(start);

    dayDate.setDate(
      start.getDate() + i
    );

    const date =
      dayDate.toISOString()
      .split("T")[0];

    const taskHTML =
      tasks
      .filter(
        t =>
        t.dueDate &&
        t.dueDate.startsWith(date)
      )
      .map(
        t => `
<div class="calendar-task">
${t.text}
</div>
`
      )
      .join("");

    calendar.innerHTML += `

<div class="day"
onclick="selectDate('${date}')">

<div class="small-date">
${days[i]}
<br>
${dayDate.getMonth()+1}/${dayDate.getDate()}
</div>

${taskHTML}

</div>

`;

  }

}

function renderDayView() {

  const calendar =
    $("calendar");

  calendar.className =
    "calendar-grid day-view";

  const date =
    currentDate.toISOString()
    .split("T")[0];

  const taskHTML =
    tasks
    .filter(
      t =>
      t.dueDate &&
      t.dueDate.startsWith(date)
    )
    .map(
      t => `
<div class="calendar-task">
${t.text}
</div>
`
    )
    .join("");

  calendar.innerHTML = `

<div class="day large-day">

<h2>
${currentDate.toDateString()}
</h2>

${taskHTML}

</div>

`;

}

function renderYearView() {

  const calendar =
    $("calendar");

  calendar.className =
    "calendar-grid year-view";

  months.forEach((month, index) => {

    calendar.innerHTML += `

<div class="day month-box"
onclick="openMonth(${index})">

${month}

</div>

`;

  });

}

function openMonth(index) {

  currentDate.setMonth(index);

  currentView = "month";

  renderCalendar();

}

function selectDate(date) {

  const dueDate =
    $("dueDate");

  if (!dueDate) return;

  dueDate.value =
    `${date}T12:00`;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

function changeViewDate(direction) {

  if (currentView === "month") {

    currentDate.setMonth(
      currentDate.getMonth() + direction
    );

  }

  else if (currentView === "week") {

    currentDate.setDate(
      currentDate.getDate() + (7 * direction)
    );

  }

  else if (currentView === "day") {

    currentDate.setDate(
      currentDate.getDate() + direction
    );

  }

  else if (currentView === "year") {

    currentDate.setFullYear(
      currentDate.getFullYear() + direction
    );

  }

  renderCalendar();

}

/* =========================
   START
========================= */

window.onload = () => {

  renderTasks();
  renderCalendar();

};