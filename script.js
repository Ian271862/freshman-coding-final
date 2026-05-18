const WEATHER_API_KEY = "30dbba40e9614cb0c0c23e0bb26f2926";

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

async function getWeatherTasks(){

alert("Add your OpenWeather API key first.");

}

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

function toggleTask(id){

const task =
tasks.find(t => t.id === id);

if(task){

task.done = !task.done;

showPopup();

renderTasks();
renderCalendar();

}

}

function deleteTask(id){

tasks =
tasks.filter(t => t.id !== id);

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
Math.floor(Math.random() * quotes.length)
]}
</p>

`;

document.body.appendChild(popup);

setTimeout(
() => popup.remove(),
3000
);

}

function renderTasks(){

$("taskList").innerHTML =
tasks.map(task => `

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

`).join("");

}

function setViewMode(mode){

viewMode = mode;

renderCalendar();

}

function changeView(num){

if(viewMode === "day"){
currentDate.setDate(currentDate.getDate() + num);
}

if(viewMode === "week"){
currentDate.setDate(currentDate.getDate() + (num * 7));
}

if(viewMode === "month"){
currentDate.setMonth(currentDate.getMonth() + num);
}

if(viewMode === "year"){
currentDate.setFullYear(currentDate.getFullYear() + num);
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

calendar.style.gridTemplateColumns = "1fr";

const d = currentDate;

const date =
`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

$("monthTitle").textContent =
`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

const taskHTML =
tasks
.filter(t => t.dueDate && t.dueDate.startsWith(date))
.map(t => `
<div class="calendar-task">
${t.text}
</div>
`)
.join("");

calendar.innerHTML = `

<div class="day" style="min-height:400px;">

<div class="day-number">
${date}
</div>

${taskHTML || "No tasks"}

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
`Week of ${months[start.getMonth()]} ${start.getDate()}`;

calendar.innerHTML =
days.map(d =>
`<div class="day-name">${d}</div>`
).join("");

for(let i=0;i<7;i++){

const current = new Date(start);

current.setDate(start.getDate()+i);

const date =
`${current.getFullYear()}-${String(current.getMonth()+1).padStart(2,"0")}-${String(current.getDate()).padStart(2,"0")}`;

const taskHTML =
tasks
.filter(t => t.dueDate && t.dueDate.startsWith(date))
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

function renderMonthView(){

const calendar = $("calendar");

calendar.style.gridTemplateColumns =
"repeat(7,1fr)";

const month = currentDate.getMonth();

const year = currentDate.getFullYear();

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
.filter(t => t.dueDate && t.dueDate.startsWith(date))
.map(t => `
<div class="calendar-task">
${t.text}
</div>
`)
.join("");

calendar.innerHTML += `

<div class="day">

<div class="day-number">
${day}
</div>

${taskHTML}

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

$("monthTitle").textContent = year;

for(let m=0;m<12;m++){

calendar.innerHTML += `

<div class="day" onclick="openMonth(${m})">

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

window.onload = () => {

renderTasks();
renderCalendar();

};