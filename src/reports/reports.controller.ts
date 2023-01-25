import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
// import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { User } from 'src/users/users.entity';
import {
  ApproveReportDto,
  createReportDto,
  GetEstimateDto,
  ReportDto,
} from './dtos';
import { ReportsService } from './reports.service';

// @UseInterceptors(CurrentUserInterceptor)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    console.log(query);
  }

  @UseGuards(AuthGuard)
  @Post()
  @Serialize(ReportDto)
  createReport(@Body() body: createReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
