import React, { useCallback, useState } from "react";
import {
  Event,
  EventRequestType,
  TestModeRequest,
  TestParticipantRequest,
  TestPlaceRequest,
} from "components/events/service/model/Event";
import { CompatClient } from "@stomp/stompjs";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "redux/rootReducer";

interface CurrentEventProps {
  currentEvent: Event;
  stompClient: CompatClient;
}
const CurrentEventInfo = ({ currentEvent, stompClient }: CurrentEventProps) => {
  const { eventId, channelType, participants, places, eventName, owner } =
    currentEvent;
  const { name } = useSelector((state: RootState) => state.user);
  const [participant, setParticipant] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  const sendModeRequest = (roomMode: string) => {
    const modeRequest: TestModeRequest = {
      eventId: eventId,
      mode: roomMode,
      eventRequestType: EventRequestType.MODE,
      eventOperationType: "ADD",
    };

    stompClient.send("/app/event-request", {}, JSON.stringify(modeRequest));
  };

  const sendParticipantRequest = (
    requestType: "ADD" | "REMOVE",
    participantId?: string,
  ) => {
    const participantRequest: TestParticipantRequest = {
      eventId: eventId,
      participant: participantId ? participantId : participant,
      eventRequestType: EventRequestType.PARTICIPANT,
      eventOperationType: requestType,
    };

    stompClient.send(
      "/app/event-request",
      {},
      JSON.stringify(participantRequest),
    );
    setParticipant("");
  };

  const sendPlaceRequest = (
    requestType: "ADD" | "REMOVE",
    placeId?: string,
  ) => {
    const placeRequest: TestPlaceRequest = {
      eventId: eventId,
      place: placeId ? placeId : place,
      eventOperationType: requestType,
      eventRequestType: EventRequestType.PLACE,
    };

    stompClient.send("/app/event-request", {}, JSON.stringify(placeRequest));
    setPlace("");
  };

  const isOwner = useCallback(() => {
    return name === owner;
  }, [name, owner]);

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
        <div>Name: {eventName}</div>
        <div>Mode: {channelType}</div>
        <div>Owner: {owner}</div>
        {isOwner() && (
          <Select
            value={channelType}
            onChange={(event) => sendModeRequest(event.target.value)}
          >
            <MenuItem value={"NORMAL"}>normal</MenuItem>
            <MenuItem value={"VOTING"}>voting</MenuItem>
            <MenuItem value={"ROULETTE"}>roulette</MenuItem>
          </Select>
        )}
      </div>
      <div>
        {" "}
        participants:
        <div>
          {participants.map((participant, index) => (
            <div key={index} style={{ display: "flex", gap: "10px" }}>
              <div>{participant}</div>
              {isOwner() && (
                <div
                  onClick={() => sendParticipantRequest("REMOVE", participant)}
                  style={{
                    backgroundColor: "lightyellow",
                    borderRadius: "16px",
                    width: "16px",
                  }}
                >
                  x
                </div>
              )}
            </div>
          ))}
        </div>
        <TextField
          onChange={(event) => setParticipant(event.target.value)}
          value={participant || ""}
        />
        <Button
          variant={"contained"}
          onClick={() => sendParticipantRequest("ADD")}
        >
          add
        </Button>
      </div>
      <div>
        {" "}
        places
        <div>
          {places.map((place, index) => (
            <div key={index} style={{ display: "flex", gap: "10px" }}>
              <div>{place}</div>
              {isOwner() && (
                <div
                  onClick={() => sendPlaceRequest("REMOVE", place)}
                  style={{
                    backgroundColor: "lightyellow",
                    borderRadius: "16px",
                    width: "16px",
                  }}
                >
                  x
                </div>
              )}
            </div>
          ))}
        </div>
        <TextField
          onChange={(event) => setPlace(event.target.value)}
          value={place || ""}
        />
        <Button variant={"contained"} onClick={() => sendPlaceRequest("ADD")}>
          add
        </Button>
      </div>
    </div>
  );
};

export default CurrentEventInfo;
