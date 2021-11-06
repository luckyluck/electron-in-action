import React from 'react';
import { Item } from './Item';

export const Items = ({ title, items, onCheckOff, onDelete }) => (
  <section className="Items">
    <h2>{title}</h2>
    {items.map(item => (
      <Item
        key={item.id}
        onCheckOff={() => onCheckOff(item)}
        onDelete={() => onDelete(item)}
        {...item}
      />
    ))}
  </section>
);
