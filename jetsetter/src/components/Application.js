import React, { useState } from 'react';
import { Items } from './Items';
import { NewItem } from './NewItem';

export const Application = () => {
  const [items, setItems] = useState([{ value: 'Pants', id: Date.now(), packed: false }]);

  const addItem = value => {
    const newItem = { value, id: Date.now(), packed: false };
    setItems(oldItems => [newItem, ...oldItems]);
  };

  const markAsPacked = item => {
    setItems(oldItems => oldItems.map(singleItem => ({
      ...singleItem,
      packed: singleItem.id === item.id ? !singleItem.packed : singleItem.packed,
    })))
  };

  const markAllAsUnpacked = () => {
    setItems(oldItems => oldItems.map(item => ({ ...item, packed: false })));
  };

  return (
    <div className="Application">
      <NewItem onSubmit={addItem} />
      <Items
        title="Unpacked Items"
        items={items.filter(item => !item.packed)}
        onCheckOff={markAsPacked}
      />
      <Items
        title="Packed Items"
        items={items.filter(item => item.packed)}
        onCheckOff={markAsPacked}
      />
      <button className="full-width" onClick={markAllAsUnpacked}>
        Mark All As Unpacked
      </button>
    </div>
  );
};
