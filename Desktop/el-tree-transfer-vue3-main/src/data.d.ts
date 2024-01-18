export declare const data: {
    total: number;
    data: {
        user_id: number;
        user_name: string;
        nick_name: string;
        desc: string;
        role_name: string;
    }[];
};
export declare const transferData: {
    platformInfo: {
        platform_id: number;
        platform_name: string;
        game_tag: string;
        has_platform: number;
    }[];
    ruleInfo: {
        diff: {
            id: number;
            pid: number;
            label: string;
            children: {
                id: number;
                pid: number;
                label: string;
                children: never[];
            }[];
        }[];
        auth: {
            id: number;
            pid: number;
            label: string;
            children: {
                id: number;
                pid: number;
                label: string;
                children: {
                    id: number;
                    pid: number;
                    label: string;
                    children: never[];
                }[];
            }[];
        }[];
    };
    channelInfo: {
        hasAllChannel: boolean;
        diff: never[];
        auth: {
            id: number;
            label: string;
        }[];
    };
    tableInfo: {
        hasAllTable: boolean;
        diff: never[];
        auth: {
            id: number;
            label: string;
        }[];
    };
    adInfo: {
        hasAllTable: boolean;
        diff: never[];
        auth: {
            id: number;
            label: string;
        }[];
    };
};
