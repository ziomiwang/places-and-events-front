import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import eventService from "components/events/service/EventService";
import {CreateNewEvent, EventsState, SimpleEvent} from "components/events/service/model/Event";

const initialState = {
  simpleEvents: [] as Array<SimpleEvent>,
  event: {},
} as EventsState;
export const getSimpleEvents = createAsyncThunk("/events/get", async () => {
  return await eventService.getEvents();
});

export const getEventDetails = createAsyncThunk(
  "/events/{eventId}",
  async (eventId: string) => {
    return await eventService.getSingleEventDetails(eventId);
  },
);

export const newEvent = createAsyncThunk("/event/new", async (newEvent: CreateNewEvent) => {
    return await eventService.createNewEvent(newEvent);
})

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getSimpleEvents.fulfilled,
        (state: EventsState, action: PayloadAction<any>) => {
          state.simpleEvents = action.payload;
        },
      )
      .addCase(
        getEventDetails.fulfilled,
        (state: EventsState, action: PayloadAction<any>) => {
          state.event = action.payload;
        },
      );
  },
});

export default eventSlice.reducer;
