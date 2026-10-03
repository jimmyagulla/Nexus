import { Module } from '@nestjs/common';
import { MockDbModule } from './mock-db/mock-db.module';
import { HelloModule } from './greeting/hello.module';

@Module({
  imports: [MockDbModule, HelloModule],
})
export class AppModule {}
