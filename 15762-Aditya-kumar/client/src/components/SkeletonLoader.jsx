import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = ({ height = 20, width = '100%', count = 1, style = {} }) => (
    <Skeleton height={height} width={width} count={count} style={style} />
);

export default SkeletonLoader;