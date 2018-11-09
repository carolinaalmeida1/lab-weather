const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

$(document).ready(() => {
  $("#current-weather").on("click", () => {
    currentWeatherInfo();
    weatherInfo5Days()
  });
  // $("#five-days").on("click", () => weatherInfo5Days());

  function initMap(lat, lng) {
    var currentLocation = { lat: lat, lng: lng };
    var map = new google.maps.Map(
      document.getElementById('map'), { zoom: 16, center: currentLocation });
    var marker = new google.maps.Marker({ position: currentLocation, map: map });
  }

  window.navigator.geolocation.getCurrentPosition(function (position) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=e3747c4f5aa0b546e718e6ca89ace477`)
      .then(response => response.json())
      .then(data => {
        const date = new Date();
        const hourDiaAtual = date.getHours();
        const dayDiaAtual = date.getDate();
        const month = MONTHS[date.getMonth()];

        $(".info").append(`
        <div>
          <h1>${dayDiaAtual} de ${month}</h1>
          <i>${data.name} - ${data.sys.country}</i>
          <h2>${hourDiaAtual}h</h2>
          <h3>${Math.round(data.main.temp)}°C Atual</h3>
          <h3>${Math.round(data.main.temp_min)}°C Mínima</h3>
          <h3>${Math.round(data.main.temp_max)}°C Máxima</h3>

          <button id="more-details">VER MAIS</button>
        </div>
        `);
        $("#more-details").one("click", () => weatherDetails(data));
        initMap(position.coords.latitude, position.coords.longitude);
      })

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=e3747c4f5aa0b546e718e6ca89ace477`)
      .then(response => response.json())
      .then(data => { createAll(data.list) }
      )
  })
});

function currentWeatherInfo() {
  $(".info").html("");
  const location = $("#search-input").val();

  if (/[aA-zZ]/g.test(location)) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=e3747c4f5aa0b546e718e6ca89ace477`)
      .then(response => response.json())
      .then(data => {
        const date = new Date();
        const hourDiaAtual = date.getHours();
        const dayDiaAtual = date.getDate();
        const month = MONTHS[date.getMonth()];

        $(".info").append(`
          <div>
            <h1>${dayDiaAtual} de ${month}</h1>
            <i>${data.name} - ${data.sys.country}</i>
            <h2>${hourDiaAtual}h</h2>
            <h3>${Math.round(data.main.temp)}°C Atual</h3>
            <h3>${Math.round(data.main.temp_min)}°C Mínima</h3>
            <h3>${Math.round(data.main.temp_max)}°C Máxima</h3>

            <button id="more-details">VER MAIS</button>
          </div>
          `);
        function currentMap(lat, lng) {
          var currentLocation = { lat: lat, lng: lng };
          var map = new google.maps.Map(
            document.getElementById('map'), { zoom: 16, center: currentLocation });
          var marker = new google.maps.Marker({ position: currentLocation, map: map });
        }
        currentMap(data.coord.lat, data.coord.lon);
        $("#more-details").one("click", () => weatherDetails(data));
      })
  }
}

function weatherInfo5Days() {
  $(".five-days-weather").html("");
  const location = $("#search-input").val();

  if (/[aA-zZ]/g.test(location)) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&APPID=e3747c4f5aa0b546e718e6ca89ace477`)
      .then(response => response.json())
      .then(data => { createAll(data.list) }
      )
  }
}

function createAll(weatherListData) {
  weatherListData.reduce(function (diaAnterior, diaAtual, index) {

    const dateDiaAtual = new Date(diaAtual.dt_txt);
    const hourDiaAtual = dateDiaAtual.getHours();
    const dayDiaAtual = dateDiaAtual.getDate();
    const monthDiaAtual = dateDiaAtual.getMonth();
    const tempMinDiaAtual = Math.round(diaAtual.main.temp_min);
    const tempMaxDiaAtual = Math.round(diaAtual.main.temp_max);

    const dateDiaAnterior = new Date(diaAnterior.dt_txt);
    const hourDiaAnterior = dateDiaAnterior.getHours();
    const dayDiaAnterior = dateDiaAnterior.getDate();
    const monthDiaAnterior = dateDiaAnterior.getMonth();
    const tempMinDiaAnterior = Math.round(diaAnterior.main.temp_min);
    const tempMaxDiaAnterior = Math.round(diaAnterior.main.temp_max);

    if (index == 1) {
      $(".five-days-weather").append(`
        <h1>${dayDiaAnterior} de ${MONTHS[monthDiaAnterior]}</h1>
        <li>
          <span>${hourDiaAnterior}:00</span>
          <b>${tempMinDiaAnterior}°C MIN</b>
          <b>${tempMaxDiaAnterior}°C MAX</b>
        </li>
      `);
    }

    if (dayDiaAtual === dayDiaAnterior) {
      $(".five-days-weather").append(`
        <li>
          <span>${hourDiaAtual}:00</span>
          <b>${tempMinDiaAtual}°C MIN</b>
          <b>${tempMaxDiaAtual}°C MAX</b>
        </li>
      `);
    } else {
      $(".five-days-weather").append(`
        <h1>${dayDiaAtual} de ${MONTHS[monthDiaAtual]}</h1>
        <li>
          <span>${hourDiaAtual}:00</span>
          <b>${tempMinDiaAtual}°C MIN</b>
          <b>${tempMaxDiaAtual}°C MAX</b>
        </li>
      `);
    }
    return diaAtual;
  });
}

function weatherDetails(data) {
  $(".info").append(`
        <h2>Probabilidade de chuva: ${data.clouds.all}%</h2>
        <h2>Umidade: ${data.main.humidity}%</h2>
        <h2>Pressão: ${data.main.pressure} mb</h2>
        <h2>Vento: ${Math.round(data.wind.speed * 3.66)} km/h</h2>       
      `);
}

