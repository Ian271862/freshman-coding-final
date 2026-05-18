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

let editingTaskId = null;

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
   AUTO HOLIDAYS + CATHOLIC DAYS
========================= */

function getDynamicHolidays(year){

return [

{
name:"New Year's Day 🎉",
date:`${year}-01-01`
},

{
name:"Valentine's Day ❤️",
date:`${year}-02-14`
},

{
name:"St. Patrick's Day ☘️",
date:`${year}-03-17`
},

{
name:"Independence Day 🇺🇸",
date:`${year}-07-04`
},

{
name:"Halloween 🎃",
date:`${year}-10-31`
},

{
name:"Veterans Day",
date:`${year}-11-11`
},

{
name:"Christmas Eve 🎄",
date:`${year}-12-24`
},

{
name:"Christmas 🎄",
date:`${year}-12-25`
},

{
name:"New Year's Eve 🎆",
date:`${year}-12-31`
},

{
name:"Martin Luther King Jr. Day",
date:getNthWeekdayOfMonth(year,1,0,3)
},

{
name:"Presidents' Day",
date:getNthWeekdayOfMonth(year,1,1,3)
},

{
name:"Mother's Day 💐",
date:getNthWeekdayOfMonth(year,0,4,2)
},

{
name:"Father's Day",
date:getNthWeekdayOfMonth(year,0,5,3)
},

{
name:"Labor Day",
date:getNthWeekdayOfMonth(year,1,8,1)
},

{
name:"Memorial Day",
date:getLastWeekdayOfMonth(year,1,4)
},

{
name:"Thanksgiving 🦃",
date:getNthWeekdayOfMonth(year,4,10,4)
}

];

}

function getCatholicFeastDays(year){

const easter =
getEaster(year);

return [

{
name:"Mary, Mother of God ✝️",
date:`${year}-01-01`
},

{
name:"Epiphany ✨",
date:`${year}-01-06`
},

{
name:"Presentation of the Lord",
date:`${year}-02-02`
},

{
name:"Saint Patrick ☘️",
date:`${year}-03-17`
},

{
name:"Saint Joseph",
date:`${year}-03-19`
},

{
name:"Palm Sunday 🌿",
date:addDays(easter,-7)
},

{
name:"Holy Thursday ✝️",
date:addDays(easter,-3)
},

{
name:"Good Friday ✝️",
date:addDays(easter,-2)
},

{
name:"Easter Sunday ✝️",
date:easter
},

{
name:"Divine Mercy Sunday",
date:addDays(easter,7)
},

{
name:"Ascension of Jesus ✨",
date:addDays(easter,39)
},

{
name:"Pentecost 🔥",
date:addDays(easter,49)
},

{
name:"Holy Trinity Sunday",
date:addDays(easter,56)
},

{
name:"Corpus Christi",
date:addDays(easter,60)
},

{
name:"Sacred Heart of Jesus ❤️",
date:addDays(easter,68)
},

{
name:"Saint Anthony",
date:`${year}-06-13`
},

{
name:"Saints Peter and Paul",
date:`${year}-06-29`
},

{
name:"Assumption of Mary 👑",
date:`${year}-08-15`
},

{
name:"Saint Francis of Assisi 🕊️",
date:`${year}-10-04`
},

{
name:"All Saints Day ✨",
date:`${year}-11-01`
},

{
name:"All Souls Day 🕯️",
date:`${year}-11-02`
},

{
name:"Immaculate Conception ✨",
date:`${year}-12-08`
},

{
name:"Our Lady of Guadalupe 🌹",
date:`${year}-12-12`
},

{
name:"Christmas ✝️🎄",
date:`${year}-12-25`
}

];

}

/* =========================
   DATE HELPERS
========================= */

function formatDate(date){

return `${date.getFullYear()}-${String(
date.getMonth()+1
).padStart(2,"0")}-${String(
date.getDate()
).padStart(2,"0")}`;

}

function addDays(baseDate,days){

const date =
new Date(baseDate);

date.setDate(
date.getDate() + days
);

return formatDate(date);

}

function getNthWeekdayOfMonth(
year,
weekday,
month,
nth
){

const first =
new Date(year,month,1);

let day =
first.getDay();

let offset =
(7 + weekday - day) % 7;

offset += (nth - 1) * 7;

const result =
new Date(year,month,1 + offset);

return formatDate(result);

}

function getLastWeekdayOfMonth(
year,
weekday,
month
){

const last =
new Date(year,month+1,0);

while(last.getDay() !== weekday){

last.setDate(
last.getDate() - 1
);

}

return formatDate(last);

}

