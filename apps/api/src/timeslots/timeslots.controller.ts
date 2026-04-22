import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { TimeslotsService } from './timeslots.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';

@ApiTags('timeslots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('timeslots')
export class TimeslotsController {
  constructor(private readonly timeslotsService: TimeslotsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiQuery({ name: 'teacherClassId', required: false })
  @ApiQuery({ name: 'classId', required: false })
  @ApiOkResponse({ description: 'List of timeslots' })
  findAll(@Query('teacherClassId') teacherClassId?: string, @Query('classId') classId?: string) {
    return this.timeslotsService.findAll(teacherClassId, classId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOkResponse({ description: 'Timeslot details' })
  findOne(@Param('id') id: string) {
    return this.timeslotsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Timeslot created' })
  create(@Body() dto: CreateTimeslotDto) {
    return this.timeslotsService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Timeslot updated' })
  update(@Param('id') id: string, @Body() dto: UpdateTimeslotDto) {
    return this.timeslotsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'Timeslot deleted' })
  remove(@Param('id') id: string) {
    return this.timeslotsService.remove(id);
  }
}
