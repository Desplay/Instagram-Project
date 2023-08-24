import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      sortSchema: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      uploads: false,
      context: ({ req }) => ({ req }),
      introspection: true,
      playground: true,
    }),
  ],
})
export class GraphqlModule {}
