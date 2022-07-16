// import { isDevMode, isProdMode } from '/@/utils/env';

const BOOK = {
  dev: {
    chainID: 97,
  },
  prod: {
    chainID: 56,
  },
};

function isDevMode() {
  return true;
}

export function getChainScanURL(chainID) {
  let rt = '';
  switch (chainID) {
    case 56:
      rt = 'https://bscscan.com/';
      break;
    case 97:
      rt = 'https://testnet.bscscan.com/';
      break;
  }
  return rt;
}

export function getChainTxURL(chainID, hash: string) {
  return getChainScanURL(chainID) + 'tx/' + hash;
}

export function getTxURL(hash: string) {
  const bookObj = isDevMode() ? BOOK.dev : BOOK.prod;
  return getChainTxURL(bookObj.chainID, hash);
}

function getChainAddressURL(chainID, addr: string) {
  return getChainScanURL(chainID) + 'address/' + addr;
}

export function getAddressURL(hash: string) {
  const bookObj = isDevMode() ? BOOK.dev : BOOK.prod;
  return getChainAddressURL(bookObj.chainID, hash);
}
