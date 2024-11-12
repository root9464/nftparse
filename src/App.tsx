/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { TonConnectButton } from '@tonconnect/ui-react';
import axios from 'axios';
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

export default function App() {
  //'UQByKjIwjkKksvJGAGTI5cJqR74FGLjTUpo99Q1exkr16Ajj';
  const addressCollection = 'EQD-nUBThaesec5tw3UP2w9lwAyHhGuuHkI2Ecntr_OCTIES';
  const address = 'UQByKjIwjkKksvJGAGTI5cJqR74FGLjTUpo99Q1exkr16Ajj';

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

      <div className='images'>
        {data !== undefined ? (
          <>
            {data.map((nft) => (
              <img src={nft.metadata.image} alt='nft' key={nft.index} />
            ))}
          </>
        ) : (
          <p>no nfts or not connect wallet</p>
        )}
      </div>
    </div>
  );
}
