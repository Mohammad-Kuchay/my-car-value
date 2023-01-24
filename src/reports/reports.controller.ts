import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { createReportDto } from './dtos';
import { ReportsService } from './reports.service';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @UseGuards(AuthGuard)
  @Post()
  createReport(@Body() body: createReportDto) {
    return this.reportsService.create(body);
  }
}
