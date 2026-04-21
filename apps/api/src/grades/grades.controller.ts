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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CreateCorrectionGradeDto } from './dto/create-correction-grade.dto';

interface RequestWithUser {
  user: { id: string; email: string; role: string };
}

@ApiTags('grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  @Roles(Role.TEACHER, Role.STUDENT)
  @ApiQuery({ name: 'teacherClassId', required: false })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiOkResponse({ description: 'List of grades' })
  findAll(
    @Query('teacherClassId') teacherClassId?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.gradesService.findAll(teacherClassId, studentId);
  }

  @Get('average/:teacherClassId/:studentId')
  @Roles(Role.TEACHER, Role.STUDENT)
  @ApiOkResponse({ description: 'Weighted average for student in teacher-class' })
  getAverage(
    @Param('teacherClassId') teacherClassId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.gradesService.getWeightedAverage(teacherClassId, studentId);
  }

  @Get(':id')
  @Roles(Role.TEACHER, Role.STUDENT)
  @ApiOkResponse({ description: 'Grade details' })
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Grade created' })
  create(@Body() dto: CreateGradeDto, @Request() req: RequestWithUser) {
    return this.gradesService.create(dto, req.user.id);
  }

  @Post('correction')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Correction grade created, original marked as excluded' })
  createCorrection(
    @Body() dto: CreateCorrectionGradeDto,
    @Request() req: RequestWithUser,
  ) {
    return this.gradesService.createCorrection(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Grade updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGradeDto,
    @Request() req: RequestWithUser,
  ) {
    return this.gradesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Grade deleted' })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.gradesService.remove(id, req.user.id);
  }
}
