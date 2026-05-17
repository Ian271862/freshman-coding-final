let currentDate = new Date();
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const monthNames = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];


// ---------------------- SAVE SYSTEM ----------------------
function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ---------------------- NOTIFICATIONS ----------------------
function enableNotifications(){

if(!("Notification" in window)){
alert("Notifications not supported");
return;
}

Notification.requestPermission().then(p=>{
if(p==="granted"){
new Notification("Smart Todo Enabled 🔔",{body:"You will get reminders"});
}
});

}


// ---------------------- ADD TASK ----------------------
function addTask(){

const taskInput = document.getElementById("taskInput");
const descriptionInput = document.getElementById("descriptionInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const recurring = document.getElementById("recurring");

if(taskInput.value.trim()===""){
alert("Enter a task");
return;
}

tasks.push({
id:Date.now(),
name:taskInput.value,
description:descriptionInput.value,
priority:priority.value,
dueDate:dueDate.value || currentDate.toISOString(),
recurring:recurring.value,
done:false
});

taskInput.value="";
descriptionInput.value="";
dueDate.value="";
recurring.value="none";

saveTasks();
renderTasks();
renderCalendar();
scheduleNotifications();
}


// ---------------------- DELETE / TOGGLE / EDIT ----------------------
function deleteTask(id){
tasks = tasks.filter(t=>t.id!==id);
saveTasks();
renderTasks();
renderCalendar();
}

function toggleTask(id){
const t = tasks.find(x=>x.id===id);
if(!t) return;
t.done = !t.done;
saveTasks();
renderTasks();
renderCalendar();
}

function editTask(id){
const t = tasks.find(x=>x.id===id);
if(!t) return;

const newText = prompt("Edit task", t.name);
if(!newText || newText.trim()==="") return;

t.name = newText;
saveTasks();
renderTasks();
renderCalendar();
}


// ---------------------- RENDER TASKS ----------------------
function renderTasks(){

const taskList = document.getElementById("taskList");
taskList.innerHTML="";

tasks.forEach(task=>{

taskList.innerHTML += `
<div class="task">
<div class="task-left">

<h3 style="text-decoration:${task.done?"line-through":"none"}">
${task.name}
</h3>

<p>${task.description}</p>

<div class="badge ${task.priority}">
${task.priority.toUpperCase()}
</div>

<div class="repeat">🔁 ${task.recurring}</div>

<br>

<strong>Due:</strong>
${new Date(task.dueDate).toLocaleString()}

</div>

<div class="task-buttons">

<button onclick="toggleTask(${task.id})">
${task.done?"Undo":"Done"}
</button>

<button onclick="editTask(${task.id})">Edit</button>
<button onclick="deleteTask(${task.id})">Delete</button>

</div>
</div>
`;
});

}


// ---------------------- CALENDAR ----------------------
function renderCalendar(){

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const view = document.getElementById("calendarView").value;

calendar.innerHTML="";
calendar.className="calendar-grid";

const year = currentDate.getFullYear();
const month = currentDate.getMonth();

if(view==="month"){

calendar.classList.add("month-view");
monthTitle.textContent = `${monthNames[month]} ${year}`;

dayNames.forEach(d=>{
calendar.innerHTML += `<div class="day-name">${d}</div>`;
});

const firstDay = new Date(year,month,1).getDay();
const daysInMonth = new Date(year,month+1,0).getDate();

for(let i=0;i<firstDay;i++){
calendar.innerHTML += `<div class="empty"></div>`;
}

for(let day=1;day<=daysInMonth;day++){

const date = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

const taskHTML = tasks
.filter(t=>t.dueDate?.split("T")[0]===date)
.map(t=>`<div class="calendar-task">${t.name}</div>`)
.join("");

calendar.innerHTML += `
<div class="day" onclick="selectDate('${date}')">
<div class="day-number">${month+1}/${day}</div>
${taskHTML}
</div>
`;
}

}

}


// ---------------------- DATE PICK ----------------------
function selectDate(date){
document.getElementById("dueDate").value = date + "T12:00";
window.scrollTo({top:0,behavior:"smooth"});
}


// ---------------------- NAV ----------------------
function changeViewDate(dir){
currentDate.setDate(currentDate.getDate()+dir*7);
renderCalendar();
}


// ---------------------- NOTIFICATION ENGINE ----------------------
function scheduleNotifications(){

setInterval(()=>{

const now = new Date().toISOString().slice(0,16);

tasks.forEach(t=>{
if(!t.done && t.dueDate?.slice(0,16) === now){
new Notification("Task Due: " + t.name);
}
});

},60000);

}


// ---------------------- RECURRENCE ENGINE ----------------------
function handleRecurringTasks(){

const today = new Date().toISOString().split("T")[0];

tasks.forEach(t=>{
if(t.recurring==="daily"){
tasks.push({...t,id:Date.now()+Math.random(),dueDate:today+"T09:00",done:false});
}
});

saveTasks();
}


// ---------------------- INIT ----------------------
function init(){
renderTasks();
renderCalendar();
scheduleNotifications();
handleRecurringTasks();
}

init();