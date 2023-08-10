import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/rootReducer";
import { AppDispatch } from "redux/store";
import { getSimpleEvents } from "components/events/service/EventSlice";
import CreateEventModal from "components/events/CreateEventModal";
import EventDetails from "components/events/EventDetails";

const Events = () => {
  const { simpleEvents } = useSelector((state: RootState) => state.events);
  const { name } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [openEventModal, setOpenEventModal] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  // const sock = new SockJs("http://localhost:8080/ws");
  // let stompClient = Stomp.over(sock);

  const onClickOpenEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  useEffect(() => {
    dispatch(getSimpleEvents(name));
  }, []);

  return (
    <div style={{ width: "80%", height: "70%", display: "flex" }}>
      <div
        style={{
          border: "1px solid black",
          borderRadius: "16px 0 0 16px",
          width: "20%",
        }}
      >
        list of ongoing events
        <button onClick={() => setOpenEventModal(true)}>Create new</button>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {simpleEvents.map((event) => (
            <div
                key={event.eventId}
              style={{
                backgroundColor: "lightgray",
                width: "90%",
                borderRadius: "10px",
              }}
              onClick={() => onClickOpenEventDetails(event.eventId)}
            >
              <div>name: {event.name}</div>
              <div>type: {event.channelType}</div>
            </div>
          ))}
        </div>
        <CreateEventModal
          open={openEventModal}
          setOpen={() => setOpenEventModal(false)}
        />
      </div>
      <div
        style={{
          border: "1px solid black",
          borderRadius: "0 16px 16px 0",
          width: "80%",
          overflow: "hidden",
        }}
      >
        {selectedEventId !== "" && <EventDetails eventId={selectedEventId} />}
      </div>
    </div>
  );
};

export default Events;
