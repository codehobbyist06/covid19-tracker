import React, {useState, useEffect} from "react";
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import InfoBox from './InfoBox.js';
import Map from './Map.js';
import {Card, CardContent, } from '@material-ui/core';
import Table from './Table.js';
import {sortData, prettyPrintStat} from './utils.js';
import LineGraph from './LineGraph.js';
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  const default_center =[25.26,32.72];
  const [center, setCenter] = useState(default_center);

  const [zoom, setZoom] = useState(3);
  const [casesType, setCasesType] = useState('cases');
  const [mapCountries,setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setcountryInfo(data);
    });
  },[]);

  // Making an API Call to get the  list of countries
  useEffect(() => {
    const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((response) => response.json())
    .then((data) => {
      const countries = data.map((country) => ({
       name: country.country,
       value: country.countryInfo.iso2, 
      }));
      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
      setMapCountries(data);
  });
  }
  getCountriesData();
  }, []);

  // Get all the countries data and update the cards and map accordingly
  const onCountryChange = async (event) => {
   const countryCode = event.target.value;
   
   const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all'
   : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

   await fetch(url)
   .then(response => response.json())
   .then(data => {
     setCountry(countryCode);
     setcountryInfo(data);
    //  console.log(data);
     if(countryCode === "worldwide"){
      setCenter(default_center);
      setZoom(3); 
     }
     else{
      setCenter([data.countryInfo.lat,data.countryInfo.long]);
      // console.log(data.countryInfo.lat,data.countryInfo.long);
      setZoom(4);
     }
   });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {
                countries.map((country,index) => (
                  <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
          isRed={true}
          onClick={(e) => setCasesType('cases')} 
          title="Coronavirus" 
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={prettyPrintStat(countryInfo.cases)}
          active={casesType==="cases"}
          />
          <InfoBox
          isRed={false}  
          onClick={(e) => setCasesType('recovered')} 
          title="Recovered" 
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={prettyPrintStat(countryInfo.recovered)}
          active={casesType==="recovered"}
          />
          <InfoBox
          isRed={true}  
          onClick={(e) => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}
          active={casesType==="deaths"}
          />
        </div>

        <Map center={center}
        zoom={zoom}
        countries={mapCountries}
        casesType={casesType}
        />
      </div>

      <Card className="app__right">
          <CardContent className="app__right__table">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
          </CardContent>
          <CardContent className="app__right__graph">
            <h3>WorldWide {casesType}</h3>
            <LineGraph className="app__right__graph__actual" casesType={casesType}/>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
