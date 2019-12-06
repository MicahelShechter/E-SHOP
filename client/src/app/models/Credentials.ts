import { User } from './User';

export interface Credentials {
  // Register Credentials
  idNumber: string;
  email: string;
  password: string;
  password2: string;
  userChecked: boolean;

  // Login Credentials
  success: boolean;
  token: string;
  user: User;
  admin: User;
}
