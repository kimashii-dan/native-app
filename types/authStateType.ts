import UserType from "./userType";

export default interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
}
