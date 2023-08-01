import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
@Module({
  imports: [
    GraphQLModule.forRoot({
      csrf: false,
      sortSchema: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      uploads: false,
      context: ({ req }) => ({ req }),
      introspection: true,
    }),
  ],
})
export class GraphqlModule {}
