import { AxiosResponse } from "axios";
import { CreateNewEvent, SimpleEvent } from "./model/Event";
import axios from "shared/axios/axios";

export const getEvents = async () => {
  return axios
    .get<Array<SimpleEvent>>("/event/all")
    .then((res: AxiosResponse) => res.data);
};

export const getSingleEventDetails = async (eventId: string) => {
  return axios
    .get<Event>(`/event/single/${eventId}`)
    .then((res: AxiosResponse) => res.data);
};

export const createNewEvent = async (newEvent: CreateNewEvent) => {
  return axios.post("/event/new", newEvent).then((res: AxiosResponse) => res.data);
};

const EventService = {
  getEvents,
  getSingleEventDetails,
  createNewEvent,
};

export default EventService;
