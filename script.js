const WEATHER_API_KEY = "5e874ea65109f8afe947fcfed3265b4d";

let tasks = [];

const $ = id => document.getElementById(id);

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

let currentDate = new Date();

let viewMode = "month";

const quotes = [
"Great job!",
"You're crushing it!",
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
   NOTIFICATIONS
========================= */

async function enableNotifications(){

if(!("Notification" in window)){
alert("Notifications are not supported.");
return;
}

const permission =
await Notification.requestPermission();

if(permission === "granted"){

new Notification(
"Notifications Enabled 🔔",
{
body:"Smart reminders are active."
}
);

}

}

/* =========================
   WEATHER TASKS
========================= */

async function getWeatherTasks(){

if(!navigator.geolocation){

alert("Geolocation is not supported.");
return;

}

navigator.geolocation.getCurrentPosition(

async position => {

const lat = position.coords.latitude;
const lon = position.coords.longitude;

try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
);

const data = await response.json();

const forecast = data.list?.[0];

if(!forecast){

alert("Weather unavailable.");
return;

}

const weather =
forecast.weather?.[0]?.main?.toLowerCase() || "";

const temp =
forecast.main?.temp || 0;

if(weather.includes("rain")){

createWeatherTask(
"Take an umbrella ☔",
"Rain is predicted today."
);

}

if(weather.includes("snow")){

createWeatherTask(
"Wear warm clothes ❄️",
"Snow is predicted today."
);

}

if(temp >= 90){

createWeatherTask(
"Drink extra water 🥤",
"Hot weather expected today."
);

}

if(temp <= 45){

createWeatherTask(
"Bring a jacket 🧥",
"Cold weather expected today."
);

}

renderTasks();
renderCalendar();

alert("Weather smart tasks updated.");

}catch(error){

console.error(error);

alert("Could not load weather.");

}

},

() => {

alert("Location access denied.");

}

);

}

function createWeatherTask(title,description){

const exists =
tasks.some(
t =>
t.text === title &&
!t.done
);

if(exists) return;

tasks.push({

id:Date.now() + Math.random(),

text:title,

description,

priority:"medium",

dueDate:
new Date()
.toISOString()
.slice(0,16),

done:false

});

}

/* =========================
   TASKS
========================= */

function addTask(){

const text =
$("taskInput").value.trim();

if(!text){

alert("Please enter a task.");
return;

}

tasks.push({

id:Date.now(),

text:text,

description:$("descriptionInput").value,

priority:$("priority").value,

dueDate:$("dueDate").value,

done:false

});

$("taskInput").value = "";
$("descriptionInput").value = "";
$("dueDate").value = "";

renderTasks();
renderCalendar();

}

function editTask(id){

const task =
tasks.find(t => t.id === id);

if(!task) return;

const newText =
prompt(
"Edit task name:",
task.text
);

if(newText === null) return;

const newDescription =
prompt(
"Edit description:",
task.description
);

if(newDescription === null) return;

const newDate =
prompt(
"Edit due date and time (YYYY-MM-DDTHH:MM)",
task.dueDate || ""
);

if(newDate === null) return;

task.text = newText;
task.description = newDescription;
task.dueDate = newDate;

renderTasks();
renderCalendar();

}

function toggleTask(id){

const task =
tasks.find(
t => t.id === id
);

if(task){

task.done = !task.done;

showPopup();

renderTasks();
renderCalendar();

}

}

function deleteTask(id){

tasks =
tasks.filter(
t => t.id !== id
);

renderTasks();
renderCalendar();

}

