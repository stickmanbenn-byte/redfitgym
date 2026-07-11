declare const InfiniteMenu: (props: {
  items?: Array<{ image: string; link?: string; title?: string; description?: string }>;
  scale?: number;
}) => JSX.Element;
export default InfiniteMenu;
