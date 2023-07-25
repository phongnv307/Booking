import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const MapComponent = ({ address, google }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ address });
        if (response && response.length > 0) {
          const { lat, lng } = response[0].geometry.location;
          setLocation({ lat: lat(), lng: lng() });
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [address, google]);

  return (
    <Map
      google={google}
      center={location ? location : { lat: 0, lng: 0 }}
      zoom={13}
      style={{ width: "800px", height: "500px" }}
    >
      {location && (
        <Marker position={location} />
      )}
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDPeKFH8YWnjbwUFbJ6_uQoKQOWAx5YvxQ", 
})(MapComponent);
