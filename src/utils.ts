import { Numbers, Web3 } from "web3";

export const formatUsd = (val: Numbers, currency = "", decimals= 6, toDecimals = 2) => parseFloat(Web3.utils.fromWei(val, decimals)).toFixed(toDecimals) + " " + currency;

export const getImage = (imageurl : string | undefined | null) => imageurl?.startsWith("https://") ? imageurl : "/mega.avif" 