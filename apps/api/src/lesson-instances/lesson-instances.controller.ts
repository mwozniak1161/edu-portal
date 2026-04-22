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
import { LessonInstancesService } from './lesson-instances.service';
import { CreateLessonInstanceDto } from './dto/create-lesson-instance.dto';
import { UpdateLessonInstanceDto } from './dto/update-lesson-instance.dto';
import { GenerateLessonInstancesDto } from './dto/generate-lesson-instances.dto';

interface RequestWithUser {
  user: { id: string; email: string; role: string };
}

@ApiTags('lesson-instances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('lesson-instances')
export class LessonInstancesController {
  constructor(private readonly lessonInstancesService: LessonInstancesService) {}

  @Get()
  @Roles(Role.TEACHER, Role.STUDENT)
  @ApiQuery({ name: 'teacherClassId', required: false })
  @ApiQuery({ name: 'date', required: false })
  @ApiOkResponse({ description: 'List of lesson instances' })
  findAll(@Query('teacherClassId') teacherClassId?: string, @Query('date') date?: string) {
    return this.lessonInstancesService.findAll(teacherClassId, date);
  }

  @Get(':id')
  @Roles(Role.TEACHER, Role.STUDENT)
  @ApiOkResponse({ description: 'Lesson instance details' })
  findOne(@Param('id') id: string) {
    return this.lessonInstancesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Lesson instance created' })
  create(@Body() dto: CreateLessonInstanceDto, @Request() req: RequestWithUser) {
    return this.lessonInstancesService.create(dto, req.user.id);
  }

  @Post('generate-for-date')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Lesson instances generated from timeslots for date' })
  generateForDate(@Body() dto: GenerateLessonInstancesDto, @Request() req: RequestWithUser) {
    return this.lessonInstancesService.generateForDate(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Lesson instance updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonInstanceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.lessonInstancesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Lesson instance deleted' })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.lessonInstancesService.remove(id, req.user.id);
  }
}
