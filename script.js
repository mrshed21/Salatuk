const fajr = document.getElementById("fajr");
const dhuhr = document.getElementById("dhuhr");
const asr = document.getElementById("asr");
const maghrib = document.getElementById("maghrib");
const isha = document.getElementById("isha");
const day = document.getElementById("day-data");

today = new Date();
const yearNow = today.getFullYear();
const dayNow = String(today.getDate()).padStart(2, '0');
const monthNow = String(today.getMonth() + 1).padStart(2, '0'); // الأشهر تبدأ من 0
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
    "Kristianstad"
];
const citySelect = document.getElementById("city-select");
for (city of cites) {
    citySelect.innerHTML += 
    `<option value="${city}">${city}</option>`;
}
citySelect.addEventListener("change", function() {
    const selectedCity = citySelect.value;
    document.getElementById("city-name").innerHTML = selectedCity;
    getPrayerTimes(selectedCity);
});




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
        day.innerHTML = weekday + " " +readable.readable ;
    } catch (error) {
        console.error("Error fetching prayer times:", error);
    }
    }
getPrayerTimes(cites[0]);