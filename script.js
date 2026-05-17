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

/* =========================
   SAFE ELEMENT SELECTOR
========================= */

const $ = id => {

  const el =
    document.getElementById(id);

  if (!el) {

    console.error(
      `Missing element: ${id}`
    );

  }

  return el;

};

/* =========================
   NOTIFICATIONS
========================= */

async function enableNotifications() {

  if (!("Notification" in window)) {

    alert(
      "Notifications are not supported on this device."
    );

    return;

  }

  if (Notification.permission === "granted") {

    new Notification(
      "Notifications Already Enabled 🔔",
      {
        body: "Smart reminders are active."
      }
    );

    return;

  }

  if (Notification.permission === "denied") {

    alert(
      "Notifications are blocked in browser settings."
    );

    return;

  }

  const permission =
    await Notification.requestPermission();

  if (permission === "granted") {

    new Notification(
      "Notifications Enabled 🔔",
      {
        body: "Smart reminders are now active."
      }
    );

  } else {

    alert(
      "You chose not to enable notifications."
    );

  }

}

/* =========================
   WEATHER SMART TASKS
========================= */

async function getWeatherTasks() {

  if (!navigator.geolocation) {

    alert(
      "Geolocation is not supported."
    );

    return;

  }

  navigator.geolocation.getCurrentPosition(

    async position => {

      const lat =
        position.coords.latitude;

      const lon =
        position.coords.longitude;

      try {

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
        );

        const data =
          await response.json();

        if (data.cod !== "200") {

          alert(
            "Weather API failed. Check your API key."
          );

          return;

        }

        const forecast =
          data.list?.[0];

        if (!forecast) {

          alert(
            "Weather forecast unavailable."
          );

          return;

        }

        const weather =
          forecast.weather?.[0]?.main
          ?.toLowerCase() || "";

        const temp =
          forecast.main?.temp || 0;

        if (weather.includes("rain")) {

          createWeatherTask(
            "Take an umbrella ☔",
            "Rain is predicted today."
          );

          sendNotification(
            "Rain Expected ☔",
            "Take an umbrella today."
          );

        }

        if (weather.includes("snow")) {

          createWeatherTask(
            "Wear warm clothes ❄️",
            "Snow is predicted today."
          );

          sendNotification(
            "Snow Expected ❄️",
            "Wear warm clothes today."
          );

        }

        if (temp >= 90) {

          createWeatherTask(
            "Drink extra water 🥤",
            "Hot weather expected today."
          );

          sendNotification(
            "Hot Weather ☀️",
            "Stay hydrated today."
          );

        }

        if (temp <= 45) {

          createWeatherTask(
            "Bring a jacket 🧥",
            "Cold weather expected today."
          );

          sendNotification(
            "Cold Weather 🧥",
            "Bring a jacket today."
          );

        }

        alert(
          "Weather smart tasks updated successfully."
        );

        renderTasks();
        renderCalendar();

      } catch (error) {

        console.error(error);

        alert(
          "Could not connect to weather service."
        );

      }

    },

    error => {

      if (error.code === 1) {

        alert(
          "Location access denied."
        );

      } else {

        alert(
          "Unable to get location."
        );

      }

    }

  );

}

function createWeatherTask(
  title,
  description
) {

  const alreadyExists =
    tasks.some(
      t =>
      t.text === title &&
      !t.done
    );

  if (alreadyExists) return;

  tasks.push({
    id: Date.now() + Math.random(),
    text: title,
    description,
    priority: "medium",
    dueDate:
      new Date()
      .toISOString()
      .slice(0, 16),
    recurring: "none",
    done: false
  });

}

function sendNotification(
  title,
  body
) {

  if (
    "Notification" in window &&
    Notification.permission === "granted"
  ) {

    new Notification(title, {
      body
    });

  }

}

/* =========================
   TASKS
========================= */