function getEaster(year){

const f =
Math.floor;

const G =
year % 19;

const C =
f(year / 100);

const H =
(C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;

const I =
H - f(H / 28) * (
1 - f(H / 28) * f(29 / (H + 1)) * f((21 - G) / 11)
);

const J =
(year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;

const L =
I - J;

const month =
3 + f((L + 40) / 44);

const day =
L + 28 - 31 * f(month / 4);

return formatDate(
new Date(year,month-1,day)
);

}

/* =========================
   NOTIFICATIONS
========================= */

async function enableNotifications(){

if(!("Notification" in window")){
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

/* =========================
   EDIT TASK SYSTEM
========================= */

function editTask(id){

const task =
tasks.find(t => t.id === id);

if(!task) return;

editingTaskId = id;

$("editTaskInput").value =
task.text || "";

$("editDescriptionInput").value =
task.description || "";

$("editPriority").value =
task.priority || "medium";

$("editDueDate").value =
task.dueDate || "";

$("editModal").style.display =
"flex";

}

function saveTaskEdit(){

const task =
tasks.find(t => t.id === editingTaskId);

if(!task) return;

const updatedTitle =
$("editTaskInput").value.trim();

if(!updatedTitle){

alert("Please enter a task name.");
return;

}

task.text =
updatedTitle;

task.description =
$("editDescriptionInput").value;

task.priority =
$("editPriority").value;

task.dueDate =
$("editDueDate").value;

$("editModal").style.display =
"none";

renderTasks();
renderCalendar();

}

function closeEditModal(){

$("editModal").style.display =
"none";

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

function renderDayView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"1fr";

const d = currentDate;

const date =
`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

const holidays =
getDynamicHolidays(d.getFullYear());

const catholicFeastDays =
getCatholicFeastDays(d.getFullYear());

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

const holidayHTML =
holidays
.filter(
h => h.date === date
)
.map(
h => `
<div style="
background:#ef4444;
color:white;
padding:5px 7px;
border-radius:7px;
font-size:11px;
margin-top:5px;
font-weight:bold;
">
${h.name}
</div>
`
)
.join("");

const catholicHTML =
catholicFeastDays
.filter(
h => h.date === date
)
.map(
h => `
<div style="
background:#7c3aed;
color:white;
padding:5px 7px;
border-radius:7px;
font-size:11px;
margin-top:5px;
font-weight:bold;
">
${h.name}
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

${holidayHTML}
${catholicHTML}
${taskHTML || "Click to add tasks"}

</div>

`;

}

function renderWeekView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"repeat(7,1fr)";

const temp = new Date(currentDate);

const start = new Date(temp);

start.setDate(
temp.getDate() - temp.getDay()
);

$("monthTitle").textContent =
`Week of ${months[start.getMonth()]}`;

calendar.innerHTML =
days.map(d =>
`<div class="day-name">${d}</div>`
).join("");

for(let i=0;i<7;i++){

const current = new Date(start);

current.setDate(
start.getDate()+i
);

const holidays =
getDynamicHolidays(current.getFullYear());

const catholicFeastDays =
getCatholicFeastDays(current.getFullYear());

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

const holidayHTML =
holidays
.filter(
h => h.date === date
)
.map(
h => `
<div style="
background:#ef4444;
color:white;
padding:5px 7px;
border-radius:7px;
font-size:11px;
margin-top:5px;
font-weight:bold;
">
${h.name}
</div>
`
)
.join("");

const catholicHTML =
catholicFeastDays
.filter(
h => h.date === date
)
.map(
h => `
<div style="
background:#7c3aed;
color:white;
padding:5px 7px;
border-radius:7px;
font-size:11px;
margin-top:5px;
font-weight:bold;
">
${h.name}
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

${holidayHTML}
${catholicHTML}
${taskHTML || "<small>Click to add</small>"}

</div>

`;

}

}

function renderMonthView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"repeat(7,1fr)";

const month =
currentDate.getMonth();

const year =
currentDate.getFullYear();

const holidays =
getDynamicHolidays(year);

const catholicFeastDays =
getCatholicFeastDays(year);

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

const holidayHTML =
holidays
.filter(
h => h.date === date
)
.map(
h => `
<div style="
background:#ef4444;
color:white;
padding:5px 7px;
border-radius:7px;
font-size:11px;
margin-top:5px;
font-weight:bold;
">
${h.name}
</div>
`
)
.join("");

const catholicHTML =
catholicFeastDays
.filter(
h => h.date === date
)
.map(
h => `
<div style="
background:#7c3aed;
color:white;
padding:5px 7px;
border-radius:7px;
font-size:11px;
margin-top:5px;
font-weight:bold;
">
${h.name}
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

${holidayHTML}
${catholicHTML}
${taskHTML || "<small>Click to add</small>"}

</div>

`;

}

}

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

function selectDate(date){

$("dueDate").value =
`${date}T12:00`;

$("taskInput").focus();

window.scrollTo({
top:0,
behavior:"smooth"
});

}

setInterval(() => {

renderTasks();

}, 60000);

window.onload = () => {

renderTasks();
renderCalendar();

};