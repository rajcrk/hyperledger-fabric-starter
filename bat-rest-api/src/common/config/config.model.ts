export interface ConfigOptions {
    hlf: HlfConfigOptions;
    allowguest: boolean;
}

export type AdminCreds = {
    enrollmentID: string,
    enrollmentSecret: string,
    MspID: string
};

export type TLSOptions = {
    trustedRoots: string,
    verify: boolean
};

export type HlfConfigOptions = {
    walletPath: string;
    userId: string;
    channelId: string;
    chaincodeId: string;
    networkUrl: string;
    eventUrl: string;
    ordererUrl: string;
    caUrl: string,
    admin: AdminCreds;
    tlsOptions: TLSOptions,
    caName: string
};