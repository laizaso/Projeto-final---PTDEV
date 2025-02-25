import { NestFactory } from '@nestjs/core';
import { RoomsModule } from './rooms/rooms.module';

async function bootstrap() {
  const app = await NestFactory.create(RoomsModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
