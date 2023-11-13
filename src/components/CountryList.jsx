import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import PropTypes from "prop-types";

function CountryList({ cities, isLoading }) {
  if (isLoading) {
    return <Spinner />;
  }

  if (!cities?.length) {
    return (
      <Message message="Add your first city by clicking on your first city on the map" />
    );
  }
  const countries = cities.reduce((acc, cur) => {
    if (!acc.filter((el) => el.country === cur.country).length) {
      return [...acc, { country: cur.country, emoji: cur.emoji }];
    } else {
      return acc;
    }
  }, []);

  const renderedCountries = countries.map((country) => (
    <CountryItem country={country} key={country.country} />
  ));

  return <ul className={styles.countryList}>{renderedCountries}</ul>;
}

CountryList.propTypes = {
  cities: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CountryList;
