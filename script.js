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

/* =========================
   NOTIFICATIONS
========================= */

async function enableNotifications(){

if(!("Notification" in window)){

alert(
"Notifications are not supported."
);

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

try{

const response = await fetch(
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
);

const data =
await response.json();

const forecast =
data.list?.[0];

if(!forecast){

alert(
"Weather unavailable."
);

return;

}

const weather =
forecast.weather?.[0]?.main
?.toLowerCase() || "";

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

alert(
"Weather smart tasks updated."
);

}catch(error){

console.error(error);

alert(
"Could not load weather."
);

}

},

() => {

alert(
"Location access denied."
);

}

);

}

function createWeatherTask(
title,
description
){

const exists =
tasks.some(
t =>
t.text === title &&
!t.done
);

if(exists) return;

tasks.push({

id:
Date.now() + Math.random(),

text:title,

description,

priority:"medium",

dueDate:
new Date()
.toISOString()
.slice(0,16),

recurring:"none",

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

alert(
"Please enter a task."
);

return;

}

tasks.push({

id:
Date.now() + Math.random(),

text,

description:
$("descriptionInput").value,

priority:
$("priority").value,

dueDate:
$("dueDate").value,

recurring:
$("recurring").value,

done:false

});

$("taskInput").value = "";
$("descriptionInput").value = "";
$("dueDate").value = "";
$("recurring").value = "none";

renderTasks();
renderCalendar();

}

function toggleTask(id){

const task =
tasks.find(
t => t.id === id
);

if(!task) return;

task.done = !task.done;

showPopup();

renderTasks();
renderCalendar();

}

function deleteTask(id){

tasks =
tasks.filter(
t => t.id !== id
);

renderTasks();
renderCalendar();

}

function getCountdown(date){

if(!date) return "";

const target =
new Date(date);

const diff =
target - new Date();

if(diff <= 0)
return "Overdue";

const d =
Math.floor(diff / 86400000);

const h =
Math.floor(diff / 3600000 % 24);

const m =
Math.floor(diff / 60000 % 60);

return `${d}d ${h}h ${m}m remaining`;

}

function renderTasks(){

$("taskList").innerHTML =
tasks.map(task => {

const countdown =
getCountdown(task.dueDate);

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

/* =========================
   CALENDAR
========================= */

let currentDate = new Date();

let viewMode = "month";

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

const calendar =
$("calendar");

const monthTitle =
$("monthTitle");

calendar.style.gridTemplateColumns =
"repeat(7,1fr)";

calendar.innerHTML = "";

if(viewMode === "day"){

renderDayView(
calendar,
monthTitle
);

}

if(viewMode === "week"){

renderWeekView(
calendar,
monthTitle
);

}

if(viewMode === "month"){

renderMonthView(
calendar,
monthTitle
);

}

if(viewMode === "year"){

renderYearView(
calendar,
monthTitle
);

}

}

function renderDayView(
calendar,
monthTitle
){

const date = currentDate;

const dateString =
`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

monthTitle.textContent =
`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

const todaysTasks =
tasks.filter(
t =>
t.dueDate &&
t.dueDate.startsWith(dateString)
);

calendar.innerHTML = `
<div class="day" style="grid-column:span 7;min-height:300px;">

<div class="day-number">
Tasks for ${dateString}
</div>

${todaysTasks.length ?

todaysTasks.map(t=>`
<div class="calendar-task">
${t.text}
</div>
`).join("")

:

"<p>No tasks today.</p>"

}

</div>
`;

}

function renderWeekView(
calendar,
monthTitle
){

const tempDate =
new Date(currentDate);

const day =
tempDate.getDay();

const start =
new Date(tempDate);

start.setDate(
tempDate.getDate() - day
);

const weekNumber =
Math.ceil(start.getDate()/7);

const labels = [
"First",
"Second",
"Third",
"Fourth",
"Fifth"
];

monthTitle.textContent =
`${labels[weekNumber-1]} Week of ${months[start.getMonth()]} ${start.getFullYear()}`;

calendar.innerHTML =
days.map(d => `
<div class="day-name">
${d}
</div>
`).join("");

for(let i=0;i<7;i++){

const current =
new Date(start);

current.setDate(
start.getDate()+i
);

const dateString =
`${current.getFullYear()}-${String(current.getMonth()+1).padStart(2,"0")}-${String(current.getDate()).padStart(2,"0")}`;

const taskHTML =
tasks
.filter(
t =>
t.dueDate &&
t.dueDate.startsWith(dateString)
)
.map(t => `
<div class="calendar-task">
${t.text}
</div>
`)
.join("");

calendar.innerHTML += `
<div class="day">

<div class="day-number">
${current.getDate()}
</div>

${taskHTML}

</div>
`;

}

}

function renderMonthView(
calendar,
monthTitle
){

const currentMonth =
currentDate.getMonth();

const currentYear =
currentDate.getFullYear();

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

for(
let i = 0;
i < firstDay;
i++
){

calendar.innerHTML +=
"<div></div>";

}

for(
let day = 1;
day <= daysInMonth;
day++
){

const date =
`${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

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

function renderYearView(
calendar,
monthTitle
){

const year =
currentDate.getFullYear();

monthTitle.textContent =
`${year}`;

calendar.style.gridTemplateColumns =
"repeat(3,1fr)";

for(let m=0;m<12;m++){

const totalTasks =
tasks.filter(t => {

if(!t.dueDate)
return false;

const taskDate =
new Date(t.dueDate);

return (
taskDate.getMonth() === m &&
taskDate.getFullYear() === year
);

}).length;

calendar.innerHTML += `

<div class="day"
style="min-height:150px;">

<div class="day-number">
${months[m]}
</div>

<br>

<strong>
${totalTasks}
</strong>

task(s)

</div>

`;

}

}

function selectDate(date){

const currentTime =
$("dueDate").value
.split("T")[1]
|| "12:00";

$("dueDate").value =
`${date}T${currentTime}`;

window.scrollTo({
top:0,
behavior:"smooth"
});

}

/* =========================
   PAGE LOAD
========================= */

window.onload = () => {

renderTasks();
renderCalendar();

};