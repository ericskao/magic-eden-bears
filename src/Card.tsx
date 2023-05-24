import { MintInterface } from "./App";
import solSvg from "./assets/sol.png";
import "./Card.css";

const Card = ({ nft }: { nft: MintInterface }) => {
  return (
    <a
      href={`https://magiceden.io/item-details/${nft.mintAddress}`}
      target="_blank"
    >
      <div className="nft-card">
        <img className="nft-image" alt={nft.title} src={nft.img} />
        <div className="nft-info">
          <div>{nft.title}</div>
          <div className="nft-price">
            {nft.price} <img className="nft-sol" src={solSvg} alt="SOL-icon" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default Card;
