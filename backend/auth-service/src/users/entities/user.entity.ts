import { User as PrismaUser } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User {
  id: string;
  email: string;

  @Exclude()
  password: string;

  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  sub: any;

  constructor(partial: Partial<PrismaUser>) {
    Object.assign(this, partial);
  }
}