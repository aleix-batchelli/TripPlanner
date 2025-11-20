function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function fetchWeatherData(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
  );
  const data = await response.json();

  return {
    times: data.hourly.time.slice(0, 24).map(t => t.split("T")[1]),
    temps: data.hourly.temperature_2m.slice(0, 24),
    currentTemp: data.hourly.temperature_2m[0],
    codes: data.hourly.weather_code.slice(0, 1),
    week: data.daily.time.map((day, i) => ({
      date: day,
      min: data.daily.temperature_2m_min[i],
      max: data.daily.temperature_2m_max[i],
      code: data.daily.weather_code[i]
    }))
  };
}

async function loadScreen(lat, lon) {
  const weatherData = await fetchWeatherData(lat, lon);

  document.getElementById('weather-icon').src = getWeatherIcon(weatherData.codes[0]);
  updateCurrentTemp(weatherData.currentTemp);
  updateWeatherInfo(weatherData.times[0], weatherData.codes[0]);

  const ctx = document.getElementById("weather-chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: weatherData.times,
      datasets: [{
        label: "Temperature (°C)",
        data: weatherData.temps,
        borderColor: "#3BAFDA",
        backgroundColor: "rgba(59, 175, 218, 0.2)",
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: "#ffffff", font: { size: 12 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: "#ffffff", font: { size: 12 } },
          grid: { color: "rgba(255,255,255,0.1)" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#333",
          titleColor: "#fff",
          bodyColor: "#fff"
        }
      }
    }
  });

  setWeekInfo(weatherData.week);
}

async function refreshScreen() {
  try {
    const pos = await getPosition();
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    await loadScreen(lat, lon);
  } catch (err) {
    await loadScreen(41.3851, 2.1734);
  }
}

function updateWeatherInfo(dateTime, code) {
  const dayTmp = document.getElementById("day-time");
  const desc = document.getElementById("weather-description");

  const date = new Date();
  const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
  dayTmp.textContent = date.toLocaleString("en-GB", options);

  desc.textContent = getWeatherDescription(code);
}

function getWeatherDescription(code) {
  if (code === 0 || code === 1) return "Sunny";
  if (code === 2 || code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if ([71,73,75,77].includes(code)) return "Snow";
  if ([95,96,99].includes(code)) return "Storm";
  return "Rain";
}

function setWeekInfo(week) {
  const daysMap = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

  week.forEach(dayInfo => {
    const dayName = daysMap[new Date(dayInfo.date).getDay()];
    const dayEl = document.getElementById(dayName);

    if (dayEl) {
      const iconEl = dayEl.querySelector("img");
      if (iconEl) iconEl.src = getWeatherIcon(dayInfo.code);

      const tempsEl = dayEl.querySelector(".temps");
      if (tempsEl) tempsEl.textContent = `${dayInfo.max} \\ ${dayInfo.min} °C`;
    }
  });
}


function updateCurrentTemp(currentTemp) {
  const tmp = document.getElementById('current-tmp');
  tmp.textContent = `${currentTemp}°C`;
}

function getWeatherIcon(code) {
  if (code === 0 || code === 1) return "./res/img/sunny.png";
  if (code === 2 || code === 3) return "./res/img/cloudy.png";
  if (code === 45 || code === 48) return "./res/img/fog.png";
  if ([71,73,75,77].includes(code)) return "./res/img/snow.png";
  if ([95,96,99].includes(code)) return "./res/img/storm.png";
  return "./res/img/rain.png";
}

document.addEventListener("DOMContentLoaded", refreshScreen);
