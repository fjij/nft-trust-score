import { intersection } from "set-operations";
import { Collection, Token, ZoraClient } from "./queries";
export { Collection, Token } from "./queries";

export interface CollectionDataset {
  collection: Collection;
  tokens: Token[];
}

export async function getCollectionDataset(
  collectionAddress: string,
  log = false
): Promise<CollectionDataset> {
  const client = new ZoraClient();
  const collection = await client.getCollection(collectionAddress);
  if (log) {
    console.log(
      `Fetching ${collection.symbol} tokens (0/${collection.totalSupply})`
    );
  }
  const tokens = await client.getTokens(collectionAddress, (n) => {
    if (log) {
      console.log(
        `Fetching ${collection.symbol} tokens (${n}/${collection.totalSupply})`
      );
    }
  });
  return { collection, tokens };
}

export interface TrustScore {
  mutualOwnerCount: number;
  mutualOriginatorCount: number;
  mutualOwnerOriginatorCount: number;
}

export function computeTrustScore(
  datasetA: CollectionDataset,
  datasetB: CollectionDataset
): TrustScore {
  const [ownersA, ownersB] = [datasetA, datasetB].map((data) =>
    data.tokens.map(({ owner }) => owner)
  );
  const mutualOwners = intersection(ownersA, ownersB);

  const [originatorsA, originatorsB] = [datasetA, datasetB].map((data) =>
    data.tokens.map(({ mintInfo: { originatorAddress } }) => originatorAddress)
  );
  const mutualOriginators = intersection(originatorsA, originatorsB);

  const ownerOriginatorsA = Array.from(intersection(ownersA, originatorsA));
  const ownerOriginatorsB = Array.from(intersection(ownersB, originatorsB));
  const mutualOwnerOriginators = intersection(
    ownerOriginatorsA,
    ownerOriginatorsB
  );

  return {
    mutualOwnerCount: mutualOwners.size,
    mutualOriginatorCount: mutualOriginators.size,
    mutualOwnerOriginatorCount: mutualOwnerOriginators.size,
  };
}
