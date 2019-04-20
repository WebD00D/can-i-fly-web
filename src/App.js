import React, { Component } from 'react';
import styled from '@emotion/styled';
import { Box, Flex, Text } from 'rebass';
import moment from 'moment';
import _ from 'lodash';

import 'antd/dist/antd.css';
import './index.css';

import { Checkbox } from 'antd';

import AIRPLANE from './assets/AIRPLANE.svg';
import AIRPORT from './assets/AIRPORT.svg';
import CLOUDS from './assets/CLOUDS.svg';
import TEMPERATURE from './assets/TEMP.svg';
import TIME from './assets/TIME.svg';
import VISIBILITY from './assets/VISIBILITY.svg';
import WIND from './assets/WIND.svg';

export const Container = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 12px;
  padding-right: 12px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 18px;
  opacity: 0.5;
  text-transform: uppercase;
  font-weight: 900;
  text-align: center;
`;

export const AirportCodeLabel = styled(Text)`
  color: #dbcdf8;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

export const AirportCode = styled.input`
  height: 42px;
  border: none;
  padding-left: 12px;
  color: #fff;
  font-weight: 600;
  outline: none;
  background: linear-gradient(
    270deg,
    rgba(70, 66, 133, 0.5) 0%,
    rgba(73, 37, 191, 0.5) 100%
  );
  border-radius: 6px;
`;

export const SubmitButton = styled.button`
  width: 325px;
  height: 51px;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(123.43deg, #d74cee 7.72%, #4925bf 90.97%);
  border-radius: 50px;
  transition: 0.2s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const DefaultCheckbox = styled(Checkbox)`
  color: #fff;

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #d74cee;
    border-color: #d74cee;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const DataBox = styled.div`
  width: 100%;
  height: 180px;
  background: rgba(70, 66, 133, 0.5);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
`;

const DataBoxLabel = styled(Text)`
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: normal;
  text-align: center;
  letter-spacing: 2px;
  color: #fff;
`;

const Icon = styled.img`
  height: 26px;
  width: auto;
`;

const OneByTwoGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 22px;

  @media (max-width: 700px) {
    grid-gap: 12px;
  }
`;

const TwoByTwoGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 22px;

  @media (max-width: 700px) {
    grid-gap: 12px;
  }
`;

const CloudsList = styled(Flex)`
  width: 100%;
  height: auto;
  background: rgba(70, 66, 133, 0.5);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
`;

const CloudDataItem = styled(Flex)`
  width: 100%;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: 600;

  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(198, 177, 240, 0.5);

  &:last-child {
    margin-bottom: 8px;
  }
