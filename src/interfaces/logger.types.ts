interface logRequest {
  method: string;
  originalUrl: string;
  query: string;
  body: object;
}

interface logResponse {
  method: string;
  originalUrl: string;
  statusCode: number;
  body: object;
}

export { logResponse, logRequest };
