export const createCourseResponseSchema = {
    200: {
        status: 200,
        description: "Course successfully created.",
        schema: {
            example: {
                success: true,
                data: {
                    id: "12345",
                    courseId: 101,
                    name: "Mathematics",
                    description: "A course about advanced mathematics.",
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

export const updateCourseResponseSchema = {
    200: {
        status: 200,
        description: "Course successfully updated.",
        schema: {
            example: {
                success: true,
                data: {
                    id: "12345",
                    courseId: 101,
                    name: "Advanced Mathematics",
                    description: "Updated course description.",
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
        description: "Course not found",
        schema: {
            example: {
                message: "Course not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const deleteCourseResponseSchema = {
    200: {
        status: 200,
        description: "Course successfully deleted.",
        schema: {
            example: {
                success: true,
                message: "Course deleted successfully."
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
        description: "Course not found",
        schema: {
            example: {
                message: "Course not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const getCourseResponseSchema = {
    200: {
        status: 200,
        description: "Course successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: {
                    id: "12345",
                    courseId: 101,
                    name: "Mathematics",
                    description: "A course about advanced mathematics.",
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
        description: "Course not found",
        schema: {
            example: {
                message: "Course not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const getAllCoursesResponseSchema = {
    200: {
        status: 200,
        description: "Courses successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: "12345",
                        courseId: 101,
                        name: "Mathematics",
                        description: "A course about advanced mathematics.",
                        createdAt: "2025-07-13T00:00:00.000Z",
                        updatedAt: "2025-07-13T00:00:00.000Z"
                    },
                    {
                        id: "67890",
                        courseId: 102,
                        name: "Physics",
                        description: "A course about advanced physics.",
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