function showPopup(){

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

function renderTasks(){

$("taskList").innerHTML =
tasks.map(task => {

let countdownHTML = "";

if(task.dueDate){

const due =
new Date(task.dueDate);

const now =
new Date();

const diff =
due - now;

const absDiff =
Math.abs(diff);

const days =
Math.floor(absDiff / (1000*60*60*24));

const hours =
Math.floor(
(absDiff % (1000*60*60*24))
/
(1000*60*60)
);

const minutes =
Math.floor(
(absDiff % (1000*60*60))
/
(1000*60)
);

if(diff > 0){

countdownHTML = `

<div style="
margin-top:10px;
font-weight:bold;
color:#2563eb;
">

⏳ Due In:
${days}d ${hours}h ${minutes}m

</div>

`;

}else{

countdownHTML = `

<div style="
margin-top:10px;
font-weight:bold;
color:#dc2626;
">

⚠️ Overdue By:
${days}d ${hours}h ${minutes}m

</div>

`;

}

}

return `

<div class="task ${task.done ? "done" : ""}">

<div class="task-left">

<h3>${task.text}</h3>

<div class="description">
${task.description}
</div>

<span class="badge ${task.priority}">
${task.priority.toUpperCase()}
</span>

<br><br>

${task.dueDate ?
`<strong>Due:</strong>
${new Date(task.dueDate).toLocaleString()}`
: ""}

${countdownHTML}

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
   CALENDAR
========================= */

function setViewMode(mode){

viewMode = mode;

renderCalendar();

}

function changeView(num){

if(viewMode === "day"){
currentDate.setDate(
currentDate.getDate() + num
);
}

if(viewMode === "week"){
currentDate.setDate(
currentDate.getDate() + (num * 7)
);
}

if(viewMode === "month"){
currentDate.setMonth(
currentDate.getMonth() + num
);
}

if(viewMode === "year"){
currentDate.setFullYear(
currentDate.getFullYear() + num
);
}

renderCalendar();

}

function renderCalendar(){

const calendar = $("calendar");

calendar.innerHTML = "";

if(viewMode === "day"){
renderDayView();
}

if(viewMode === "week"){
renderWeekView();
}

if(viewMode === "month"){
renderMonthView();
}

if(viewMode === "year"){
renderYearView();
}

}

/* =========================
   DAY VIEW
========================= */

function renderDayView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"1fr";

const d = currentDate;

const date =
`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

$("monthTitle").textContent =
`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

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

<div class="day"
style="min-height:400px;"
onclick="selectDate('${date}')">

<div class="day-number">
${date}
</div>

${taskHTML || "Click to add tasks"}

</div>

`;

}

/* =========================
   WEEK VIEW
========================= */

function renderWeekView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"repeat(7,1fr)";

const temp = new Date(currentDate);

const start = new Date(temp);

start.setDate(
temp.getDate() - temp.getDay()
);

const week =
Math.ceil(start.getDate()/7);

const labels = [
"First",
"Second",
"Third",
"Fourth",
"Fifth"
];

$("monthTitle").textContent =
`${labels[week-1]} Week of ${months[start.getMonth()]}`;

calendar.innerHTML =
days.map(d =>
`<div class="day-name">${d}</div>`
).join("");

for(let i=0;i<7;i++){

const current = new Date(start);

current.setDate(
start.getDate()+i
);

const date =
`${current.getFullYear()}-${String(current.getMonth()+1).padStart(2,"0")}-${String(current.getDate()).padStart(2,"0")}`;

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
${current.getDate()}
</div>

${taskHTML || "<small>Click to add</small>"}

</div>

`;

}

}

/* =========================
   MONTH VIEW
========================= */

function renderMonthView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"repeat(7,1fr)";

const month =
currentDate.getMonth();

const year =
currentDate.getFullYear();

$("monthTitle").textContent =
`${months[month]} ${year}`;

calendar.innerHTML =
days.map(d =>
`<div class="day-name">${d}</div>`
).join("");

const firstDay =
new Date(year,month,1).getDay();

const daysInMonth =
new Date(year,month+1,0).getDate();

for(let i=0;i<firstDay;i++){
calendar.innerHTML += "<div></div>";
}

for(let day=1;day<=daysInMonth;day++){

const date =
`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

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

${taskHTML || "<small>Click to add</small>"}

</div>

`;

}

}

/* =========================
   YEAR VIEW
========================= */

function renderYearView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"repeat(3,1fr)";

const year =
currentDate.getFullYear();

$("monthTitle").textContent =
year;

for(let m=0;m<12;m++){

calendar.innerHTML += `

<div class="day"
onclick="openMonth(${m})">

<div class="day-number">
${months[m]}
</div>

<br>

Click to Open

</div>

`;

}

}

function openMonth(month){

currentDate.setMonth(month);

viewMode = "month";

renderCalendar();

}

/* =========================
   SELECT DATE
========================= */

function selectDate(date){

$("dueDate").value =
`${date}T12:00`;

$("taskInput").focus();

window.scrollTo({
top:0,
behavior:"smooth"
});

}

/* =========================
   AUTO UPDATE TIMERS
========================= */

setInterval(() => {

renderTasks();

}, 60000);

/* =========================
   PAGE LOAD
========================= */

window.onload = () => {

renderTasks();
renderCalendar();

};