let currentDate = new Date();

let tasks = [];

const monthNames = [
"January","February","March",
"April","May","June",
"July","August","September",
"October","November","December"
];

const dayNames = [
"Sun","Mon","Tue",
"Wed","Thu","Fri","Sat"
];

function enableNotifications(){

if(!("Notification" in window)){
alert("Notifications are not supported.");
return;
}

Notification.requestPermission()
.then(permission=>{

if(permission==="granted"){

new Notification(
"Notifications Enabled 🔔",
{
body:"Smart reminders are active."
}
);

}else{

alert("Notifications denied.");

}

});

}

function getWeatherTasks(){

alert("Weather smart tasks enabled.");

}

function addTask(){

try{

const taskInput =
document.getElementById("taskInput");

const descriptionInput =
document.getElementById("descriptionInput");

const priority =
document.getElementById("priority");

const dueDate =
document.getElementById("dueDate");

const recurring =
document.getElementById("recurring");

if(!taskInput){
console.error("taskInput not found");
return;
}

if(taskInput.value.trim()===""){

alert("Please enter a task.");
return;

}

tasks.push({
id:Date.now(),

name:taskInput.value.trim(),

description:
descriptionInput
? descriptionInput.value
: "",

priority:
priority
? priority.value
: "medium",

dueDate:
dueDate && dueDate.value
? dueDate.value
: new Date().toISOString(),

recurring:
recurring
? recurring.value
: "none",

done:false
});

taskInput.value="";

if(descriptionInput)
descriptionInput.value="";

if(dueDate)
dueDate.value="";

if(recurring)
recurring.value="none";

renderTasks();
renderCalendar();

}catch(error){

console.error(
"addTask crashed:",
error
);

alert(
"There was an error adding the task."
);

}

}

function deleteTask(id){

tasks =
tasks.filter(
t=>t.id!==id
);

renderTasks();
renderCalendar();

}

function toggleTask(id){

const task =
tasks.find(
t=>t.id===id
);

if(!task)return;

task.done=!task.done;

renderTasks();
renderCalendar();

}

function editTask(id){

const task =
tasks.find(
t=>t.id===id
);

if(!task)return;

const newText =
prompt(
"Edit task",
task.name
);

if(
newText===null ||
newText.trim()===""
)return;

task.name=newText;

renderTasks();
renderCalendar();

}

function renderTasks(){

const taskList =
document.getElementById("taskList");

if(!taskList)return;

taskList.innerHTML="";

tasks.forEach(task=>{

taskList.innerHTML += `

<div class="task">

<div class="task-left">

<h3 style="
text-decoration:
${task.done ? "line-through" : "none"};
">
${task.name}
</h3>

<p>${task.description}</p>

<div class="badge ${task.priority}">
${task.priority.toUpperCase()}
</div>

<div class="repeat">
🔁 ${task.recurring}
</div>

<br>

<strong>Due:</strong>
${new Date(task.dueDate).toLocaleString()}

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

});

}

function selectDate(date){

const dueDateInput =
document.getElementById("dueDate");

if(!dueDateInput)return;

const currentTime =
dueDateInput.value.split("T")[1]
|| "12:00";

dueDateInput.value =
`${date}T${currentTime}`;

window.scrollTo({
top:0,
behavior:"smooth"
});

}

function changeViewDate(direction){

const view =
document.getElementById(
"calendarView"
).value;

if(view==="month"){

currentDate.setMonth(
currentDate.getMonth()
+ direction
);

}

else if(view==="week"){

currentDate.setDate(
currentDate.getDate()
+ (direction*7)
);

}

else if(view==="day"){

currentDate.setDate(
currentDate.getDate()
+ direction
);

}

else if(view==="year"){

currentDate.setFullYear(
currentDate.getFullYear()
+ direction
);

}

renderCalendar();

}

function openMonth(index){

currentDate.setMonth(index);

document.getElementById(
"calendarView"
).value = "month";

renderCalendar();

}

function renderCalendar(){

const calendar =
document.getElementById("calendar");

const monthTitle =
document.getElementById("monthTitle");

const view =
document.getElementById(
"calendarView"
).value;

if(!calendar || !monthTitle)return;

calendar.innerHTML="";

calendar.className=
"calendar-grid";

const year =
currentDate.getFullYear();

const month =
currentDate.getMonth();

if(view==="month"){

calendar.classList.add(
"month-view"
);

monthTitle.textContent =
`${monthNames[month]} ${year}`;

dayNames.forEach(name=>{

calendar.innerHTML += `
<div class="day-name">
${name}
</div>
`;

});

const firstDay =
new Date(year,month,1).getDay();

const daysInMonth =
new Date(year,month+1,0).getDate();

for(let i=0;i<firstDay;i++){

calendar.innerHTML += `
<div class="empty"></div>
`;

}

for(let day=1;
day<=daysInMonth;
day++){

const date =
`${year}-${String(month+1)
.padStart(2,"0")}-${String(day)
.padStart(2,"0")}`;

const taskHTML =
tasks
.filter(
t =>
t.dueDate &&
t.dueDate.split("T")[0]===date
)
.map(
t => `
<div class="calendar-task">
${t.name}
</div>
`
)
.join("");

calendar.innerHTML += `

<div class="day"
onclick="selectDate('${date}')">

<div class="day-number">
${month+1}/${day}
</div>

${taskHTML}

</div>

`;

}

}

else if(view==="week"){

calendar.classList.add(
"week-view"
);

monthTitle.textContent =
`${monthNames[month]} ${year}`;

for(let i=0;i<7;i++){

const start =
new Date(currentDate);

start.setDate(
currentDate.getDate()
-currentDate.getDay()
+i
);

const dateString =
start.toISOString()
.split("T")[0];

const taskHTML =
tasks
.filter(
t =>
t.dueDate &&
t.dueDate.split("T")[0]===dateString
)
.map(
t => `
<div class="calendar-task">
${t.name}
</div>
`
)
.join("");

calendar.innerHTML += `

<div class="day"
onclick="selectDate('${dateString}')">

<div class="day-number">
${dayNames[i]}
<br>
${start.getMonth()+1}/${start.getDate()}
</div>

${taskHTML}

</div>

`;

}

}

else if(view==="day"){

calendar.classList.add(
"day-view"
);

monthTitle.textContent =
currentDate.toDateString();

const dateString =
currentDate.toISOString()
.split("T")[0];

const taskHTML =
tasks
.filter(
t =>
t.dueDate &&
t.dueDate.split("T")[0]===dateString
)
.map(
t => `
<div class="calendar-task">
${t.name}
</div>
`
)
.join("");

calendar.innerHTML += `

<div class="day"
style="min-height:300px"
onclick="selectDate('${dateString}')">

<h2>
${currentDate.toDateString()}
</h2>

<br>

${taskHTML || "No tasks yet"}

</div>

`;

}

else if(view==="year"){

calendar.classList.add(
"year-view"
);

monthTitle.textContent =
year;

monthNames.forEach(
(name,index)=>{

calendar.innerHTML += `

<div class="month-box"
onclick="openMonth(${index})">

${name}

</div>

`;

});

}

}

renderTasks();
renderCalendar();