`;

const DataItem = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      airports: [],
      airportCodeInput: 'KSMO',
      station: '',
      time: '',
      clouds: [],
      windDegrees: 0,
      windKts: 0,
      visibility: 0,
      tempC: 0,
      tempF: 0,
      flightRules: ''
    };

    this.WEATHER_KEY = 'e582a58beca4c74aa748e5eb45';
    this.AIRPORT_KEY = '434ab4-331379';
  }

  componentDidMount() {
    // GET AIRPORTS

    const url = `https://aviation-edge.com/v2/public/airportDatabase?key=${
      this.AIRPORT_KEY
    }`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const airports = _.filter(data, i => i.nameCountry === 'United States');
        console.log('AIRPORTS', airports);
        this.setState({
          airports
        });
      });

    this.fetchData('KSMO');
  }

  fetchData(airport) {
    const url = `https://api.checkwx.com/metar/${airport}/decoded?pretty=1`;

    fetch(url, {
      headers: {
        'X-API-Key': this.WEATHER_KEY
      }
    })
      .then(res => res.json())
      .then(response => {
        const d = response.data[0];

        const date = moment.utc(d.observed).toDate();
        const local = moment(date)
          .local()
          .format('YYYY-MM-DD HH:mm:ss');

        const rightNow = moment(Date.now());

        this.setState({
          airportCodeInput: airport,
          station: d.station.name,
          time: moment(rightNow).to(moment(local)),
          clouds: d.clouds,
          windDegrees: d.wind.degrees,
          windKts: d.wind.speed_kts,
          visibility: d.visibility.miles,
          tempC: d.temperature.celsius,
          tempF: d.temperature.fahrenheit,
          flightRules: d.flight_category
        });
      })
      .catch(error => console.error('Error:', error));
  }

  renderCloudData() {
    const clouds =
      this.state.clouds &&
      Object.keys(this.state.clouds).map(c => {
        const cloud = this.state.clouds[c];

        return (
          <CloudDataItem key={c}>
            {cloud.text} at {cloud.base_feet_agl} AGL
          </CloudDataItem>
        );
      });

    return clouds;
  }

  renderAirports() {
    return (
      this.state.airports &&
      Object.keys(this.state.airports).map(a => (
        <option key={a} value={this.state.airports[a].codeIcaoAirport}>
          {this.state.airports[a].codeIcaoAirport} -{' '}
          {this.state.airports[a].nameAirport}
        </option>
      ))
    );
  }

  render() {
    return (
      <Container>
        <Box mb={4}>
          <Title>Can I fly?</Title>
        </Box>
        <Flex flexDirection="column">
          <AirportCodeLabel>Airport Code</AirportCodeLabel>
          <AirportCode
            list="airports"
            onChange={e => this.setState({ airportCodeInput: e.target.value })}
            value={this.state.airportCodeInput}
          />
          <datalist id="airports">{this.renderAirports()}</datalist>
          <Flex justifyContent="center" alignItems="center" mt={12}>
            <SubmitButton
              onClick={() => this.fetchData(this.state.airportCodeInput)}
            >
              Get METAR Data
            </SubmitButton>
          </Flex>
          <Box mt={50} mb={[12, 22]}>
            <OneByTwoGrid>
              <DataBox>
                <Icon src={AIRPORT} />
                <DataItem>{this.state.station}</DataItem>
                <DataBoxLabel>STATION</DataBoxLabel>
              </DataBox>

              <DataBox>
                <Icon src={TIME} />
                <DataItem>{this.state.time}</DataItem>
                <DataBoxLabel>OBSERVED</DataBoxLabel>
              </DataBox>
            </OneByTwoGrid>
          </Box>
          <Box mb={[12, 22]}>
            <CloudsList>
              <Flex alignItems="center">
                <Icon src={CLOUDS} />
                <DataBoxLabel ml={2}>CLOUDS</DataBoxLabel>
              </Flex>
              <Flex flexDirection="column" width="100%" mt={10}>
                {this.renderCloudData()}
              </Flex>
            </CloudsList>
          </Box>
          <TwoByTwoGrid>
            <DataBox>
              <Icon src={WIND} />
              <DataItem>
                {this.state.windDegrees || '-'}° at {this.state.windKts}kts
              </DataItem>
              <DataBoxLabel>WIND</DataBoxLabel>
            </DataBox>
            <DataBox>
              <Icon src={VISIBILITY} />
              <DataItem>{this.state.visibility || '-'} miles</DataItem>
              <DataBoxLabel>VISIBILITY</DataBoxLabel>
            </DataBox>
            <DataBox>
              <Icon src={TEMPERATURE} />
              <DataItem>
                {this.state.tempC || '-'}°C / {this.state.tempF || '-'}°F
              </DataItem>
              <DataBoxLabel>TEMPERATURE</DataBoxLabel>
            </DataBox>
            <DataBox>
              <Icon src={AIRPLANE} />
              <DataItem>{this.state.flightRules}</DataItem>
              <DataBoxLabel>CONDITIONS</DataBoxLabel>
            </DataBox>
          </TwoByTwoGrid>
        </Flex>
        <Box mt={60}>
          <Flex justifyContent="center">
            <DataBoxLabel>
              MADE WITH LOVE BY{' '}
              <a
                target="_blank"
                style={{ color: '#d74cee' }}
                href="https://www.instagram.com/my.friend.christian/"
              >
                @MY.FRIEND.CHRISTIAN
              </a>
            </DataBoxLabel>
          </Flex>
        </Box>
      </Container>
    );
  }
}

export default App;
