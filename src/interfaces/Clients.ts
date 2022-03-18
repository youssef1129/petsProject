export interface Iclient {
  id?: number;
  userName?: string;
  FirstName?: string;
  LastName?: string;
  email?: string;
  photo?: string;
  password?: string;
  phone?:string;
  role?: 'client' | 'admin' |'superAdmin';
}
