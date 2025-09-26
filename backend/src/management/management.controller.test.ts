import { Controller, Get } from "@nestjs/common";
import { ManagementService } from "./management.service";

@Controller("management")
export class ManagementController {
  constructor(private managementService: ManagementService) {
    console.log("[MANAGEMENT] Controller constructed");
  }

  @Get("test")
  async test() {
    return { message: "Management API working" };
  }
}
