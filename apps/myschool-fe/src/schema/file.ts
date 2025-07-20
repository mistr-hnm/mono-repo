
export interface FileDetails {
    _id: string;
    filename: string;
    url: string;
    key: string;
}


export interface FileUploadResponse {
    status: boolean;
    message: string;
    data: FileDetails;
}

