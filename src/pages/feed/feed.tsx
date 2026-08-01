import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/ordersSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { feedOrders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={feedOrders} handleGetFeeds={() => dispatch(getFeeds())} />
  );
};
