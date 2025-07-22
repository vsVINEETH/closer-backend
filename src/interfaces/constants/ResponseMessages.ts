export enum ResponseMessages {
    FAILED_TO_UPDATE = 'Failed to update',
    FAILED_TO_CREATE = 'Failed to create',
    FAILED_TO_DELETE = 'Failed to delete',
    FAILED_TO_VERIFY_OTP = 'Faild to verify OTP',
    FAILED_TO_SHARE_OTP = 'Failed to share OTP',
    FAILED_TO_CREATE_ORDER = 'Failed to create order',
    FAILED_TO_UPLOAD = 'Failed to upload',
    FAILED_TO_GET_LOCATION = 'Failed to get location',

    FILE_UPLOADED_SUCCESSFULLY = 'File uploaded successfully',
    ACCOUNT_CREATED_SUCCESSFULLY = 'Account created successfully',
    CREATED_SUCCESSFULLY = 'Created successfully',
    UPDATED_SUCCESSFULLY = 'Upated succeceefully',
    DELETED_SUCCESSFULLY = 'Deleted successfull',
    CREDENTIAL_UPDATED_SUCCESSFULLY = 'Credential updated successfully',

    OTP_SHARED_SUCCESSFULLY = 'Succefully OTP shared to your email',
    OTP_VERIFIED_SUCCESSFULLY = 'OTP verified successfully',
 
    INVALID_CREDENTIALS = 'Invalid credentials',
    INVALID_ID = "Invalid ID provided",

    RESOURCE_NOT_FOUND = 'Failed to find the resource',
    NO_CONTENT_OR_DATA = 'No content or data',
    USER_NOT_FOUND = 'User not found',
    ENTRY_RESTRICTED = 'User entry restricted',
    UNAUTHORIZED_ACTION = "Unauthorized action",
    EXISTING_RESOURCE = 'Existing resource',
 
    LOGGED_OUT = 'Successfully logged out',

    ID_ALREADY_TAKEN = 'This ID already taken',
    INTERNAL_ERROR = "Something went wrong",

    INTERNAL_SERVER_ERROR =  "Internal Server Error",
    INSUFFICIENT_ROLE_PRIVILEGE= "Forbidden: Insufficient role privileges",
    INVALID_TOKEN_PAYLOAD = "Invalid token payload",
    INVALID_REFRESH_TOKEN = "Invalid refresh token payload",
    INVALID_OR_EXPIRED_TOKEN = "Invalid or expired token, please login again",
    
    PAYMENT_IN_PROGRESS = 'Payment in progress',
    PAYMENT_REQUEST_DENEID = 'Payment request deneid',
    INVALID_PAYMENT_SIGNATURE = 'Invalid payment signature',
    INSUFFICIENT_BALANCE = 'Insufficient balance',
    FALIED_TO_ABORT_PAYMENT = 'Failed to abort the payment',
    PAYMENT_ABORTED = 'Payment cancelled',
    SUCCESSFULLY_MATCHED = 'Successfully mathced',
    FAILED_TO_MATCH = 'Failed to match',
    UNMATCHED_SUCCESSFULLY = 'Unmatched successfully',
    FAILED_TO_UNMATCH = 'Failed to unmatch'

}
