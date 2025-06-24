<template>
  <div>
    <h1>Tableau de Bord</h1>
    <div>
      <h2>Météo à {{ location }}</h2>
      <p>Température : {{ weather.temp }}°C</p>
      <p>Précipitations : {{ weather.rain }} mm</p>
    </div>
    <div>
      <h2>Saisons de Plantation</h2>
      <p>Culture : {{ crop }}</p>
      <p>Plantation : {{ season.plant }}</p>
      <p>Récolte : {{ season.harvest }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      location: 'Paris',
      weather: { temp: '', rain: '' },
      crop: 'wheat',
      season: { plant: '', harvest: '' }
    };
  },
  async mounted() {
    // Récupérer les données météo via l'API Gateway
    const weatherResponse = await axios.get(`http://localhost:3000/weather?location=${this.location}`);
    this.weather = {
      temp: weatherResponse.data.main.temp,
      rain: weatherResponse.data.rain ? weatherResponse.data.rain['1h'] : 0
    };

    // Récupérer les saisons via l'API Gateway
    const seasonResponse = await axios.get(`http://localhost:3000/agriculture/seasons?location=${this.location}&crop=${this.crop}`);
    this.season = seasonResponse.data.season;
  }
};
</script>

