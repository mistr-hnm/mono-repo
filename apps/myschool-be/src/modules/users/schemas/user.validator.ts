export const loginValidator = {
    type: 'object',
    required: ["email", "password"],
    properties: {
        email: {
            type: "string",
            description: "The email address of the user.",
            example: process.env.EMAIL || "default@example.com"
        },
        password: {
            type: "string",
            description: "The password of the user.",
            example: process.env.PASSWORD || "defaultPassword123"
        }
    },
    example: {
        email: process.env.EMAIL || "default@example.com",
        password: process.env.PASSWORD || "defaultPassword123"
    },
}


export const createUserValidator = {
    type: 'object',
    required: ["name", "email", "password"],
    properties: {
        name: {
            type: "string",
            description: "The name of the user.",
            example: "Jhon D"
        },
        email: {
            type: "string",
            description: "The email of the user.",
            example: "default@example.com"
        },
        password: {
            type: "string",
            description: "The password of the user.",
            example: "Pass#123"
        },
        description: {
            type: "string",
            description: "The description of the user.",
            example: "Content creator"
        }
    }
};

export const updateUserValidator = {
    type: 'object',
    required: ["name"],
    properties: {
        name: {
            type: "string",
            description: "The name of the user.",
            example: "Jhon D"
        },
        email: {
            type: "string",
            description: "The email of the user.",
            example: "default@example.com"
        },
        description: {
            type: "string",
            description: "The description of the user.",
            example: "Content creator"
        }
    }
};

export const deleteUserValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the user.",
            example: "12345"
        }
    }
};

export const getUserByIdValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the user.",
            example: "12345"
        }
    }
};
