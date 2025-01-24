export enum Role {
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
  CONSUMER = "CONSUMER",
}

export interface User {
  id: number;
  username: string;
  car_make?: string;
  car_model?: string;
  car_year?: string;
  car_mileage?: string;
  email?: string;
  role: Role;
  accessToken?: string;
  phone?: string;
  address?: string;
  device_id?: string;
}
