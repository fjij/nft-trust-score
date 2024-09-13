# NFT Trust Score

Find out how trustworthy an NFT project is relative to another.

[Try out the live demo!](https://ipfs.io/ipfs/QmVY7NRLwxGhKSHSJnRgSiPqz8B3QEhQEjp7ZorfPWPKd8/)

[View the demo source.](https://github.com/fjij/nft-trust-score-demo)

## Usage

```ts
import { getCollectionDataset, computeTrustScore } from "nft-trust-score";

const Blitmap = "0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63";
const Monarchs = "0xc729Ce9bF1030fbb639849a96fA8BBD013680B64";

const BlitmapData = await getCollectionDataset(Blitmap);
const MonarchsData = await getCollectionDataset(Monarchs);

const trustScore = computeTrustScore(BlitmapData, MonarchsData);
// {
//   mutualOwnerCount: 37,
//   mutualOriginatorCount: 33,
//   mutualOwnerOriginatorCount: 13
// }
```

## API

### getCollectionDataset(collectionAddress: string, log = false)

- Get the dataset for the collection with the specified contract address. Log
  progress if `log` is `true`.

### computeTrustScore(datasetA, datasetB)

- Compute the trust score between two datasets

## Types

### TrustScore

- **mutualOwnerCount:** The number of mutual token owners between two
  collections.
- **mutualOriginatorCount:** The number of mutual token originators (account
  that initiated the mint of a token) between two collections.
- **mutualOwnerOriginatorCount:** The number of mutual accounts that are both
  owners and originators in both collections.
