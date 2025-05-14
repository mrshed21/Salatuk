const fajr = document.getElementById("fajr");
const dhuhr = document.getElementById("dhuhr");
const asr = document.getElementById("asr");
const maghrib = document.getElementById("maghrib");
const isha = document.getElementById("isha");
const day = document.getElementById("day-data");
const currentTimeElement = document.getElementById("current-time");
const nextPrayerElement = document.getElementById("next-prayer");

today = new Date();
const yearNow = today.getFullYear();
const dayNow = String(today.getDate()).padStart(2, "0");
const monthNow = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
const formattedDate = `${dayNow}-${monthNow}-${yearNow}`;

let cites = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Västerås",
  "Örebro",
  "Linköping",
  "Helsingborg",
  "Norrköping",
  "Jönköping",
  "Lund",
  "Umeå",
  "Gävle",
  "Borås",
  "Sundsvall",
  "Karlstad",
  "Trollhättan",
  "Kalmar",
  "Skövde",
  "Kristianstad",
];
const citySelect = document.getElementById("city-select");
for (city of cites) {
  citySelect.innerHTML += `<option value="${city}">${city}</option>`;
}
citySelect.addEventListener("change", function () {
  const selectedCity = citySelect.value;
  document.getElementById("city-name").innerHTML = selectedCity;
  getPrayerTimes(selectedCity);
});

let updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  currentTimeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
};

let updateNextPrayer = (timings) => {
  const now = new Date();
  const prayerTimes = [
    { name: "Fajr", time: timings.Fajr },
    { name: "Dhuhr", time: timings.Dhuhr },
    { name: "Asr", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isha", time: timings.Isha },
  ];

  let nextPrayer = null;
  let nextPrayerTime = null;

  for (let prayer of prayerTimes) {
    const [prayerHour, prayerMinute] = prayer.time.split(":").map(Number);
    const prayerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      prayerHour,
      prayerMinute
    );

    if (prayerDate > now) {
      nextPrayer = prayer.name;
      nextPrayerTime = prayerDate;
      break;
    }
  }

  if (!nextPrayer) {
    // If no upcoming prayer today, set to Fajr of the next day
    const [fajrHour, fajrMinute] = timings.Fajr.split(":").map(Number);
    nextPrayer = "Fajr";
    nextPrayerTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      fajrHour,
      fajrMinute
    );
  }

  const timeDiff = nextPrayerTime - now;
  const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(
    2,
    "0"
  );
  const minutes = String(
    Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  ).padStart(2, "0");
  const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(
    2,
    "0"
  );

  nextPrayerElement.innerHTML = `Next Prayer: <span>${nextPrayer}</span> in ${hours}:${minutes}:${seconds}`;
};

setInterval(updateClock, 1000);

let getPrayerTimes = async (city) => {
  const Api_URL = ` https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=SE&method=12`;

  try {
    const response = await axios.get(Api_URL);
    const timings = response.data.data.timings;
    const readable = response.data.data.date;
    fajr.innerHTML = timings.Fajr;
    dhuhr.innerHTML = timings.Dhuhr;
    asr.innerHTML = timings.Asr;
    maghrib.innerHTML = timings.Maghrib;
    isha.innerHTML = timings.Isha;
    const weekday = readable.gregorian.weekday.en;
    day.innerHTML = weekday + " " + readable.readable;

    // Update next prayer countdown
    setInterval(() => updateNextPrayer(timings), 1000);
  } catch (error) {
    console.error("Error fetching prayer times:", error);
  }
};
getPrayerTimes(cites[0]);
