import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { CreateNewEvent } from "components/events/service/model/Event";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import {
  getSimpleEvents,
  newEvent,
} from "components/events/service/EventSlice";
import { getEvents } from "components/events/service/EventService";
import { RootState } from "redux/rootReducer";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

interface OpenModalProps {
  open: boolean;
  setOpen: () => void;
}

const places = ["Roma", "American", "Kebab u kolegi"];
const users = ["kuba", "karol", "hubert", "marcel"];
const CreateEventModal = ({ open, setOpen }: OpenModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name } = useSelector((state: RootState) => state.user);
  const [eventData, setEventData] = useState({
    username: name,
    name: "",
    channelType: "",
    places: [],
    participants: [],
  } as CreateNewEvent);

  const onClickCreateNewProject = () => {
    if (eventData.name && eventData.channelType) {
      dispatch(newEvent(eventData)).then(() => {
        dispatch(getSimpleEvents(name));
        setOpen();
      });
    }
  };

  const handlePlaceChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setEventData({
      ...eventData,
      places: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleParticipantChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setEventData({
      ...eventData,
      participants: typeof value === "string" ? value.split(",") : value,
    });
  };

  return (
    <Modal open={open} onClose={setOpen}>
      <Box sx={style}>
        <div>name</div>
        <TextField
          onChange={(event) =>
            setEventData({ ...eventData, name: event.target.value })
          }
        />
        <div>channel type</div>
        <Select
          onChange={(event) =>
            setEventData({
              ...eventData,
              channelType: event.target.value as string,
            })
          }
        >
          <MenuItem value={"NORMAL"}>normal</MenuItem>
          <MenuItem value={"VOTING"}>voting</MenuItem>
          <MenuItem value={"ROULETTE"}>roulette</MenuItem>
        </Select>
        <div>possible places</div>
        <Select
          multiple
          value={eventData.places}
          onChange={handlePlaceChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {places.map((place) => (
            <MenuItem value={place} key={place}>
              <Checkbox checked={eventData.places.indexOf(place) > -1} />
              <ListItemText primary={place} />
            </MenuItem>
          ))}
        </Select>

        <div>possible participants</div>
        <Select
          multiple
          value={eventData.participants}
          onChange={handleParticipantChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {users.map((user) => (
            <MenuItem value={user} key={user}>
              <Checkbox checked={eventData.participants.indexOf(user) > -1} />
              <ListItemText primary={user} />
            </MenuItem>
          ))}
        </Select>
        <Button variant={"contained"} onClick={onClickCreateNewProject}>
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateEventModal;
