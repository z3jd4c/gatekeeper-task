import React from 'react';
import './country-item.scss';

const CountryItem = ({ country, onClickHandler, selectedCountry }) => {
  const buttonClicked = () => {
    onClickHandler({x: country.latlng[0], y: country.latlng[1]}, country.name);
  }

  const _className = country.name === selectedCountry ? 'country-item selected' : 'country-item';

  return (
    <div className={ _className } onClick={ buttonClicked } key={ country.name } >
      { country.name }
    </div>
  )
}

export default CountryItem;