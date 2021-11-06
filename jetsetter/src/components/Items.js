import React from 'react';
import { Item } from './Item';

export const Items = ({ title, items, onCheckOff }) => (
  <section className="Items">
    <h2>{title}</h2>
    {items.map(item => (
      <Item key={item.id} onCheckOff={() => onCheckOff(item)} {...item} />
    ))}
  </section>
);
