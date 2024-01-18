export const props = {
    width: {
        type: String,
        defaulte: '100%',
    },
    height: {
        type: String,
        defaulte: '320px',
    },
    from_title: {
        type: String,
    },
    to_title: {
        type: String,
    },
    from_data: {
        type: Array,
        default: [],
    },
    to_data: {
        type: Array,
        default: [],
    },
    defaultProps: {
        type: Object,
        default: () => {
            return { label: 'label', children: 'children' };
        },
    },
    // el-tree node-key 必须唯一
    node_key: {
        type: String,
        default: 'id',
    },
};
//# sourceMappingURL=props.js.map