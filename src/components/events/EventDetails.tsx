import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/rootReducer";
import { AppDispatch } from "redux/store";
import { Stomp } from "@stomp/stompjs";
import {
  ChatMessage,
  Event,
  EventRequestType,
  TestMessageRequest,
  TestMessageResponse,
  TestParticipantResponse,
  TestPlaceResponse,
  TestRoomModeResponse,
} from "components/events/service/model/Event";
import { getEventDetails } from "components/events/service/EventSlice";
import SockJs from "sockjs-client";
import Chat from "components/events/Chat";
import CurrentEventInfo from "components/events/CurrentEventInfo";
import RouletteComponent from "components/events/RoluetteComponent";
import VotingComponent from "components/events/VotingComponent";

interface EventDetailsProps {
  eventId: string;
}

let stompClient: any = null;
const EventDetails = ({ eventId }: EventDetailsProps) => {
  const { name } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [currentEvent, setCurrentEvent] = useState<Event>({
    eventId: "",
    eventName: "",
    owner: "",
    channelType: "",
    places: [],
    participants: [],
    chatMessages: [],
  } as Event);
  const [tabElement, setTabElement] = useState<ReactElement>();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    switch (currentEvent.channelType) {
      case "VOTING": {
        setTabElement(
          <VotingComponent
            eventId={currentEvent.eventId}
            places={currentEvent.places}
          />,
        );
        break;
      }
      case "ROULETTE": {
        setTabElement(<RouletteComponent />);
        break;
      }
      default: {
        setTabElement(<div></div>);
      }
    }
  }, [currentEvent.channelType, currentEvent.eventId, currentEvent.places]);

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
    stompClient.subscribe(`/user/${eventId}/event`, onResponseReceived);
  };

  const onResponseReceived = (payload: any) => {
    const data = JSON.parse(payload.body);
    console.log("payload", payload);
    switch (data.eventRequestType as EventRequestType) {
      case EventRequestType.MESSAGE: {
        const typedData: TestMessageResponse = data;
        onMessageReceived(typedData);
        break;
      }
      case EventRequestType.PARTICIPANT: {
        const typedData: TestParticipantResponse = data;
        onParticipantReceived(typedData);
        break;
      }
      case EventRequestType.PLACE: {
        const typedData: TestPlaceResponse = data;
        onPlaceReceived(typedData);
        break;
      }
      case EventRequestType.MODE: {
        const typedData: TestRoomModeResponse = data;
        onModeReceived(typedData);
        break;
      }
    }
  };

  const onMessageReceived = (data: TestMessageResponse) => {
    // const data: ChatMessageResponse = JSON.parse(payload.body);
    const newMessage: ChatMessage = {
      senderName: data.senderName,
      message: data.message,
      time: new Date(),
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

  const onModeReceived = (data: TestRoomModeResponse) => {
    setCurrentEvent((prevState) => {
      return { ...prevState, channelType: data.mode };
    });
  };
  const onParticipantReceived = (data: TestParticipantResponse) => {
    if (data.eventOperationType === "ADD") {
      setCurrentEvent((prevState) =>
        addParticipant(prevState, data.participant),
      );
    } else {
      setCurrentEvent((prevState) =>
        removeParticipant(prevState, data.participant),
      );
    }
  };

  const addParticipant = (prevState: Event, participant: string) => {
    return {
      ...prevState,
      participants: [...prevState.participants, participant],
    };
  };
  const removeParticipant = (prevState: Event, participant: string) => {
    const index = prevState.participants.indexOf(participant);
    if (index > -1) {
      const array = [...prevState.participants];
      array.splice(index, 1);
      return {
        ...prevState,
        participants: array,
      };
    }
    return prevState;
  };
  const onPlaceReceived = (data: TestPlaceResponse) => {
    if (data.eventOperationType === "ADD") {
      setCurrentEvent((prevState) => addPlace(prevState, data.place));
    } else {
      setCurrentEvent((prevState) => removePlace(prevState, data.place));
    }
  };

  const addPlace = (prevState: Event, place: string) => {
    return {
      ...prevState,
      places: [...prevState.places, place],
    };
  };
  const removePlace = (prevState: Event, place: string) => {
    const index = prevState.places.indexOf(place);
    if (index > -1) {
      const array = [...prevState.places];
      array.splice(index, 1);
      return {
        ...prevState,
        places: array,
      };
    }
    return prevState;
  };

  const sendMessageRequest = () => {
    const messageRequest = {
      senderName: name,
      eventId: eventId,
      message: message,
      eventOperationType: "ADD",
      eventRequestType: EventRequestType.MESSAGE,
    } as TestMessageRequest;

    stompClient.send("/app/event-request", {}, JSON.stringify(messageRequest));
    setMessage("");
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <CurrentEventInfo currentEvent={currentEvent} stompClient={stompClient} />
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {tabElement}
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
