import { HttpStatus } from "@nestjs/common";
import { ApiResponse2 } from "src/news-letter/types/api-response";



export const failureHandler = (
  message: string = 'An error occurred',
  error?: any,
  statusCode: number = HttpStatus.BAD_REQUEST,
): ApiResponse2<null> => {
  return {
    // statusCode,
    message,
    error: error || null,
    statusCode,
  };
};



export const internalErrorHandler = (
  message: string = 'Internal server error',
  error?: any,
): ApiResponse2<null> => {
  return failureHandler(message, error, HttpStatus.INTERNAL_SERVER_ERROR);
};