const WEATHER_API_KEY = "5e874ea65109f8afe947fcfed3265b4d"; // Stores your OpenWeather API key

let tasks = []; // Stores all tasks in an array

const $ = id => document.getElementById(id); // Shorter way to get HTML elements by ID

const months = [
"January","February","March",
"April","May","June",
"July","August","September",
"October","November","December"
]; // Month names for the calendar

const days = [
"Sun","Mon","Tue",
"Wed","Thu","Fri","Sat"
]; // Weekday names for the calendar

let currentDate = new Date(); // Keeps track of the current date being viewed

let viewMode = "month"; // Stores the current calendar view type

let editingTaskId = null; // Stores the task ID currently being edited

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
]; // Random motivational quotes shown after completing tasks

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
date:getNthWeekdayOfMonth(year,1,0,3) // Gets the 3rd Monday of January
},

{
name:"Presidents' Day",
date:getNthWeekdayOfMonth(year,1,1,3) // Gets the 3rd Monday of February
},

{
name:"Mother's Day 💐",
date:getNthWeekdayOfMonth(year,0,4,2) // Gets the 2nd Sunday of May
},

{
name:"Father's Day",
date:getNthWeekdayOfMonth(year,0,5,3) // Gets the 3rd Sunday of June
},

{
name:"Labor Day",
date:getNthWeekdayOfMonth(year,1,8,1) // Gets the 1st Monday of September
},

{
name:"Memorial Day",
date:getLastWeekdayOfMonth(year,1,4) // Gets the last Monday of May
},

{
name:"Thanksgiving 🦃",
date:getNthWeekdayOfMonth(year,4,10,4) // Gets the 4th Thursday of November
}

];

}

function getCatholicFeastDays(year){

const easter =
getEaster(year); // Calculates Easter because many feast days depend on it

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
date:addDays(easter,-7) // Gets the date 7 days before Easter
},

{
name:"Holy Thursday ✝️",
date:addDays(easter,-3) // Gets the date 3 days before Easter
},

{
name:"Good Friday ✝️",
date:addDays(easter,-2) // Gets the date 2 days before Easter
},

{
name:"Easter Sunday ✝️",
date:easter
},

{
name:"Divine Mercy Sunday",
date:addDays(easter,7) // Gets the date 7 days after Easter
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
).padStart(2,"0")}`; // Converts dates into YYYY-MM-DD format

}

function addDays(baseDate,days){

const date =
new Date(baseDate); // Makes a copy of the original date

date.setDate(
date.getDate() + days
); // Adds or subtracts days from the date

return formatDate(date);

}

function getNthWeekdayOfMonth(
year,
weekday,
month,
nth
){

const first =
new Date(year,month,1); // Gets the first day of the month

let day =
first.getDay(); // Gets the weekday number of the first day

let offset =
(7 + weekday - day) % 7; // Calculates the distance to the target weekday

offset += (nth - 1) * 7; // Moves to the correct week number

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
new Date(year,month+1,0); // Gets the last day of the month

while(last.getDay() !== weekday){

last.setDate(
last.getDate() - 1
); // Moves backward until the weekday matches

}

return formatDate(last);

}

function getEaster(year){

const f =
Math.floor; // Shortens Math.floor for easier use

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
3 + f((L + 40) / 44); // Calculates Easter's month

const day =
L + 28 - 31 * f(month / 4); // Calculates Easter's day

return formatDate(
new Date(year,month-1,day)
);

}

/* =========================
   NOTIFICATIONS
========================= */

async function enableNotifications(){

if(!("Notification" in window)){ // Checks if notifications are supported
alert("Notifications are not supported.");
return;
}

const permission =
await Notification.requestPermission(); // Asks the user for notification permission

if(permission === "granted"){

new Notification(
"Notifications Enabled 🔔",
{
body:"Smart reminders are active."
}
); // Sends a test notification

}

}

/* =========================
   WEATHER TASKS
========================= */

async function getWeatherTasks(){

if(!navigator.geolocation){ // Checks if geolocation is supported

alert("Geolocation is not supported.");
return;

}

navigator.geolocation.getCurrentPosition(

async position => {

const lat = position.coords.latitude; // Gets the user's latitude
const lon = position.coords.longitude; // Gets the user's longitude

try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
); // Requests weather data from OpenWeather

const data = await response.json(); // Converts the response into JSON

const forecast = data.list?.[0]; // Gets the first forecast result

if(!forecast){

alert("Weather unavailable.");
return;

}

const weather =
forecast.weather?.[0]?.main?.toLowerCase() || ""; // Gets the weather condition

const temp =
forecast.main?.temp || 0; // Gets the current temperature

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

renderTasks(); // Refreshes the task list
renderCalendar(); // Refreshes the calendar

alert("Weather smart tasks updated.");

}catch(error){

console.error(error); // Shows errors in the browser console

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
); // Checks if the same unfinished task already exists

if(exists) return;

tasks.push({

id:Date.now() + Math.random(), // Creates a unique task ID

text:title,

description,

priority:"medium",

dueDate:
new Date()
.toISOString()
.slice(0,16), // Creates today's date and time

done:false

});

}

/* =========================
   TASKS
========================= */

function addTask(){

const text =
$("taskInput").value.trim(); // Removes extra spaces from the task text

if(!text){

alert("Please enter a task.");
return;

}

tasks.push({

id:Date.now(), // Creates a unique ID using the current time

text:text,

description:$("descriptionInput").value,

priority:$("priority").value,

dueDate:$("dueDate").value,

done:false

});

$("taskInput").value = ""; // Clears the task input
$("descriptionInput").value = ""; // Clears the description input
$("dueDate").value = ""; // Clears the due date input

renderTasks(); // Updates the task list
renderCalendar(); // Updates the calendar

}