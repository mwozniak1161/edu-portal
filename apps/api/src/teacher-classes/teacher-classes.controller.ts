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
import { TeacherClassesService } from './teacher-classes.service';
import { CreateTeacherClassDto } from './dto/create-teacher-class.dto';
import { UpdateTeacherClassDto } from './dto/update-teacher-class.dto';

@ApiTags('teacher-classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('teacher-classes')
export class TeacherClassesController {
  constructor(private readonly teacherClassesService: TeacherClassesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiQuery({ name: 'classId', required: false })
  @ApiOkResponse({ description: 'List of teacher-class assignments' })
  findAll(@Query('classId') classId?: string) {
    return this.teacherClassesService.findAll(classId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOkResponse({ description: 'TeacherClass details' })
  findOne(@Param('id') id: string) {
    return this.teacherClassesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'TeacherClass created' })
  create(@Body() dto: CreateTeacherClassDto) {
    return this.teacherClassesService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'TeacherClass updated' })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherClassDto) {
    return this.teacherClassesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'TeacherClass deleted' })
  remove(@Param('id') id: string) {
    return this.teacherClassesService.remove(id);
  }
}
