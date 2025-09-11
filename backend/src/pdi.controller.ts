import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { MockAuthGuard } from "./mock-auth.guard";

// Tipos básicos (simples)
interface Pdi {
  id: number;
  userId: number;
  competencies: string[];
  milestones: string[];
  keyResults: string[];
}

let pdis: Pdi[] = [
  {
    id: 1,
    userId: 1,
    competencies: ["React", "TypeScript"],
    milestones: ["M1"],
    keyResults: ["KR1"],
  },
];

@Controller("pdi")
@UseGuards(MockAuthGuard)
export class PdiController {
  @Get(":userId")
  findOne(@Param("userId") userId: string) {
    return pdis.find((pdi) => pdi.userId === +userId);
  }

  @Post()
  create(@Body() pdi: Omit<Pdi, "id">) {
    const newPdi = { ...pdi, id: Date.now() };
    pdis.push(newPdi);
    return newPdi;
  }

  @Put(":userId")
  update(@Param("userId") userId: string, @Body() pdi: Partial<Pdi>) {
    const idx = pdis.findIndex((p) => p.userId === +userId);
    if (idx === -1) return null;
    pdis[idx] = { ...pdis[idx], ...pdi };
    return pdis[idx];
  }

  @Delete(":userId")
  remove(@Param("userId") userId: string) {
    pdis = pdis.filter((pdi) => pdi.userId !== +userId);
    return { deleted: true };
  }
}
