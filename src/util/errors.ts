export class RequestError extends Error {
  status: number;
  details: string[];
  
  constructor(message: string, status: number = 500, details: string[] = []) {
    super(message);
    this.message = message;
    this.status = status;
    this.details = details;
  }
};
