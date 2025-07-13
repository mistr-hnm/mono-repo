export const createPermissionValidator = {
    type: 'object',
    required: ["module", "permission"],
    properties: {
        module: {
            type: "string",
            description: "The name of the module for which the permission is defined.",
            example: "User Management"
        },
        permission: {
            type: "array",
            items: {
                type: "string",
                description: "A specific permission for the module.",
                example: "CREATE_USER"
            },
            description: "List of permissions for the module.",
            example: ["CREATE_USER", "DELETE_USER", "UPDATE_USER"]
        },
        description: {
            type: "string",
            description: "Additional description about the permission.",
            example: "Permissions for managing users."
        }
    }
};

export const updatePermissionValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the permission.",
            example: "12345"
        },
        module: {
            type: "string",
            description: "The name of the module for which the permission is defined.",
            example: "User Management"
        },
        permission: {
            type: "array",
            items: {
                type: "string",
                description: "A specific permission for the module.",
                example: "CREATE_USER"
            },
            description: "List of permissions for the module.",
            example: ["CREATE_USER", "DELETE_USER", "UPDATE_USER"]
        },
        description: {
            type: "string",
            description: "Additional description about the permission.",
            example: "Updated permissions for managing users."
        }
    }
};

export const deletePermissionValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the permission.",
            example: "12345"
        }
    }
};

export const getPermissionByIdValidator = {
    type: 'object',
    required: ["id"],
    properties: {
        id: {
            type: "string",
            description: "The unique identifier of the permission.",
            example: "12345"
        }
    }
};