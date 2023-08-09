import React, { useState } from "react";
import {
  Event,
  ParticipantRequest,
  PlaceRequest,
  RoomModeRequest,
} from "components/events/service/model/Event";
import { CompatClient } from "@stomp/stompjs";
import {Button, MenuItem, Select, TextField} from "@mui/material";

interface CurrentEventProps {
  currentEvent: Event;
  stompClient: CompatClient;
}
const CurrentEvent = ({ currentEvent, stompClient }: CurrentEventProps) => {
  const { eventId, channelType, participants, places, name } = currentEvent;
  const [participant, setParticipant] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  const sendModeRequest = (roomMode: string) => {
    const modeRequest: RoomModeRequest = {
      eventId: eventId,
      mode: roomMode,
    };

    stompClient.send(
      "/app/event-room-mode-request",
      {},
      JSON.stringify(modeRequest),
    );
  };

  const sendParticipantRequest = () => {
    const participantRequest: ParticipantRequest = {
      eventId: eventId,
      participant: participant,
    };

    console.log("PARTICIPANT req", participantRequest)
    stompClient.send(
      "/app/event-participant-request",
      {},
      JSON.stringify(participantRequest),
    );
  };

  const sendPlaceRequest = () => {
    const placeRequest: PlaceRequest = {
      eventId: eventId,
      place: place,
    };

    stompClient.send(
      "/app/event-place-request",
      {},
      JSON.stringify(placeRequest),
    );
  };

  return (
    <div
      style={{
        backgroundColor: "gray",
        width: "30%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <div>
        room info
        <div>Name: {name}</div>
        <div>Mode: {channelType}</div>
          <Select value={channelType} onChange={(event) => sendModeRequest(event.target.value)}>
              <MenuItem value={"NORMAL"}>normal</MenuItem>
              <MenuItem value={"VOTING"}>voting</MenuItem>
              <MenuItem value={"ROULETTE"}>roulette</MenuItem>
          </Select>
      </div>
      <div>
        {" "}
        participants:
        <div>
          {participants.map((participant, index) => (
            <div key={index}>{participant}</div>
          ))}
        </div>
        <TextField onChange={(event) => setParticipant(event.target.value)}/>
        <Button variant={"contained"} onClick={sendParticipantRequest}>add</Button>
      </div>
      <div>
        {" "}
        places
        <div>
          {places.map((place, index) => (
            <div key={index}>{place}</div>
          ))}
        </div>
        <TextField onChange={(event) => setPlace(event.target.value)}/>
        <Button variant={"contained"} onClick={sendPlaceRequest}>add</Button>
      </div>
    </div>
  );
};

export default CurrentEvent;
