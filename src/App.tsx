import { ChangeEvent, useEffect, useState } from "react";
import Card from "./Card.js";
import { throttle } from "./utils/throttle.js";

import "./App.css";

export interface MintInterface {
  img: string;
  title: string;
  price: string;
  id: string;
  mintAddress: string;
  collectionTitle: string;
  content: string;
}

function App() {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState<MintInterface[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const fetchNfts = async (paginationId?: number) => {
    setFetching(true);
    const response = await fetch(
      `https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?collectionSymbol=okay_bears&limit=20&offset=${
        paginationId || 0
      }`
    );
    const jsonData = await response.json();
    setFetching(false);
    return jsonData;
  };

  useEffect(() => {
    fetchNfts().then((response) => {
      setCollection(response.results);
    });
  }, []);

  useEffect(() => {
    const loadNfts = async () => {
      setFetching(true);
      fetchNfts(collection.length).then((response) =>
        setCollection([...collection, ...response.results])
      );
    };

    function handleScroll() {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      if (scrollPercentage >= 60 && !fetching) {
        loadNfts();
      }
    }

    // throttle scrolling so we only fire one request during scroll
    const throttledScroll = throttle(handleScroll);

    window.addEventListener("scroll", throttledScroll);

    // clear eventhandler on unmount
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [collection, fetching]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const filteredCollection = collection.filter((el) => {
    if (query === "") {
      // if query is empty, return all NFTs
      return true;
    } else {
      // compare normalized query to nft title
      return el.title.toLowerCase().includes(query.toLowerCase());
    }
  });
  const collectionInfo = collection[0];

  return (
    <div className="app">
      <div className="collection-header">
        {collectionInfo && (
          <div>
            <h1>{collectionInfo.collectionTitle}</h1>
            <div className="collection-options">
              <h2 className="collection-content">{collectionInfo.content}</h2>
              <input
                className="search-bar"
                type="text"
                placeholder="Search NFT title"
                value={query}
                onChange={onInputChange}
              />
            </div>
          </div>
        )}
      </div>
      <ul>
        {filteredCollection.map((nft, index) => (
          <li key={index}>
            <Card nft={nft} />
          </li>
        ))}
        {query !== "" && filteredCollection.length === 0 && (
          <div className="secondary">No matching NFTs!</div>
        )}
      </ul>
      {fetching && <div className="secondary">Loading...</div>}
    </div>
  );
}

export default App;
