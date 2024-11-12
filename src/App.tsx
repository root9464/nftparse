/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries, useQuery } from '@tanstack/react-query';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import axios from 'axios';
import { FC } from 'react';
import './App.css';

type NFTItem = {
  address: string; // адрес NFT
  index: number;
  owner: Owner; // адрес владельца
  collection: Collection;
  verified: boolean;
  metadata: Metadata;
  previews: Preview[];
  approved_by: any[]; // я хз че тут может лежать
  trust: string;
};

type Owner = {
  address: string;
  is_scam: boolean;
  is_wallet: boolean;
};

type Collection = {
  address: string; // адрес коллекции
  name: string; // название коллекции
  description: string;
};

type Metadata = {
  name: string;
  image: string;
  attributes: Attribute[];
  content_url: string;
  description: string;
};

type Attribute = {
  trait_type: string;
  value: string;
};

type Preview = {
  resolution: string;
  url: string;
};

type NFTResponse = {
  nft_items: NFTItem[];
};

const axiosInstance = axios.create({
  baseURL: 'https://tonapi.io/v2',
});

type Bounceable = {
  b64: string;
  b64url: string;
};

type NonBounceable = {
  b64: string;
  b64url: string;
};

type ParsedAdressHex = {
  raw_form: string;
  bounceable: Bounceable;
  non_bounceable: NonBounceable;
  given_type: string;
  test_only: boolean;
};

export default function App() {
  //'UQByKjIwjkKksvJGAGTI5cJqR74FGLjTUpo99Q1exkr16Ajj'; адресс у кого есть NFT
  const addressCollection = 'EQD-nUBThaesec5tw3UP2w9lwAyHhGuuHkI2Ecntr_OCTIES';
  const address = useTonAddress();

  function checkNftsOnAccount() {
    console.log('запрос на актуальность ушел');

    return axiosInstance.get<NFTResponse>(`/accounts/${address}/nfts?collection=${addressCollection}&offset=0&indirect_ownership=false`);
  }

  const { data } = useQuery({
    queryKey: ['data_nft'],
    queryFn: checkNftsOnAccount,
    enabled: !!address,
    refetchInterval: 1000 * 10,
    select: ({ data }) => data.nft_items,
  });

  async function fetchParsedAddress(address: string) {
    const { data } = await axiosInstance.get<ParsedAdressHex>(`/address/${address}/parse`);
    return data;
  }

  const addressQueries = useQueries({
    queries:
      data?.map((nft) => ({
        queryKey: ['parse_address', nft.address],
        queryFn: () => fetchParsedAddress(nft.address),
        enabled: !!nft.address,
      })) || [],
  });
  //**** получить дату из кеша (доступно на любом уровне dom дерева)
  // const data2 = useQueryClient();
  // console.log(data2.getQueryData(['data_nft']), 'ffffff');

  //*****  Статический способ
  // const [nftsUser, setNftsUser] = useState<NFTItem[]>([]);

  // const checkNftsOnAccount = () => {
  //   if (address) {
  //     axiosInstance
  //       .get<NFTResponse>(`/accounts/${address}/nfts?collection=${addressCollection}&offset=0&indirect_ownership=false`)
  //       .then((response) => {
  //         setNftsUser(response.data.nft_items);
  //         console.log(response.data.nft_items);
  //       });
  //   }
  // };

  return (
    <div className='App'>
      <TonConnectButton />

      {/******  Статический способ */}
      {/* <div className='images'>
        {' '}
        {nftsUser.length > 0 ? (
          nftsUser.map((nft) => <img src={nft.metadata.image} alt='nft' key={nft.index} />)
        ) : (
          <p>no nfts or not connect wallet</p>
        )}
      </div> 
      <button onClick={checkNftsOnAccount}>сканировать</button> */}

      {/*****  Динамический способ */}
      <div className='images'>
        {data?.length ? (
          data.map((nft, index) => <NFTDisplay key={nft.index} nft={nft} parsedAddress={addressQueries[index]?.data} />)
        ) : (
          <p>{data ? 'no nfts' : 'no nfts or not connected wallet'}</p>
        )}
      </div>
    </div>
  );
}

type NFTDisplayProps = {
  nft: NFTItem;
  parsedAddress: ParsedAdressHex | undefined;
};

const NFTDisplay: FC<NFTDisplayProps> = ({ nft, parsedAddress }) => {
  return (
    <div className='nft-item' key={nft.index}>
      <img src={nft.metadata.image} alt={nft.metadata.name} className='nft-image' />
      <h3 className='nft-collection-name'>{nft.collection.name}</h3>
      {parsedAddress && (
        <div className='parsed-address'>
          <p>Parsed Address:</p>
          <p>{parsedAddress.bounceable.b64url}</p>
        </div>
      )}
    </div>
  );
};
