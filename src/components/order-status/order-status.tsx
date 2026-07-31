import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  cancelled: 'Отменён',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '#F2F2F3';

  if (status === 'done') {
    textStyle = '#00CCCC';
  }

  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
