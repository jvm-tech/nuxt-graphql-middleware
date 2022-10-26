import type { H3Event } from 'h3'
import type { FetchOptions } from 'ohmyfetch'
import { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations'

export type GraphqlMiddlewareGraphqlEndpointMethod = (
  event?: H3Event,
  operation?: string,
  operationName?: string,
) => string

export type GraphqlMiddlewareServerFetchOptionsMethod = (
  event?: H3Event,
  operation?: string,
  operationName?: string,
) => FetchOptions

export interface GraphqlMiddlewareConfig {
  /**
   * File glob patterns for the auto import feature.
   *
   * If left empty, no documents are auto imported.
   *
   * @default
   * ```json
   * ["**\/.{gql,graphql}", "!node_modules"]
   * ```
   *
   * @example
   * ```ts
   * // Load .graphql files from pages folder and from a node_modules dependency.
   * const autoImportPatterns = [
   *   './pages/**\/*.graphql',
   *   'node_modules/my_library/dist/**\/*.graphql'
   * ]
   * ```
   */
  autoImportPatterns?: string[]

  /**
   * Additional raw documents to include.
   *
   * Useful if for example you need to generate queries during build time.
   *
   * @default []
   *
   * @example
   * ```ts
   * const documents = [`
   *   query myQuery {
   *     articles {
   *       title
   *       id
   *     }
   *   }`,
   *   ...getGeneratedDocuments()
   * ]
   * ```
   */
  documents?: string[]

  /**
   * Enable detailled debugging messages.
   *
   * @default false
   */
  debug?: boolean

  /**
   * The URL of the GraphQL server.
   *
   * You can either provide a string or a method that returns a string.
   * If you provide a method it will be called everytime a GraphQL request is
   * made in the server API handler.
   *
   * @example
   * ```ts
   * function graphqlEndpoint(event, operation, operationName) {
   *   const language = getLanguageFromRequest(event)
   *   return `https://api.example.com/${language}/graphql`
   * }
   * ```
   */
  graphqlEndpoint?: string | GraphqlMiddlewareGraphqlEndpointMethod

  /**
   * The prefix for the server route.
   *
   * @default ```ts
   * "/api/graphql_middleware"
   * ```
   */
  serverApiPrefix?: string

  /**
   * Provide the options for the ohmyfetch request to the GraphQL server.
   *
   * @default undefined
   *
   * @example
   * ```ts
   * import { getHeader } from 'h3'
   *
   * // Pass the cookie from the client request to the GraphQL request.
   * function serverFetchOptions(event, operation, operationName) {
   *   return {
   *     headers: {
   *       Cookie: getHeader(event, 'cookie')
   *     }
   *   }
   * }
   * ```
   */
  serverFetchOptions?: FetchOptions | GraphqlMiddlewareServerFetchOptionsMethod

  /**
   * Download the GraphQL schema and store it in the
   *
   * @default true
   */
  downloadSchema?: boolean

  /**
   * Path to the GraphQL schema file.
   *
   * If `downloadSchema` is `true`, the downloaded schema is written to this specified path.
   * If `downloadSchema` is `false`, this file must be present in order to generate types.
   *
   * @default './schema.graphql'
   */
  schemaPath?: string

  /**
   * These options are passed to the graphql-codegen method when generating the operations types.
   *
   * {@link https://www.the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations}
   * @default
   * ```ts
   * const codegenConfig = {
   *   exportFragmentSpreadSubTypes: true,
   *   preResolveTypes: true,
   *   skipTypeNameForRoot: true,
   *   skipTypename: true,
   *   useTypeImports: true,
   *   onlyOperationTypes: true,
   *   namingConvention: {
   *     enumValues: 'change-case-all#upperCaseFirst',
   *   },
   * }
   * ```
   */
  codegenConfig?: TypeScriptDocumentsPluginConfig
}

export interface GraphqlMiddlewareState {
  fetchOptions: FetchOptions
}

export enum GraphqlMiddlewareTemplate {
  /**
   * Contains the TS definitions for all GraphQL queries, mutations and fragments.
   */
  OperationTypes = 'graphql-operations.d.ts',

  /**
   * Signature for the GraphQL composable arguments and return types.
   */
  ComposableContext = 'nuxt-graphql-middleware.d.ts',

  /**
   * Exports a single opject containing the compiled queries and mutations.
   */
  Documents = 'graphql-documents.mjs',
}