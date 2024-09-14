class ApiError extends Error {
  public statusCode: number;
  public data: any;
  public success: boolean;
  public errors: string[];
  public message!: string;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message); // Call the parent class constructor (Error)

    this.statusCode = statusCode;
    this.data = null;  // Initialize data as null or you can pass data via constructor if needed
    this.success = false;  // In case of an error, success should be false
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
