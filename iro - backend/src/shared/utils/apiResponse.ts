export interface ApiResponse<T> {
  success: boolean;
  status: "success" | "fail" | "error";
  message: string;
  data: T | null;
}

export const successResponse = <T>(
  message: string,
  data: T | null = null,
): ApiResponse<T> => ({
  success: true,
  status: "success",
  message,
  data,
});