function addTask() {

  const taskInput =
    $("taskInput");

  if (!taskInput) return;

  const text =
    taskInput.value.trim();

  if (!text) {

    alert(
      "Please enter a task."
    );

    return;

  }

  tasks.push({
    id: Date.now() + Math.random(),

    text,

    description:
      $("descriptionInput")?.value.trim() || "",

    priority:
      $("priority")?.value || "medium",

    dueDate:
      $("dueDate")?.value || "",

    recurring:
      $("recurring")?.value || "none",

    done: false
  });

  taskInput.value = "";

  if ($("descriptionInput"))
    $("descriptionInput").value = "";

  if ($("dueDate"))
    $("dueDate").value = "";

  if ($("recurring"))
    $("recurring").value = "none";

  renderTasks();
  renderCalendar();

}

function toggleTask(id) {

  const task =
    tasks.find(
      t => t.id === id
    );

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

function getCountdown(date) {

  if (!date) return "";

  const target =
    new Date(date);

  if (isNaN(target)) return "";

  const diff =
    target - new Date();

  if (diff <= 0)
    return "Overdue";

  const d =
    Math.floor(
      diff / 86400000
    );

  const h =
    Math.floor(
      diff / 3600000 % 24
    );

  const m =
    Math.floor(
      diff / 60000 % 60
    );

  return `${d}d ${h}h ${m}m remaining`;

}

function renderTasks() {

  const taskList =
    $("taskList");

  if (!taskList) return;

  taskList.innerHTML =
    tasks.map(task => {

      const countdown =
        getCountdown(
          task.dueDate
        );

      return `

<div class="task ${task.done ? "done" : ""}">

<div class="task-left">

<h3>${task.text}</h3>

${task.description ?
`<div class="description">
${task.description}
</div>` : ""}

<span class="badge ${task.priority}">
${task.priority.toUpperCase()}
</span>

<br><br>

${task.dueDate ?
`<strong>Due:</strong>
${new Date(task.dueDate).toLocaleString()}` : ""}

<br><br>

${countdown}

</div>

<div class="task-buttons">

<button onclick="toggleTask(${task.id})">
${task.done ? "Undo" : "Done"}
</button>

<button onclick="deleteTask(${task.id})">
Delete
</button>

</div>

</div>

`;

    }).join("");

}

function showPopup() {

  const popup =
    document.createElement("div");

  popup.className = "popup";

  popup.innerHTML = `
<h3>Task Completed 🎉</h3>
<br>
<p>
${quotes[
Math.floor(
Math.random() * quotes.length
)
]}
</p>
`;

  document.body.appendChild(
    popup
  );

  setTimeout(
    () => popup.remove(),
    3000
  );

}

/* =========================
   CALENDAR
========================= */

let currentMonth =
new Date().getMonth();

let currentYear =
new Date().getFullYear();

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

function renderCalendar() {

  const calendar =
    $("calendar");

  const monthTitle =
    $("monthTitle");

  if (!calendar || !monthTitle)
    return;

  monthTitle.textContent =
  `${months[currentMonth]} ${currentYear}`;

  calendar.innerHTML =
  days.map(d =>
  `<div class="day-name">${d}</div>`
  ).join("");

  const firstDay =
  new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const daysInMonth =
  new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    calendar.innerHTML +=
    "<div></div>";

  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const monthFormatted =
    String(currentMonth + 1)
    .padStart(2, "0");

    const dayFormatted =
    String(day)
    .padStart(2, "0");

    const date =
    `${currentYear}-${monthFormatted}-${dayFormatted}`;

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

<div class="day-number">
${day}
</div>

${taskHTML}

</div>

`;

  }

}

function selectDate(date) {

  const dueDate =
    $("dueDate");

  if (!dueDate) return;

  const currentTime =
  dueDate.value
  .split("T")[1]
  || "12:00";

  dueDate.value =
  `${date}T${currentTime}`;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

function changeMonth(num) {

  currentMonth += num;

  if (currentMonth < 0) {

    currentMonth = 11;
    currentYear--;

  }

  if (currentMonth > 11) {

    currentMonth = 0;
    currentYear++;

  }

  renderCalendar();

}

/* =========================
   SAFE PAGE LOAD
========================= */

window.onload = () => {

  renderTasks();
  renderCalendar();

};