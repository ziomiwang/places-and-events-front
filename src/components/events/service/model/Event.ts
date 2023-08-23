export interface EventsState {
  simpleEvents: Array<SimpleEvent>;
  event: Event;
}

export interface SimpleEvent {
  eventId: string;
  name: string;
  channelType: string;
}

export interface Event {
  eventId: string;
  eventName: string;
  owner: string;
  channelType: string;
  participants: Array<string>;
  places: Array<string>;
  chatMessages: Array<ChatMessage>;
}
export interface CreateNewEvent {
  username: string;
  name: string;
  channelType: string;
  places: Array<string>;
  participants: Array<string>;
}

export interface ChatMessage {
  senderName: string;
  message: string;
  time: Date;
}

export interface ChatMessageRequest {
  senderName: string;
  message: string;
  eventId: string;
  status: string;
}

export interface ChatMessageResponse {
  senderName: string;
  message: string;
  time: Date;
}

export interface RoomModeRequest {
  eventId: string;
  mode: string;
}

export interface RoomModeResponse {
  mode: string;
}

export interface ParticipantRequest {
  eventId: string;
  participant: string;
  requestType: "ADD" | "REMOVE";
}

export interface ParticipantResponse {
  participant: string;
  requestType: "ADD" | "REMOVE";
}

export interface PlaceRequest {
  eventId: string;
  place: string;
  requestType: "ADD" | "REMOVE";
}
export interface PlaceResponse {
  place: string;
  requestType: "ADD" | "REMOVE";
}

export interface PlaceWithVotes {
  place: string;
  votes: number;
}

interface EventRequest {
  eventId: string;
  eventRequestType: string;
  eventOperationType: string;
}
export interface TestMessageRequest extends EventRequest {
  senderName: string;
  message: string;
}

export interface TestParticipantRequest extends EventRequest {
  participant: string;
}

export interface TestPlaceRequest extends EventRequest {
  place: string
}

export interface TestModeRequest extends EventRequest {
  mode: string
}

export interface EventResponse {
  eventRequestType: string;
  eventOperationType: string;
}

export interface TestMessageResponse extends EventResponse {
  senderName: string;
  message: string;
}

export interface TestParticipantResponse extends EventResponse {
  participant: string;
}

export interface TestPlaceResponse extends EventResponse {
  place: string;
}

export interface TestRoomModeResponse extends EventResponse {
  mode: string;
}

export enum EventRequestType {
  "MESSAGE" = "MESSAGE",
  "PARTICIPANT" = "PARTICIPANT",
  "PLACE" = "PLACE",
  "MODE" = "MODE",
}
