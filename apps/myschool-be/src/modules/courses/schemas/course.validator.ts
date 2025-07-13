export const createCourseValidator = {
    type: 'object',
    required: ["courseId", "name"],
    properties: {
        courseId: {
            type: "number",
            description: "The unique identifier for the course.",
            example: 101
        },
        name: {
            type: "string",
            description: "The name of the course.",
            example: "Mathematics"
        },
        description: {
            type: "string",
            description: "Additional description about the course.",
            example: "A course about advanced mathematics."
        }
    }
};

export const updateCourseValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the course.",
            example: "12345"
        },
        courseId: {
            type: "number",
            description: "The unique identifier for the course.",
            example: 101
        },
        name: {
            type: "string",
            description: "The name of the course.",
            example: "Advanced Mathematics"
        },
        description: {
            type: "string",
            description: "Updated description about the course.",
            example: "Updated course description."
        }
    }
};

export const deleteCourseValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the course.",
            example: "12345"
        }
    }
};

export const getCourseByIdValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the course.",
            example: "12345"
        }
    }
};