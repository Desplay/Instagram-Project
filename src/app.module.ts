import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { MongooseModule } from './modules/system/mongoose/mongoose.module';
import { GraphqlModule } from './modules/system/graphql/graphql.module';

@Module({
  imports: [UsersModule, AuthModule, ProfilesModule, MongooseModule, GraphqlModule],
  providers: [AppService],
})
export class AppModule {}
