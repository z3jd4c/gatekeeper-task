import React, { useState } from 'react';
import CountryItem from './country-item/country-item';
import { countries } from '../../data/countries';
import './country-list.scss';

const CountryList = ({ onClickHandler }) => {
  const [ selecteCountry, setSelectedCountry ] = useState(localStorage.getItem('selected-country') || '');

  const handleCountryselected = (coordinates, selectedCountry) => {
    localStorage.setItem('selected-country', selectedCountry);
    setSelectedCountry(selectedCountry);
    onClickHandler(coordinates);
  };

  const renderCountries = () => countries.map( (country) => (<CountryItem
    country={ country }
    selectedCountry={ selecteCountry }
    onClickHandler={ handleCountryselected } />
  ));
  
  return(
    <div className="country-list">
      { renderCountries() }
    </div>
  )
}

export default CountryList;