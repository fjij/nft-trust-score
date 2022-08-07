import {
  gql,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client/core";
import fetch from "cross-fetch";

const GET_TOKENS = gql`
  query Tokens($collectionAddress: String!, $after: String) {
    tokens(
      where: { collectionAddresses: [$collectionAddress] }
      pagination: { after: $after, limit: 500 }
    ) {
      nodes {
        token {
          owner
          mintInfo {
            originatorAddress
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export interface Token {
  owner: string;
  mintInfo: {
    originatorAddress: string;
  };
}

const GET_COLLECTION = gql`
  query Collection($collectionAddress: String!) {
    collections(where: { collectionAddresses: [$collectionAddress] }) {
      nodes {
        address
        name
        symbol
        totalSupply
      }
    }
  }
`;

export interface Collection {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
}

export class ZoraClient {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  constructor() {
    this.apolloClient = new ApolloClient({
      link: new HttpLink({ uri: "https://api.zora.co/graphql", fetch }),
      cache: new InMemoryCache(),
    });
  }
  async getTokens(
    collectionAddress: string,
    onProgress: ((currentCount: number) => void) | null = null
  ): Promise<Token[]> {
    const tokens: Token[] = [];
    let pageInfo: { endCursor: string; hasNextPage: boolean } | null = null;
    while (!pageInfo || pageInfo.hasNextPage) {
      const after = pageInfo?.endCursor as string | null | undefined;
      const { data } = await this.apolloClient.query({
        query: GET_TOKENS,
        variables: { collectionAddress, after },
      });
      tokens.push(
        ...data.tokens.nodes.map(({ token }: { token: Token }) => token)
      );
      pageInfo = data.tokens.pageInfo;
      if (onProgress) {
        onProgress(tokens.length);
      }
    }
    return tokens;
  }

  async getCollection(collectionAddress: string): Promise<Collection> {
    const { data } = await this.apolloClient.query({
      query: GET_COLLECTION,
      variables: { collectionAddress },
    });
    return data.collections.nodes[0];
  }
}
