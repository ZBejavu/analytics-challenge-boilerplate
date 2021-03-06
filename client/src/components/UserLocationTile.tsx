import React, { useState, useCallback, useEffect, memo } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import axios from "axios";
import styled from "styled-components";
import { Event } from "../models/event";
import { Loading } from "react-loading-wrapper";
import apiKey from '../secrets';
const GoogleMapsTile = () => {
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const [events, setEvents] = useState<Event[] | undefined>(undefined);
  const [filter, setFilter] = useState<string>("signup");
  const [loading, setLoading] = useState<boolean>(true);
  const [Zoom, setZoom] = useState<number>(7);
  const [center, setCenter] = useState({
    lat: 31.46667,
    lng: 34.783333,
  })

  const getFilteredMap = useCallback(async () => {
    setLoading(true);
    const { data } = await axios.get(
      `http://localhost:3001/events/all-filtered?type=${filter}`
    );
    const filteredEvents = data.events
    setEvents(filteredEvents);
    setLoading(false);
  }, [filter]);

  const rezoomAndCenter = () => {
    if(!events){
      return;
    }
    let latSum= 0, lngSum = 0;
    events.forEach((event:Event) =>{
      latSum+= event.geolocation.location.lat;
      lngSum += event.geolocation.location.lng;
    });
    const middle= {lat: latSum / events.length, lng: lngSum/events.length};
    console.log('middle', middle)
    setCenter(middle);
    setZoom(2.2 + Math.random())
  }

  useEffect(() => {
    setTimeout(() => {
      rezoomAndCenter();
    }, 2000);
  }, [events]);

  useEffect(() => {
    getFilteredMap();
  }, [filter]);

  const onUnmount = useCallback(() => {
    setMap(undefined);
  }, []);

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const mapStyle = { height: "inherit", width: "inherit" };
  return (
      <div className='maptile'>
        <Loading loading={loading}>
        <div className='divTitle'>User Events by Location</div>
          <Select onChange={(e) => setFilter(e.target.value)}>
            <option value="" selected disabled hidden>choose an event</option>
            <option value={"signup"}>signup</option>
            <option value={"pageView"}>pageView</option>
            <option value={"login"}>login</option>
          </Select>
          <LoadScript googleMapsApiKey={apiKey} loadingElement={Loading}>
            <GoogleMap
              mapContainerStyle={mapStyle}
              zoom={Zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              center={center}
              options={{
                streetViewControl: false,
                center: center,
                mapTypeControl: false,
                fullscreenControl: false,
                scaleControl: true,
              }}
            >
              {Array.isArray(events) &&(
                <MarkerClusterer>
                  {(clusterer) =>
                    events.map((event:Event) => (
                      <Marker
                        key={event._id}
                        position={event.geolocation.location}
                        clusterer={clusterer}
                        title={event.browser}
                      />
                    ))
                  }
                </MarkerClusterer>
              )}
            </GoogleMap>
          </LoadScript>
        </Loading>
      </div>
  );
};

export default memo(GoogleMapsTile);

const Select = styled.select`
  background-color:#3e58ca;
  color: #000000;
  padding: 12px;
  width: 28%;
  min-height:22px;
  position: relative;
  top:15%;
  left: 3%;
  border: none;
  z-index: 8;
  font-size: 150%;
  outline: none;
  background-color:rgb(116, 160, 197);
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 0 10px #444444;
    option {
      &:hover {
        background-color:black;
      }
    }
`;
