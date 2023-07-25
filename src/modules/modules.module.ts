import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SystemsModule } from './systems/systems.module';
import { PostsModule } from './posts/posts.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [UsersModule, ProfilesModule, SystemsModule, PostsModule, FollowsModule],
})
export class ServicesModule {}
