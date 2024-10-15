import { HttpException } from '@/exceptions/httpException';

export class ApiService {
  getData() {
    throw new HttpException(400, '');
  }
}
