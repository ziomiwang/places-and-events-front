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
  time: Date
}

export interface ChatMessageRequest{
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
  requestType: "ADD" | "REMOVE"
}

export interface ParticipantResponse {
  participant: string;
  requestType: "ADD" | "REMOVE"
}

export interface PlaceRequest {
  eventId: string;
  place: string;
  requestType: "ADD" | "REMOVE"
}
export interface PlaceResponse {
  place: string;
  requestType: "ADD" | "REMOVE"
}
