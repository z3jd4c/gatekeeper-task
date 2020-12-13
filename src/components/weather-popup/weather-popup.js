const WeatherPopup = ({ mainWeatherData }) => {
  return (
    <div>
      <div>
        <b>Temp:</b> { mainWeatherData.temp } <span>&#176;</span>C
      </div>
      <div>
        <b>Feels like:</b> { mainWeatherData.feels_like } <span>&#176;</span>C
      </div>
      <div>
        <b>Min temp:</b> { mainWeatherData.temp_min } <span>&#176;</span>C
      </div>
      <div>
        <b>Max temp:</b> { mainWeatherData.temp_max } <span>&#176;</span>C
      </div>
      <div>
        <b>Humidity:</b> { mainWeatherData.humidity } %
      </div>
    </div>
  )
}

export default WeatherPopup;