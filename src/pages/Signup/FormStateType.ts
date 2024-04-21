export interface IFormStateType {
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: string;
}

export interface IFormStateTypeError {
  fname?: string;
  lname?: string;
  email?: string;
  password?: string;
  role?: string;
}
