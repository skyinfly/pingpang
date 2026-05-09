import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { loadLocalEnvFile } from '../env/load-local-env';

loadLocalEnvFile();

@Injectable()
export class PrismaService extends PrismaClient {}
