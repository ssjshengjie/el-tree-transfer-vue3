export declare const props: {
    width: {
        type: StringConstructor;
        defaulte: string;
    };
    height: {
        type: StringConstructor;
        defaulte: string;
    };
    from_title: {
        type: StringConstructor;
    };
    to_title: {
        type: StringConstructor;
    };
    from_data: {
        type: ArrayConstructor;
        default: never[];
    };
    to_data: {
        type: ArrayConstructor;
        default: never[];
    };
    defaultProps: {
        type: ObjectConstructor;
        default: () => {
            label: string;
            children: string;
        };
    };
    node_key: {
        type: StringConstructor;
        default: string;
    };
};
