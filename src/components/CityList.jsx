import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import PropTypes from "prop-types";

function CityList({ cities, isLoading }) {
  if (isLoading) {
    return <Spinner />;
  }

  if(!cities?.length){
    return <Message message="Add your first city by clicking on your first city on the map"/> 
  }
  const renderedCities = cities.map((city) => (
    <CityItem key={city.id} city={city} />
  ));

  return <ul className={styles.cityList}>{renderedCities}</ul>;
}

CityList.propTypes = {
  cities: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CityList;

