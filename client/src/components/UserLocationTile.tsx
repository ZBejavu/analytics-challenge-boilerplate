import React, { useState, useCallback, useEffect, memo } from "react";
import { Resizable } from "re-resizable";
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import axios from "axios";
import styled from "styled-components";
import { Event } from "../models/event";
import { Loading } from "react-loading-wrapper";
import CanvasLoading from "./CanvasLoading";

const apiKey = "AIzaSyA1jO5KCUbo5ifKHb4LK5ilBN2Fp0NZb5Y";
const GoogleMapsTile = () => {
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const [events, setEvents] = useState<Event[] | undefined>(undefined);
  const [filter, setFilter] = useState<string>("signup");
  const [loading, setLoading] = useState<boolean>(true);
  const [center, setCenter] = useState({
    lat: 31.46667,
    lng: 34.783333,
  })

  const getFilteredMap = useCallback(async () => {
    setLoading(true);
    const { data: filteredEvents } = await axios.get(
      `http://localhost:3001/events/all-filtered?type=${filter}`
    );
    setEvents(filteredEvents.events);
    setCenter({
      lat: 31.46667,
      lng: 34.783333,
    })
    filteredEvents.events[0] && console.log(filteredEvents.events[0].geolocation.location)

    setLoading(false);
  }, [filter]);

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

  const mapStyle = { height: "100%", width: "100%" };
  return (
    <>
      <Resizable
        defaultSize={{
          width: "40vw",
          height: "35vh",
        }}
      >
        <Loading loadingComponent={<CanvasLoading />} loading={loading}>
          <Select onChange={(e) => setFilter(e.target.value)}>
            <option value={"signup"}>signup</option>
            <option value={"admin"}>admin</option>
            <option value={"login"}>login</option>
            <option value={"/"}>/</option>
          </Select>
          <LoadScript googleMapsApiKey={apiKey} loadingElement={CanvasLoading}>
            <GoogleMap
              mapContainerStyle={mapStyle}
              zoom={0.05}
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
              {Array.isArray(events) && (
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
      </Resizable>
    </>
  );
};

export default memo(GoogleMapsTile);

const Select = styled.select`
  background-color:#b5433f;
  color: #000000;
  padding: 12px;
  width: 20%;
  height:10%;
  position: absolute;
  top:5%;
  left: 5%;
  border: none;
  z-index: 8;
  font-size: 150%;
  outline: none;
    option {
      &:hover {
        background-color:black;
      }
    }
`;
