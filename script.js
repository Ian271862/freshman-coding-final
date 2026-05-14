let tasks=[];

const quotes=[
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

const $=id=>document.getElementById(id);

function addTask(){

const text=$("taskInput").value.trim();

if(!text)return;

tasks.push({
id:Date.now(),
text,
description:$("descriptionInput").value.trim(),
priority:$("priority").value,
dueDate:$("dueDate").value,
recurring:$("recurring").value,
done:false
});

$("taskInput").value="";
$("descriptionInput").value="";
$("dueDate").value="";
$("recurring").value="none";

renderTasks();
renderCalendar();

}

function toggleTask(id){

const task=tasks.find(t=>t.id===id);

if(!task)return;

if(task.done){

task.done=false;

}else{

if(task.recurring && task.recurring!=="none"){

handleRecurring(task);

tasks=tasks.filter(t=>t.id!==task.id);

showPopup();

renderTasks();
renderCalendar();

return;

}

task.done=true;

showPopup();

}

renderTasks();
renderCalendar();

}

function handleRecurring(task){

if(!task.recurring || task.recurring==="none") return;

const currentDate=new Date(task.dueDate);

let nextDate=new Date(currentDate);

switch(task.recurring){

case "daily":
nextDate.setDate(nextDate.getDate()+1);
break;

case "weekly":
nextDate.setDate(nextDate.getDate()+7);
break;

case "biweekly":
nextDate.setDate(nextDate.getDate()+14);
break;

case "monthly":
nextDate.setMonth(nextDate.getMonth()+1);
break;

case "lastThursday":
nextDate=getLastThursdayNextMonth(currentDate);
break;

}

tasks.push({
id:Date.now()+Math.random(),
text:task.text,
description:task.description,
priority:task.priority,
dueDate:formatDateTimeLocal(nextDate),
recurring:task.recurring,
done:false
});

}

function getLastThursdayNextMonth(date){

const year=date.getFullYear();
const month=date.getMonth()+1;

const lastDay=new Date(year,month+1,0);

while(lastDay.getDay()!==4){
lastDay.setDate(lastDay.getDate()-1);
}

lastDay.setHours(
date.getHours(),
date.getMinutes(),
0,
0
);

return lastDay;

}

function formatDateTimeLocal(date){

const pad=n=>String(n).padStart(2,"0");

return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

}

function deleteTask(id){

tasks=tasks.filter(t=>t.id!==id);

renderTasks();
renderCalendar();

}

function getCountdown(date){

if(!date)return "";

const diff=new Date(date)-new Date();

if(diff<=0)return "Overdue";

const d=Math.floor(diff/86400000);
const h=Math.floor(diff/3600000%24);
const m=Math.floor(diff/60000%60);

return `${d}d ${h}h ${m}m remaining`;

}

function recurringLabel(type){

switch(type){

case "daily":
return "Repeats Daily";

case "weekly":
return "Repeats Weekly";

case "biweekly":
return "Repeats Every Other Week";

case "monthly":
return "Repeats Monthly";

case "lastThursday":
return "Repeats Last Thursday";

default:
return "";

}

}

function renderTasks(){

$("taskList").innerHTML=tasks.map(task=>{

const countdown=getCountdown(task.dueDate);

const urgent=
(new Date(task.dueDate)-new Date())<10800000;

return `

<div class="task ${task.done?"done":""}">

<div class="task-left">

<h3>${task.text}</h3>

${task.description ?
`<div class="description">${task.description}</div>` : ""}

<span class="badge ${task.priority}">
${task.priority.toUpperCase()}
</span>

${task.recurring!=="none" ? `
<div style="
margin-top:10px;
padding:6px 10px;
background:#eef2ff;
border-radius:8px;
font-size:13px;
font-weight:bold;
color:#4f46e5;
display:inline-block;
">
🔁 ${recurringLabel(task.recurring)}
</div>
` : ""}

<br><br>

${task.dueDate ?
`<strong>Due:</strong>
${new Date(task.dueDate).toLocaleString()}` : ""}

<br><br>

${countdown}

${urgent && !task.done && task.dueDate ?
`<div class="warning">⚠ Due within 3 hours</div>` : ""}

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

const popup=document.createElement("div");

popup.className="popup";

popup.innerHTML=`
<h3>Task Completed 🎉</h3>
<br>
<p>${quotes[Math.floor(Math.random()*quotes.length)]}</p>
`;

document.body.appendChild(popup);

setTimeout(()=>popup.remove(),3000);

}

let currentMonth=new Date().getMonth();
let currentYear=new Date().getFullYear();

const months=[
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const days=[
"Sun","Mon","Tue","Wed","Thu","Fri","Sat"
];

function renderCalendar(){

$("monthTitle").textContent=
`${months[currentMonth]} ${currentYear}`;

$("calendar").innerHTML=
days.map(d=>`<div class="day-name">${d}</div>`).join("");

const firstDay=
new Date(currentYear,currentMonth,1).getDay();

const daysInMonth=
new Date(currentYear,currentMonth+1,0).getDate();

for(let i=0;i<firstDay;i++){
$("calendar").innerHTML+="<div></div>";
}

for(let day=1;day<=daysInMonth;day++){

const dateObj=
new Date(currentYear,currentMonth,day);

const date=
dateObj.toISOString().split("T")[0];

const taskHTML=tasks
.filter(t=>t.dueDate && t.dueDate.startsWith(date))
.map(t=>`<div class="calendar-task">${t.text}</div>`)
.join("");

$("calendar").innerHTML+=`

<div class="day" onclick="selectDate('${date}')">

<div class="day-number">${day}</div>

${taskHTML}

</div>

`;

}

}

function selectDate(date){

const currentTime=
$("dueDate").value.split("T")[1] || "12:00";

$("dueDate").value=
`${date}T${currentTime}`;

window.scrollTo({
top:0,
behavior:"smooth"
});

}

function changeMonth(num){

currentMonth+=num;

if(currentMonth<0){
currentMonth=11;
currentYear--;
}

if(currentMonth>11){
currentMonth=0;
currentYear++;
}

renderCalendar();

}

renderTasks();
renderCalendar();

setInterval(renderTasks,60000);