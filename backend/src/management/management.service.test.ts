import { Injectable } from "@nestjs/common";

@Injectable()
export class ManagementService {
  constructor() {
    console.log("[MANAGEMENT] Service constructed");
  }

  async test() {
    return { message: "Management service is working" };
  }
}
