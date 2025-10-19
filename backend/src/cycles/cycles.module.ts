import { Module } from '@nestjs/common';
import { CyclesController } from './cycles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CyclesService } from './cycles.service';

@Module({
  imports: [PrismaModule],
  controllers: [CyclesController],
  providers: [CyclesService],
  exports: [CyclesService],
})
export class CyclesModule {}
