

export const loginResponseSchema = {
    200: {
        status: 200,
        description: "Successful login.",
        schema: {
            example: {
                success: true,
                data: {
                    user: "123456789",
                    email: "jhon@yopmail.com",
                    token: "845sd4sds45d1s5dsdsds5d787s5d1sd",
                    permissions: []
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

}



export const createUserResponseSchema = {
    200: {
        status: 200,
        description: "User successfully created.",
        schema: {
            example: {
                success: true,
                data: {
                    user: "Jhon",
                    email: "jhon@yopmail.com",
                    description: ""
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

export const updateUserResponseSchema = {
    200: {
        status: 200,
        description: "User successfully updated.",
        schema: {
            example: {
                success: true,
                data: {
                    user: "Jhon",
                    email: "jhon@yopmail.com",
                    description: "Updated description"
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

export const deleteUserResponseSchema = {
    200: {
        status: 200,
        description: "User successfully deleted.",
        schema: {
            example: {
                success: true,
                message: "User deleted successfully."
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

export const getUserResponseSchema = {
    200: {
        status: 200,
        description: "User successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: {
                    user: "Jhon",
                    email: "jhon@yopmail.com",
                    description: "User description"
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

export const getAllUsersResponseSchema = {
    200: {
        status: 200,
        description: "Users successfully retrieved.",
        schema: {
            example: {
                success: true,
                data: [
                    {
                        user: "Jhon",
                        email: "jhon@yopmail.com",
                        description: "User description"
                    },
                    {
                        user: "Doe",
                        email: "doe@yopmail.com",
                        description: "Another user description"
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
