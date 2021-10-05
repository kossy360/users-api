export type TUserGender = 'male' | 'female';

export enum EUserVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface IUser {
  id: string;
  gender: TUserGender;
  firstName: string;
  lastName: string;
  dob: Date;
  registered: Date;
  phone: string;
  email: string;
  password?: string;
  nat: string;
  verificationStatus: EUserVerificationStatus;
}

export interface ICreateUserDTO {
  gender: TUserGender;
  firstName: string;
  lastName: string;
  dob: Date;
  phone: string;
  email: string;
  password: string;
  nat: string;
}

export interface IRandomUser {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
  dob: {
    date: Date;
    age: number;
  };
  registered: {
    date: Date;
    age: number;
  };
  phone: string;
  cell: string;
  id: {
    name: string;
    value: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

export interface IGetRandomUsersResult {
  results: IRandomUser[];
}

export interface IQuery {
  page: number;
  limit: number;
}

export interface IUserAggregate {
  total: number;
  gender: {
    male: number;
    female: number;
    other: number;
  };
  age: Record<string, number>;
  nat: Record<string, number>;
  verificationStatus: Record<string, number>;
}
