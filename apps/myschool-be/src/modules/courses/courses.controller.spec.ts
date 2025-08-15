import { Test, TestingModule } from "@nestjs/testing";
import { CoursesController } from "./courses.controller"
import { CoursesService } from "./courses.service";
import { CourseSortField, CourseSortOrder, CreateCourseDto, CreateCourseResponseDto, DeleteCourseResponseDto, GetCourseResponseDto, GetCoursesResponseDto, SearchCoursesDto, UpdateCourseDto, UpdateCourseResponseDto } from "./schemas/course.dto";

describe('CourseController', () => {
    let controller: CoursesController;
    let service: CoursesService;

    const mockCoursesService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CoursesController],
            providers: [
                {
                    provide: CoursesService,
                    useValue: mockCoursesService
                }
            ]
        }).compile();
        controller = module.get<CoursesController>(CoursesController);
        service = module.get<CoursesService>(CoursesService);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })


    describe('create', () => {
        it('should create a course successfully', async () => {
            const createCourseDto: CreateCourseDto = {
                courseId: 12345,
                name: 'Test Course',
                description: 'Test Description'
            };
            const expectedResponse: CreateCourseResponseDto = {
                status: true,
                message: 'Course created successfully',
                data: {
                    _id: '507f1f77bcf86cd799439011',
                    courseId: 12345,
                    name: 'Test Course'
                }
            };
            mockCoursesService.create.mockResolvedValue(expectedResponse);

            const result = await controller.create(createCourseDto);

            expect(service.create).toHaveBeenCalledWith(createCourseDto);
            expect(service.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResponse);


        });

        it('should handle service errors during creation', async () => {
            const createCourseDto: CreateCourseDto = {
                courseId: 12345,
                name: 'Test Course',
                description: 'Test Description'
            };
            const error = new Error("Course creation failed");
            mockCoursesService.create.mockRejectedValue(error);


            await expect(controller.create(createCourseDto)).rejects.toThrow('Course creation failed');
            expect(service.create).toHaveBeenCalledWith(createCourseDto);

        });


    })


    describe('findAll', () => {
        it('should return all courses with default search parameters', async () => {
            // Arrange
            const searchDto: SearchCoursesDto = {
                page: 1,
                limit: 10
            };

            const expectedResponse: GetCoursesResponseDto = {
                status: true,
                message: 'Courses fetched successfully',
                data: [
                    {
                        _id: '507f1f77bcf86cd799439011',
                        name: 'Test Course 1',
                        createdAt: 'Mon Jan 01 2024',
                        courseId: 12345
                    }
                ],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 13,
                    totalPages: 2,
                    hasNext: false,
                    hasPrev: false
                }
            };

            mockCoursesService.findAll.mockResolvedValue(expectedResponse);

            const result = await controller.findAll(searchDto);

            expect(service.findAll).toHaveBeenCalledWith(searchDto);
            expect(service.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResponse);
        });

        it('should return courses with search parameters', async () => {
            // Arrange
            const searchDto: SearchCoursesDto = {
                page: 1,
                limit: 5,
                searchTerm: 'JavaScript',
                sortBy: CourseSortField.NAME,
                sortOrder: CourseSortOrder.ASC
            };

            const expectedResponse: GetCoursesResponseDto = {
                status: true,
                message: 'Courses fetched successfully',
                data: [
                    {
                        _id: '507f1f77bcf86cd799439011',
                        name: 'JavaScript Basics',
                        createdAt: 'Mon Jan 01 2024',
                        courseId: 12345
                    }
                ],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 13,
                    totalPages: 2,
                    hasNext: false,
                    hasPrev: false
                }
            };

            mockCoursesService.findAll.mockResolvedValue(expectedResponse);

            // Act
            const result = await controller.findAll(searchDto);

            // Assert
            expect(service.findAll).toHaveBeenCalledWith(searchDto);
            expect(result).toEqual(expectedResponse);
        });

        it('should handle empty results', async () => {
            // Arrange
            const searchDto: SearchCoursesDto = {
                page: 1,
                limit: 10,
                searchTerm: 'nonexistent'
            };

            const expectedResponse: GetCoursesResponseDto = {
                status: true,
                message: 'Courses fetched successfully',
                data: [],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 13,
                    totalPages: 2,
                    hasNext: false,
                    hasPrev: false
                }
            };

            mockCoursesService.findAll.mockResolvedValue(expectedResponse);

            // Act
            const result = await controller.findAll(searchDto);

            // Assert
            expect(service.findAll).toHaveBeenCalledWith(searchDto);
            expect(result).toEqual(expectedResponse);
        });
    });


    describe('findById', () => {
        it('should return a course by ID', async () => {
            // Arrange
            const courseId = '507f1f77bcf86cd799439011';
            const expectedResponse: GetCourseResponseDto = {
                status: true,
                message: 'Course fetched successfully',
                data: {
                    _id: courseId,
                    courseId: 12345,
                    name: 'Test Course',
                    createdAt: 'Mon Jan 01 2024'
                }
            };

            mockCoursesService.findById.mockResolvedValue(expectedResponse);

            // Act
            const result = await controller.findById(courseId);

            // Assert
            expect(service.findById).toHaveBeenCalledWith(courseId);
            expect(service.findById).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResponse);
        });

        it('should handle course not found', async () => {
            // Arrange
            const courseId = '507f1f77bcf86cd799439011';
            const error = new Error('Course not found');
            mockCoursesService.findById.mockRejectedValue(error);

            // Act & Assert
            await expect(controller.findById(courseId)).rejects.toThrow('Course not found');
            expect(service.findById).toHaveBeenCalledWith(courseId);
        });
    });


    describe('update', () => {
        it('should update a course successfully', async () => {
            // Arrange
            const courseId = '507f1f77bcf86cd799439011';
            const updateCourseDto: UpdateCourseDto = {
                courseId: 12345,
                name: 'Updated Course Name',
            };

            const expectedResponse: UpdateCourseResponseDto = {
                status: true,
                message: 'Course updated successfully',
                data: {
                    _id: courseId,
                    courseId: 12345,
                    name: 'Updated Course Name'
                }
            };


            mockCoursesService.update.mockResolvedValue(expectedResponse);

            const result = await controller.update(courseId, updateCourseDto);


            expect(service.update).toHaveBeenCalledWith(courseId, updateCourseDto);
            expect(service.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResponse);

        })

        it('should handle course not found during update', async () => {
            // Arrange
            const courseId = '507f1f77bcf86cd799439011';
            const updateCourseDto: UpdateCourseDto = {
                name: 'Updated Course Name'
            };

            const error = new Error('Course not found for update');
            mockCoursesService.update.mockRejectedValue(error);

            // Act & Assert
            await expect(controller.update(courseId, updateCourseDto)).rejects.toThrow('Course not found for update');
            expect(service.update).toHaveBeenCalledWith(courseId, updateCourseDto);
        });
    });



    describe('delete', () => {
        it('should delete a course successfully', async () => {
            // Arrange
            const courseId = '507f1f77bcf86cd799439011';
            const expectedResponse: DeleteCourseResponseDto = {
                status: true,
                message: 'Course deleted successfully.'
            };

            mockCoursesService.delete.mockResolvedValue(expectedResponse);

            // Act
            const result = await controller.delete(courseId);

            // Assert
            expect(service.delete).toHaveBeenCalledWith(courseId);
            expect(service.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResponse);
        });

        it('should handle course not found during deletion', async () => {
            // Arrange
            const courseId = '507f1f77bcf86cd799439011';
            const error = new Error('Course not found for deletion');
            mockCoursesService.delete.mockRejectedValue(error);

            // Act & Assert
            await expect(controller.delete(courseId)).rejects.toThrow('Course not found for deletion');
            expect(service.delete).toHaveBeenCalledWith(courseId);
        });
    });

    describe('Controller Integration', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });

        it('should have courseService injected', () => {
            expect(service).toBeDefined();
        });
    });




})