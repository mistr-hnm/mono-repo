import { CoursesService } from "./courses.service"
import { Model } from "mongoose";
import { Course, CourseDocument } from "./schemas/course.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { CourseSortField, CourseSortOrder, CreateCourseDto, SearchCoursesDto, UpdateCourseDto } from "./schemas/course.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PaginationUtil } from "../../lib/paginatation.util";





jest.mock('../../lib/paginatation.util', () => {
  const actual = jest.requireActual('../../lib/paginatation.util'); 
  return {
      ...actual,
      PaginationUtil: {
          getSkip: jest.fn((page: number, limit: number) => (page - 1) * limit),
          paginate: jest.fn((status, message, data, total, page, limit) => ({
              status,
              message,
              data,
              pagination: {
                  currentPage: page,
                  totalPages: Math.ceil(total / limit),
                  totalItems: total,
                  itemsPerPage: limit,
                  hasNextPage: page * limit < total,
                  hasPreviousPage: page > 1
              }
          }))
      }
  }
});


describe('CoursesService', () => {
    let service: CoursesService;
    let model: Model<CourseDocument>
     
    
    const mockCourseModel : any = {
        findOne: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn(),
        new: jest.fn(),
        constructor: jest.fn(),
        save: jest.fn(),
        exec: jest.fn(),
        skip: jest.fn(),
        limit: jest.fn(),
        sort: jest.fn(),
        select: jest.fn()
    };

    const mockCourseData = {
        _id: '507f1f77bcf86cd799439011',
        courseId: 12345,
        name: 'Test Course',
        description: 'Test Description',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoursesService,
                {
                    provide: getModelToken(Course.name),
                    useValue: mockCourseModel,
                },
            ],
        }).compile();

        service = module.get<CoursesService>(CoursesService);
        model = module.get<Model<CourseDocument>>(getModelToken(Course.name));

        // Reset all mocks
        Object.values(mockCourseModel).forEach(mock => {
            if (jest.isMockFunction(mock)) {
                mock.mockClear();
            }
        });
    });

    describe('create', () => {
      let mockCourseModel: any;
      let service: CoursesService;
    
      beforeEach(() => {
        const mockSave = jest.fn().mockResolvedValue(mockCourseData);
    
        
        mockCourseModel = jest.fn().mockImplementation(() => ({
          save: mockSave
        }));
    
      
        mockCourseModel.findOne = jest.fn();    
        service = new CoursesService(mockCourseModel);
      });
    
      it('should create a course successfully', async () => {
       
        const createCourseDto: CreateCourseDto = {
          courseId: 12345,
          name: 'Test Course',
          description: 'Test Description'
        };
    
        mockCourseModel.findOne.mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });
    
      
        const result = await service.create(createCourseDto);
    
        expect(mockCourseModel.findOne).toHaveBeenCalledWith({
          courseId: createCourseDto.courseId
        });
        expect(result).toEqual({
          status: true,
          message: 'Course created successfully',
          data: {
            _id: mockCourseData._id.toString(),
            courseId: mockCourseData.courseId,
            name: mockCourseData.name
          }
        });
      });
    
      it('should throw BadRequestException when course ID already exists', async () => {
        // Arrange
        const createCourseDto: CreateCourseDto = {
          courseId: 12345,
          name: 'Test Course',
          description: 'Test Description'
        };
    
        mockCourseModel.findOne.mockReturnValue({
          select: jest.fn().mockResolvedValue({ _id: '5454e4r5fs4f8sf8d4sdf' })
        });
    
        // Act & Assert
        await expect(service.create(createCourseDto)).rejects.toThrow(BadRequestException);
        await expect(service.create(createCourseDto)).rejects.toThrow(
          'Course with this ID already exists.'
        );
      });
    });
    
    
      describe('findAll', () => {
        it('should return paginated courses with default parameters', async () => {
          // Arrange
          const searchDto: SearchCoursesDto = {
            page: 1,
            limit: 10
          };
    
          const mockCourses = [mockCourseData];
          const totalCount = 1;
    
          // Mock the chaining methods
          const mockQuery = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockCourses)
          };
    
          mockCourseModel.find.mockReturnValue(mockQuery);
          mockCourseModel.countDocuments.mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalCount)
          });
    
          // Act
          const result = await service.findAll(searchDto);


    
          // Assert
          expect(mockCourseModel.find).toHaveBeenCalledWith({});
          expect(mockQuery.skip).toHaveBeenCalledWith(0);
          expect(mockQuery.limit).toHaveBeenCalledWith(10);
          expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
          expect(PaginationUtil.paginate).toHaveBeenCalledWith(
            true,
            'Courses fetched successfully',
            expect.any(Array),
            totalCount,
            1,
            10
          );
        });
    
        it('should return courses with search term', async () => {
          // Arrange
          const searchDto: SearchCoursesDto = {
            page: 1,
            limit: 10,
            searchTerm: 'JavaScript',
            sortBy: CourseSortField.NAME,
            sortOrder: CourseSortOrder.ASC
          };
    
          const mockCourses = [mockCourseData];
          const totalCount = 1;
    
          const mockQuery = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockCourses)
          };
    
          mockCourseModel.find.mockReturnValue(mockQuery);
          mockCourseModel.countDocuments.mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalCount)
          });
    
          // Act
          const result = await service.findAll(searchDto);
    
          // Assert
          expect(mockCourseModel.find).toHaveBeenCalledWith({
            $or: [
              { name: expect.any(RegExp) },
              { description: expect.any(RegExp) }
            ]
          });
          expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
        });
    
        it('should return courses with numeric search term', async () => {
          // Arrange
          const searchDto: SearchCoursesDto = {
            page: 1,
            limit: 10,
            searchTerm: '12345'
          };
    
          const mockCourses = [mockCourseData];
          const totalCount = 1;
    
          const mockQuery = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockCourses)
          };
    
          mockCourseModel.find.mockReturnValue(mockQuery);
          mockCourseModel.countDocuments.mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalCount)
          });
    
          // Act
          const result = await service.findAll(searchDto);
    
          // Assert
          expect(mockCourseModel.find).toHaveBeenCalledWith({
            $or: [
              { name: expect.any(RegExp) },
              { description: expect.any(RegExp) },
              { courseId: 12345 }
            ]
          });
        });
    
        it('should return empty result when no courses found', async () => {
          // Arrange
          const searchDto: SearchCoursesDto = {
            page: 1,
            limit: 10,
            searchTerm: 'nonexistent'
          };
    
          const mockQuery = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([])
          };
    
          mockCourseModel.find.mockReturnValue(mockQuery);
          mockCourseModel.countDocuments.mockReturnValue({
            exec: jest.fn().mockResolvedValue(0)
          });
    
          // Act
          const result = await service.findAll(searchDto);
    
          // Assert
          expect(PaginationUtil.paginate).toHaveBeenCalledWith(
            true,
            'Courses fetched successfully',
            [],
            0,
            1,
            10
          );
        });
      });
    
      describe('findById', () => {
        it('should return a course by ID', async () => {
          // Arrange
          const courseId = '507f1f77bcf86cd799439011';
    
          mockCourseModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCourseData)
          });
    
          // Act
          const result = await service.findById(courseId);
    
          // Assert
          expect(mockCourseModel.findById).toHaveBeenCalledWith(courseId);
          expect(result).toEqual({
            status: true,
            message: 'Course fetched successfully',
            data: {
              _id: mockCourseData._id.toString(),
              courseId: mockCourseData.courseId,
              name: mockCourseData.name,
              createdAt: mockCourseData.createdAt.toDateString()
            }
          });
        });
    
        it('should throw NotFoundException when course not found', async () => {
          // Arrange
          const courseId = '507f1f77bcf86cd799439011';
    
          mockCourseModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
          });
    
          // Act & Assert
          await expect(service.findById(courseId)).rejects.toThrow(NotFoundException);
          await expect(service.findById(courseId)).rejects.toThrow(`Course with ID "${courseId}" not found.`);
        });
      });
    
      describe('update', () => {
        let mockCourseModel: any;
        let service: CoursesService;
      
        beforeEach(() => {
          mockCourseModel = {
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn()
          };
      
          service = new CoursesService(mockCourseModel);
        });
      
        it('should update a course successfully', async () => {
          const id = '123';
          const updateCourseDto: UpdateCourseDto = {
            courseId: 6789,
            name: 'Updated Name',
          };
      
          const updatedCourseData = {
            _id: id,
            courseId: updateCourseDto.courseId,
            name: updateCourseDto.name
          };
      
          // courseId not taken by another course
          mockCourseModel.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
          });
      
          // successful update
          mockCourseModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(updatedCourseData)
          });
      
          const result = await service.update(id, updateCourseDto);
      
          expect(mockCourseModel.findOne).toHaveBeenCalledWith({
            courseId: updateCourseDto.courseId,
            _id: { $ne: id }
          });
          expect(mockCourseModel.findByIdAndUpdate).toHaveBeenCalledWith(
            id,
            updateCourseDto,
            { new: true }
          );
          expect(result).toEqual({
            status: true,
            message: 'Course updated successfully',
            data: {
              _id: id,
              courseId: updateCourseDto.courseId,
              name: updateCourseDto.name
            }
          });
        });
      
        it('should throw BadRequestException if another course with same courseId exists', async () => {
          const id = '123';
          const updateCourseDto: UpdateCourseDto = {
            courseId: 6789,
            name: 'Updated Name'
          };
      
          // courseId already exists in another course
          mockCourseModel.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue({ _id: '456' })
          });
      
          await expect(service.update(id, updateCourseDto))
            .rejects
            .toThrow(BadRequestException);
      
          await expect(service.update(id, updateCourseDto))
            .rejects
            .toThrow('Another course with this courseId already exists.');
        });
      
        it('should throw NotFoundException if course not found for update', async () => {
          const id = '123';
          const updateCourseDto: UpdateCourseDto = {
            courseId: 6789,
            name: 'Updated Name'
          };
      
          // no course with same courseId
          mockCourseModel.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
          });
      
          // no course found to update
          mockCourseModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
          });
      
          await expect(service.update(id, updateCourseDto))
            .rejects
            .toThrow(NotFoundException);
      
          await expect(service.update(id, updateCourseDto))
            .rejects
            .toThrow(`Course with ID "${id}" not found for update.`);
        });
      });
      
    
      describe('delete', () => {
        it('should delete a course successfully', async () => {
          // Arrange
          const courseId = '507f1f77bcf86cd799439011';
    
          mockCourseModel.findByIdAndDelete.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCourseData)
          });
    
          // Act
          const result = await service.delete(courseId);
    
          // Assert
          expect(mockCourseModel.findByIdAndDelete).toHaveBeenCalledWith(courseId);
          expect(result).toEqual({
            status: true,
            message: 'Course deleted successfully.'
          });
        });
    
        it('should throw NotFoundException when course to delete not found', async () => {
          // Arrange
          const courseId = '507f1f77bcf86cd799439011';
    
          mockCourseModel.findByIdAndDelete.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
          });
    
          // Act & Assert
          await expect(service.delete(courseId)).rejects.toThrow(NotFoundException);
          await expect(service.delete(courseId)).rejects.toThrow(`Course with ID "${courseId}" not found for deletion.`);
        });
      });
    
      describe('Service Integration', () => {
        it('should be defined', () => {
          expect(service).toBeDefined();
        });
    
        it('should have courseModel injected', () => {
          expect(model).toBeDefined();
        });
      });
    


})