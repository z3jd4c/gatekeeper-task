import React, { useEffect, useRef, useState } from 'react';
import CountryList from '../country-list/country-list';
import WeatherPopup from '../../components/weather-popup/weather-popup';
import { renderToString } from 'react-dom/server'
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { credentials } from '../../constants/credentials';
import './App.scss';

mapboxgl.accessToken = credentials.mapboxToken;

function App() {
  const [ map, setMap ] = useState();
  const [ marker, setMarker ] = useState();
  const [ currentCoordinates, setCoordinates ] = useState(
    localStorage.getItem('coordinates') ? JSON.parse(localStorage.getItem('coordinates')) : null
  );

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
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
      initializeMap({ setMap, mapContainer })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ map, currentCoordinates ]);

  const mapContainer = useRef(null);

  const loadWeatherInfoByCoordinates = async (coordinates) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${ coordinates.x }&lon=${ coordinates.y }&appid=${ credentials.weatherApiToken }&units=metric`);
  }

  const renderPopup = (mainWeatherData) => {
    const element = (
      <WeatherPopup mainWeatherData={ mainWeatherData } />
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
