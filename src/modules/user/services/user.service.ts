import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { differenceInYears } from 'date-fns';
import got from 'got';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { ErrorCodes } from '../../common/errors/error-codes';
import { ConflictError, NotFoundError } from '../../common/errors/http.error';
import { UserDocument } from '../user.schema';
import {
  EUserVerificationStatus,
  ICreateUserDTO,
  IGetRandomUsersResult,
  IQuery,
  IUser,
  IUserAggregate,
} from '../user.type';
import { random } from 'lodash';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(payload: ICreateUserDTO): Promise<IUser> {
    const existingUser = await this.userModel.findOne({ email: payload.email });

    if (existingUser) {
      throw new ConflictError(
        ErrorCodes.USER_ALREADY_EXISTS,
        'User with email already exists',
      );
    }

    const { password, ...user } = await this.userModel.create({
      id: uuidV4(),
      ...payload,
      registered: new Date(),
    });

    return user;
  }

  async seedRandomUsers() {
    const randomUsers = await got.get<IGetRandomUsersResult>(
      'https://randomuser.me/api/',
      { searchParams: { results: 5000 }, responseType: 'json' },
    );

    await this.userModel.insertMany(
      randomUsers.body.results.map((user) => ({
        id: user.login.uuid,
        firstName: user.name.first,
        lastName: user.name.last,
        dob: user.dob.date,
        registered: user.registered.date,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        nat: user.nat,
        password: bcrypt.hashSync(user.login.password, 5),
      })),
    );
  }

  async findOne(userId: string) {
    const user = await this.userModel.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, 'User not found');
    }

    return user;
  }

  async verifyUser(email: string, password: string): Promise<IUser | false> {
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, 'User not found');
    }

    if (!bcrypt.compareSync(password, user.password as string)) {
      return false;
    }

    user.password = undefined;

    return user;
  }

  async getUserAggregations() {
    const aggregate: IUserAggregate = {
      total: 0,
      gender: {
        male: 0,
        female: 0,
        other: 0,
      },
      age: {},
      nat: {},
      verificationStatus: {},
    };

    const cursor = this.userModel.aggregate().cursor();

    for (
      let doc = (await cursor.next()) as IUser;
      doc != null;
      doc = await cursor.next()
    ) {
      aggregate.total += 1;
      aggregate.gender[doc.gender] += 1;
      aggregate.nat[doc.nat] = (aggregate.nat[doc.nat] ?? 0) + 1;
      aggregate.verificationStatus[doc.verificationStatus] =
        (aggregate.verificationStatus[doc.verificationStatus] ?? 0) + 1;

      const ageGroup =
        `${Math.floor(differenceInYears(new Date(), doc.dob) / 10) * 10}`;
      aggregate.age[ageGroup] = (aggregate.age[ageGroup] ?? 0) + 1;
    }

    return aggregate;
  }

  randomVerify(id: string) {
    const verificationStatus =
      random(1, 10) >= 5
        ? EUserVerificationStatus.VERIFIED
        : EUserVerificationStatus.REJECTED;

    setTimeout(() => {
      this.userModel.updateOne({ id }, { verificationStatus }).catch(() => {
        this.userModel.updateOne(
          { id },
          { verificationStatus: EUserVerificationStatus.UNVERIFIED },
        );
      });
    }, 10000);
  }

  async getUsers(query: IQuery): Promise<IUser[]> {
    const users = await this.userModel
      .find()
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .sort('-registered');

    return users;
  }

  async requestVerification(id: string): Promise<IUser> {
    const user = await this.userModel.findOne({ id });

    if (!user) {
      throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, 'User not found');
    }

    if (user.verificationStatus !== EUserVerificationStatus.UNVERIFIED) {
      throw new ConflictError(
        ErrorCodes.USER_ALREADY_REVIEWED,
        'User has already been reviewed',
      );
    }

    user.verificationStatus = EUserVerificationStatus.PENDING;

    await user.save();

    this.randomVerify(user.id);

    return user;
  }

  async onModuleInit() {
    console.log(Math.floor(11 / 10));
    // await this.getUserAggregations();
    // await this.seedRandomUsers();
  }
}
