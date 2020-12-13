import React, { useEffect, useRef, useState } from 'react';
import CountryList from '../country-list/country-list';
import { renderToString } from 'react-dom/server'
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import './App.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoiejNqZDRjIiwiYSI6ImNraW45eWt6MjExN3cydXFqem5xZ3ZmbGoifQ.uaLGQlRqfN2LoNCcEv3enw';
const API_KEY = '1070dfd72c908673e91d1a7f395d8976';

function App() {
  const [ map, setMap ] = useState();
  const [ marker, setMarker ] = useState();
  const [ currentCoordinates, setCoordinates ] = useState(
    localStorage.getItem('coordinates') ? JSON.parse(localStorage.getItem('coordinates')) : null
  );

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer, flyTo }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: currentCoordinates ? [ currentCoordinates.y, currentCoordinates.x ] : [ 0, 0 ],
        zoom: 6
        });

        map.on("load", () => {
          setMap(map);
          map.resize();
          currentCoordinates && addMarker(currentCoordinates, map)

        });
    }

    if(!map) {
      initializeMap({ setMap, mapContainer, flyTo })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ map, currentCoordinates ]);

  const mapContainer = useRef(null);

  const loadWeatherInfoByCoordinates = async (coordinates) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${ coordinates.x }&lon=${ coordinates.y }&appid=${ API_KEY }&units=metric`);
  }

  const renderPopup = (mainWeatherData) => {
    const element = (
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
    );

    return renderToString(element); 
  }

  const flyTo = (coordinates) => {
    setCoordinates(coordinates)
    localStorage.setItem('coordinates', JSON.stringify(coordinates));

    addMarker(coordinates, map);
    
    map && map.flyTo(
      { center: [ coordinates.y, coordinates.x ] }
    );
  }

  const addMarker = async (coordinates, map) => {
    let weatherData = await loadWeatherInfoByCoordinates(coordinates);
    const mainWeatherData = weatherData ? weatherData.data.main : {};

    if(marker) {
      marker.remove();
    }
    
    if(map) {
      let newMarker = new mapboxgl.Marker()
      .setLngLat([coordinates.y, coordinates.x])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
      .setHTML(renderPopup(mainWeatherData)))
      .addTo(map);

    newMarker.togglePopup();

    setMarker(newMarker);
    }

  }

  return (
    <div className="App">
      <div>
        <CountryList onClickHandler={ flyTo } />
        <div ref={el => (mapContainer.current = el)} className="mapContainer"/>
      </div>
    </div>
  );
}

export default App;
