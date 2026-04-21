import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

interface RequestWithUser {
  user: { id: string; email: string; role: string };
}

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiQuery({ name: 'teacherClassId', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: String })
  @ApiOkResponse({ description: 'List of attendance records' })
  findAll(
    @Query('teacherClassId') teacherClassId?: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findAll(teacherClassId, date);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Attendance record details' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Batch attendance saved' })
  batchUpsertAttendance(
    @Body() dto: CreateAttendanceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.attendanceService.batchUpsertAttendance(
      dto.teacherClassId,
      new Date(dto.date),
      dto.entries,
      req.user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'Attendance record deleted' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}