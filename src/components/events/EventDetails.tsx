import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/rootReducer";
import { AppDispatch } from "redux/store";
import { Stomp } from "@stomp/stompjs";
import {
  ChatMessage,
  ChatMessageRequest,
  ChatMessageResponse,
  Event,
  ParticipantResponse,
  PlaceResponse,
  RoomModeResponse,
} from "components/events/service/model/Event";
import { getEventDetails } from "components/events/service/EventSlice";
import SockJs from "sockjs-client";
import Chat from "components/events/Chat";
import CurrentEvent from "components/events/CurrentEvent";

interface EventDetailsProps {
  eventId: string;
}

let stompClient: any = null;
const EventDetails = ({ eventId }: EventDetailsProps) => {
  const { name } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [currentEvent, setCurrentEvent] = useState<Event>({
    eventId: "",
    name: "",
    channelType: "",
    places: [],
    participants: [],
    chatMessages: [],
  } as Event);

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    stompClient = Stomp.over(function () {
      return new SockJs("http://localhost:8080/ws");
    });
    stompClient.connect({}, onConnected);
  }, []);

  useEffect(() => {
    dispatch(getEventDetails(eventId)).then((res) => {
      const data: Event = res.payload;
      setCurrentEvent(data);
    });
  }, [dispatch, eventId]);

  const onConnected = () => {
    stompClient.subscribe(`/user/${eventId}/event-chat`, onMessageReceived);
    stompClient.subscribe(`/user/${eventId}/event-mode`, onModeReceived);
    stompClient.subscribe(
      `/user/${eventId}/event-participant`,
      onParticipantReceived,
    );
    stompClient.subscribe(`/user/${eventId}/event-place`, onPlaceReceived);
  };

  const onMessageReceived = (payload: any) => {
    const data: ChatMessageResponse = JSON.parse(payload.body);
    const newMessage: ChatMessage = {
      senderName: data.senderName,
      message: data.message,
      time: data.time,
    };

    setCurrentEvent((prevState) => {
      return {
        ...prevState,
        chatMessages: [...prevState.chatMessages, newMessage],
      };
    });
  };

  useEffect(() => {
    console.log("currentEvent", currentEvent);
  }, [currentEvent]);

  const onModeReceived = (payload: any) => {
    const data: RoomModeResponse = JSON.parse(payload.body);
    console.log("MODE REQUEST", data);
    setCurrentEvent((prevState) => {
      return { ...prevState, channelType: data.mode };
    });
  };
  const onParticipantReceived = (payload: any) => {
    const data: ParticipantResponse = JSON.parse(payload.body);
    console.log("PARTICIPANT RESPONSE", data);
    setCurrentEvent((prevState) => {
      return {
        ...prevState,
        participants: [...prevState.participants, data.participant],
      };
    });
  };
  const onPlaceReceived = (payload: any) => {
    const data: PlaceResponse = JSON.parse(payload.body);
    console.log("PLACE RESPONSE", data);
    setCurrentEvent((prevState) => {
      return { ...prevState, places: [...prevState.places, data.place] };
    });
  };

  const sendMessageRequest = () => {
    const messageRequest = {
      senderName: name,
      eventId: eventId,
      message: message,
      status: "MESSAGE",
    } as ChatMessageRequest;

    stompClient.send(
      "/app/event-message-request",
      {},
      JSON.stringify(messageRequest),
    );
    setMessage("");
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <CurrentEvent currentEvent={currentEvent} stompClient={stompClient} />
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Chat chatMessages={currentEvent.chatMessages} />
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button onClick={() => sendMessageRequest()}>send</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
