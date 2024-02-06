import { useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/use-url-position";
import { useEffect } from "react";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCitiesContext from "../hooks/use-cities-context";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCitiesContext();
  const [cityName, setCityName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeocodingError("");
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );

        const data = await response.json();
        if (!data.countryCode)
          throw new Error(
            "That does not seem to be a city. Click somewhere else 🙂"
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  if (geocodingError) return <Message message={geocodingError} />;
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (isLoadingGeocoding) return <Spinner />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(currentDate) => setDate(currentDate)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
