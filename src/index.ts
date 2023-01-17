import crypto from "crypto";

interface BlockShape {
  hash: string;
  prevHash: string; // 이전해쉬값
  height: number; // 블록의 위치
  data: string;
}
class Block implements BlockShape {
  public hash: string;
  constructor(
    public prevHash: string,
    public height: number,
    public data: string
  ) {
    this.hash = Block.calculateHash(prevHash, height, data);
  }
  static calculateHash(prevHash: string, height: number, data: string) {
    const toHash = `${prevHash}${height}${data}`;
    return crypto.createHash("sha256").update(toHash).digest("hex");
  }
}

const blockChain = new Block('hey',1,'initBlock');
console.log(blockChain.hash);