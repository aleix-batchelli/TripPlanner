function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function refresBoard() {
  try {
    const pos = await getPosition();
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    await loadChart(lat, lon);
  } catch (err) {
    console.error("Geolocation failed:", err);
    await loadChart(41.3851, 2.1734);
  }
}

async function loadChart(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code`
  );
  const data = await response.json();

  const times = data.hourly.time.slice(0, 6).map(t => t.split("T")[1]);
  const temps = data.hourly.temperature_2m.slice(0, 6);
  const currentTemp = data.hourly.temperature_2m[0];
  const codes = data.hourly.weather_code.slice(0, 1);

  updateWeatherIcon(codes[0]);
  updateCurrentTemp(currentTemp);

  const ctx = document.getElementById("weather-chart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        borderColor: "#3BAFDA",
        backgroundColor: "rgba(59, 175, 218, 0.15)",
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true }
      }
    }
  });
}

function updateCurrentTemp(currentTemp) {
  var tmp = document.getElementById('current-tmp');
  tmp.textContent = `${currentTemp}°C`;
  
}

function updateWeatherIcon(code) {
  let icon = "images/unknown.png";
  console.log(code);
  if (code === 0 || code === 1) {
    icon = "./res/img/sunny.png";
  } else if (code === 2 || code === 3) {
    icon = "./res/img/cloudy.png";
  } else if (code === 45 || code === 48) {
    icon = "./res/img/fog.png";
  } else if (code === 71 || code === 73 || code === 75 || code === 77) {
    icon = "./res/img/snow.png";
  } else if (code === 95 || code === 96 || code === 99) {
    icon = "./res/img/storm.png";
  }
  else {
    icon = "./res/img/rain.png";
  }

  document.getElementById("weather-icon").src = icon;
  console.log("Icon set to:", document.getElementById("weather-icon").src);
}





document.addEventListener("DOMContentLoaded", refresBoard);
