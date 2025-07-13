export const createStudentResponseSchema = {
    200: {
        status: 200,
        description: "Student successfully created.",
        schema: {
            example: {
                success: true,
                data: {
                    enrollmentNumber: 12345,
                    fullname: "John Doe",
                    dateofbirth: "2000-01-01",
                    enrollmentCourse: "Course ID",
                    description: "Student description",
                    picture: "https://example.com/picture.jpg",
                    status: "ACTIVE",
                    createdAt: "2025-07-13T00:00:00.000Z",
                    updatedAt: "2025-07-13T00:00:00.000Z"
                }
            }
        }
    },
    401: {
        status: 401,
        description: "Authorization failed",
        schema: {
            example: {
                message: "Unauthorized",
                code: "UNAUTHORIZED"
            }
        }
    }
};

export const updateStudentResponseSchema = {
    200: {
        status: 200,
        description: "Student successfully updated.",
        schema: {
            example: {
                success: true,
                data: {
                    enrollmentNumber: 12345,
                    fullname: "John Doe Updated",
                    dateofbirth: "2000-01-01",
                    enrollmentCourse: "Updated Course ID",
                    description: "Updated student description",
                    picture: "https://example.com/updated-picture.jpg",
                    status: "SUSPENDED",
                    createdAt: "2025-07-13T00:00:00.000Z",
                    updatedAt: "2025-07-14T00:00:00.000Z"
                }
            }
        }
    },
    401: {
        status: 401,
        description: "Authorization failed",
        schema: {
            example: {
                message: "Unauthorized",
                code: "UNAUTHORIZED"
            }
        }
    },
    404: {
        status: 404,
        description: "Student not found",
        schema: {
            example: {
                message: "Student not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const deleteStudentResponseSchema = {
    200: {
        status: 200,
        description: "Student successfully deleted.",
        schema: {
            example: {
                success: true,
                message: "Student deleted successfully."
            }
        }
    },
    401: {
        status: 401,
        description: "Authorization failed",
        schema: {
            example: {
                message: "Unauthorized",
                code: "UNAUTHORIZED"
            }
        }
    },
    404: {
        status: 404,
        description: "Student not found",
        schema: {
            example: {
                message: "Student not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const getStudentResponseSchema = {
    200: {
        status: 200,
        description: "Student successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: {
                    enrollmentNumber: 12345,
                    fullname: "John Doe",
                    dateofbirth: "2000-01-01",
                    enrollmentCourse: "Course ID",
                    description: "Student description",
                    picture: "https://example.com/picture.jpg",
                    status: "ACTIVE",
                    createdAt: "2025-07-13T00:00:00.000Z",
                    updatedAt: "2025-07-13T00:00:00.000Z"
                }
            }
        }
    },
    401: {
        status: 401,
        description: "Authorization failed",
        schema: {
            example: {
                message: "Unauthorized",
                code: "UNAUTHORIZED"
            }
        }
    },
    404: {
        status: 404,
        description: "Student not found",
        schema: {
            example: {
                message: "Student not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const getAllStudentsResponseSchema = {
    200: {
        status: 200,
        description: "Students successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: [
                    {
                        enrollmentNumber: 12345,
                        fullname: "John Doe",
                        dateofbirth: "2000-01-01",
                        enrollmentCourse: "Course ID",
                        description: "Student description",
                        picture: "https://example.com/picture.jpg",
                        status: "ACTIVE",
                        createdAt: "2025-07-13T00:00:00.000Z",
                        updatedAt: "2025-07-13T00:00:00.000Z"
                    },
                    {
                        enrollmentNumber: 67890,
                        fullname: "Jane Doe",
                        dateofbirth: "1999-05-15",
                        enrollmentCourse: "Another Course ID",
                        description: "Another student description",
                        picture: "https://example.com/another-picture.jpg",
                        status: "SUSPENDED",
                        createdAt: "2025-07-12T00:00:00.000Z",
                        updatedAt: "2025-07-13T00:00:00.000Z"
                    }
                ]
            }
        }
    },
    401: {
        status: 401,
        description: "Authorization failed",
        schema: {
            example: {
                message: "Unauthorized",
                code: "UNAUTHORIZED"
            }
        }
    }
};