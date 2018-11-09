const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
$(document).ready(() => {

  // $(".preview").delay("3000").slideUp("slow");
  // $("main").delay("3000").fadeIn("slow").css("display","flex");

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

  $("#current-weather").on("click", (e) => {
    e.preventDefault();
    currentWeatherInfo();
    weatherInfo5Days();
  });
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
  let arrayPorDias = {};
  weatherListData.reduce(function (diaAnterior, diaAtual, index) {

    const dateDiaAtual = new Date(diaAtual.dt_txt);
    const dayDiaAtual = dateDiaAtual.getDate();
    const tempMinDiaAtual = Math.round(diaAtual.main.temp_min);
    const tempMaxDiaAtual = Math.round(diaAtual.main.temp_max);

    const dateDiaAnterior = new Date(diaAnterior.dt_txt);
    const dayDiaAnterior = dateDiaAnterior.getDate();
    const tempMinDiaAnterior = Math.round(diaAnterior.main.temp_min);
    const tempMaxDiaAnterior = Math.round(diaAnterior.main.temp_max);

    if (index == 1) {
      arrayPorDias[dayDiaAtual] = {
        min: tempMinDiaAnterior, max: tempMaxDiaAnterior
      };
    }
    if (dayDiaAtual === dayDiaAnterior) {
      if (arrayPorDias[dayDiaAtual].min > tempMinDiaAtual) {
        arrayPorDias[dayDiaAtual].min = tempMinDiaAtual;
      }
      if (arrayPorDias[dayDiaAtual].max < tempMaxDiaAtual) {
        arrayPorDias[dayDiaAtual].max = tempMaxDiaAtual;
      }
    } else {
      arrayPorDias[dayDiaAtual] = {
        min: dayDiaAtual, max: dayDiaAtual
      };
    }
    return diaAtual;
  });
  for (let i in arrayPorDias) {
    let date = new Date();

    $(".five-days-weather").append(`
    <div class="five-days-item">
      <h1>${i} de ${MONTHS[date.getMonth()]}</h1>
      <div>
        <h3>${arrayPorDias[i].min}°C MIN</h3>
        <h3>${arrayPorDias[i].max}°C MAX</h3>
      </div>
    </div>
  `);
  }
}

function weatherDetails(data) {
  $(".info").append(`
        <h3>Probabilidade de chuva: ${data.clouds.all}%</h3>
        <h3>Umidade: ${data.main.humidity}%</h3>
        <h3>Pressão: ${data.main.pressure} mb</h3>
        <h3>Vento: ${Math.round(data.wind.speed * 3.66)} km/h</h3>       
      `);
}

