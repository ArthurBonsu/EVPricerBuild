import { ethers } from 'ethers';
const hre = require("hardhat");
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';

import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk';
import { Signer } from "ethers";
import { JsonRpcProvider } from '@ethersproject/providers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

let newSafeAddress: string;
let owners: string[];

export const createSafe = async (threshold: number, extrauseraddreess?: string[]) => {
    const web3Provider = window.ethereum;
    const provider = new ethers.providers.Web3Provider(web3Provider);
    owners = await provider.listAccounts();

    if (extrauseraddreess) {
        extrauseraddreess.forEach(user => owners.push(user));
    }

    const owner = provider.getSigner(0);

    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: owner
    });

    const safeFactory: SafeFactory = await SafeFactory.create({ ethAdapter });

    const safeAccountConfig: SafeAccountConfig = { owners, threshold };
    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });

    newSafeAddress = safeSdk.getAddress();

    alert(`New safe has been created ${newSafeAddress}`);

    return {
        ethAdapter,
        safeFactory,
        owners,
        safeAccountConfig,
        safeSdk,
        newSafeAddress,
        threshold
    };
}

export default createSafe;
