export type WebSocketEventData =
  | WebSocketSendEventData
  | WebSocketMessageEventData;

type WebSocketSendEventData = {
  event: "send";
  payload: {
    url: string;
    data: string;
  };
};

type WebSocketMessageEventData = {
  event: "message";
  payload: {
    url: string;
    data: string;
  };
};

export type XhrEventData = {
  event: "request" | "response";
  payload: {
    url: string;
    data: string;
  };
};

export type FetchEventData = FetchEventRequestData | FetchEventResponseData;

type FetchEventRequestData = {
  event: "request";
  payload: {
    url: string;
    data: string;
  };
};

type FetchEventResponseData = {
  event: "response";
  payload: FetchEventRequestData["payload"] & {
    status?: number;
  };
};
