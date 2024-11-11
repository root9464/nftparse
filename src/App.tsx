/* eslint-disable @typescript-eslint/no-explicit-any */
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import axios from 'axios';
import { useState } from 'react';
import './App.css';

type NFTItem = {
  address: string;
  index: number;
  owner: Owner;
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
  address: string;
  name: string;
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

function App() {
  //'UQByKjIwjkKksvJGAGTI5cJqR74FGLjTUpo99Q1exkr16Ajj';
  const address = useTonAddress();
  const addressCollection = 'EQD-nUBThaesec5tw3UP2w9lwAyHhGuuHkI2Ecntr_OCTIES';
  const [nftsUser, setNftsUser] = useState<NFTItem[]>([]);

  const checkNftsOnAccount = () => {
    if (address) {
      axiosInstance
        .get<NFTResponse>(`/accounts/${address}/nfts?collection=${addressCollection}&offset=0&indirect_ownership=false`)
        .then((response) => {
          setNftsUser(response.data.nft_items);
        });
    }
  };

  return (
    <div className='App'>
      <TonConnectButton />
      <div className='images'>
        {' '}
        {nftsUser.length > 0 ? (
          nftsUser.map((nft) => <img src={nft.metadata.image} alt='nft' key={nft.index} />)
        ) : (
          <p>no nfts or not connect wallet</p>
        )}
      </div>
      <button onClick={checkNftsOnAccount}>сканировать</button>
    </div>
  );
}

export default App;
