export const createStudentValidator = {
    type: 'object',
    required: ["enrollmentNumber", "fullname", "dateofbirth", "enrollmentCourse", "status"],
    properties: {
        enrollmentNumber: {
            type: "number",
            description: "The enrollment number of the student.",
            example: 12345
        },
        fullname: {
            type: "string",
            description: "The full name of the student.",
            example: "John Doe"
        },
        dateofbirth: {
            type: "string",
            format: "date",
            description: "The date of birth of the student.",
            example: "2000-01-01"
        },
        enrollmentCourse: {
            type: "string",
            description: "The ID of the course the student is enrolled in.",
            example: "Course ID"
        },
        description: {
            type: "string",
            description: "Additional description about the student.",
            example: "Student description"
        },
        picture: {
            type: "string",
            description: "URL of the student's picture.",
            example: "https://example.com/picture.jpg"
        },
        status: {
            type: "string",
            enum: ["ACTIVE", "SUSPENDED"],
            description: "The status of the student.",
            example: "ACTIVE"
        }
    }
};

export const updateStudentValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the student.",
            example: "12345"
        },
        enrollmentNumber: {
            type: "number",
            description: "The enrollment number of the student.",
            example: 12345
        },
        fullname: {
            type: "string",
            description: "The full name of the student.",
            example: "John Doe Updated"
        },
        dateofbirth: {
            type: "string",
            format: "date",
            description: "The date of birth of the student.",
            example: "2000-01-01"
        },
        enrollmentCourse: {
            type: "string",
            description: "The ID of the course the student is enrolled in.",
            example: "Updated Course ID"
        },
        description: {
            type: "string",
            description: "Additional description about the student.",
            example: "Updated student description"
        },
        picture: {
            type: "string",
            description: "URL of the student's picture.",
            example: "https://example.com/updated-picture.jpg"
        },
        status: {
            type: "string",
            enum: ["ACTIVE", "SUSPENDED"],
            description: "The status of the student.",
            example: "SUSPENDED"
        }
    }
};

export const deleteStudentValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the student.",
            example: "12345"
        }
    }
};

export const getStudentByIdValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the student.",
            example: "12345"
        }
    }
};