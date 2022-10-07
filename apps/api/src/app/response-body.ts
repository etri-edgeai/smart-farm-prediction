export class ResponseBody {
  timestamp: string = new Date().toISOString();
  constructor(public statusCode: number, public message: string = "") {}
}