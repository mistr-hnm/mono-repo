export const createPermissionResponseSchema = {
    200: {
        status: 200,
        description: "Permission successfully created.",
        schema: {
            example: {
                success: true,
                data: {
                    id: "12345",
                    module: "User Management",
                    permission: ["CREATE_USER", "DELETE_USER", "UPDATE_USER"],
                    description: "Permissions for managing users.",
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

export const updatePermissionResponseSchema = {
    200: {
        status: 200,
        description: "Permission successfully updated.",
        schema: {
            example: {
                success: true,
                data: {
                    id: "12345",
                    module: "User Management",
                    permission: ["CREATE_USER", "DELETE_USER", "UPDATE_USER"],
                    description: "Updated permissions for managing users.",
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
        description: "Permission not found",
        schema: {
            example: {
                message: "Permission not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const deletePermissionResponseSchema = {
    200: {
        status: 200,
        description: "Permission successfully deleted.",
        schema: {
            example: {
                success: true,
                message: "Permission deleted successfully."
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
        description: "Permission not found",
        schema: {
            example: {
                message: "Permission not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const getPermissionResponseSchema = {
    200: {
        status: 200,
        description: "Permission successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: {
                    id: "12345",
                    module: "User Management",
                    permission: ["CREATE_USER", "DELETE_USER", "UPDATE_USER"],
                    description: "Permissions for managing users.",
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
        description: "Permission not found",
        schema: {
            example: {
                message: "Permission not found",
                code: "NOT_FOUND"
            }
        }
    }
};

export const getAllPermissionsResponseSchema = {
    200: {
        status: 200,
        description: "Permissions successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: "12345",
                        module: "User Management",
                        permission: ["CREATE_USER", "DELETE_USER", "UPDATE_USER"],
                        description: "Permissions for managing users.",
                        createdAt: "2025-07-13T00:00:00.000Z",
                        updatedAt: "2025-07-13T00:00:00.000Z"
                    },
                    {
                        id: "67890",
                        module: "Course Management",
                        permission: ["CREATE_COURSE", "DELETE_COURSE", "UPDATE_COURSE"],
                        description: "Permissions for managing courses.",
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