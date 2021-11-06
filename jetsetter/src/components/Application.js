import React, { useState, useEffect } from 'react';
import { Items } from './Items';
import { NewItem } from './NewItem';

export const Application = ({ database }) => {
  const [items, setItems] = useState([]);

  const fetchItems = () => {
    database('items')
      .select()
      .then(setItems)
      .catch(console.error);
  };

  const addItem = value => {
    database('items')
      .insert({ value, packed: false })
      .then(ids => {
        setItems(oldItems => [
          { id: ids[0], value, packed: false },
          ...oldItems]
        );
      })
      .catch(console.error);
  };

  const deleteItem = item => {
    database('items')
      .where({ id: item.id })
      .delete()
      .then(fetchItems)
      .catch(console.error);
  };

  const deleteUnpackedItems = () => {
    database('items')
      .where({ packed: false })
      .delete()
      .then(fetchItems)
      .catch(console.error);
  };

  const markAsPacked = item => {
    database('items')
      .where({ id: item.id })
      .update({ packed: !item.packed })
      .then(fetchItems)
      .catch(console.error);
  };

  const markAllAsUnpacked = () => {
    database('items')
      .where({ packed: true })
      .update({ packed: false })
      .then(fetchItems)
      .catch(console.error);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="Application">
      <NewItem onSubmit={addItem} />
      <Items
        title="Unpacked Items"
        items={items.filter(item => !item.packed)}
        onCheckOff={markAsPacked}
        onDelete={deleteItem}
      />
      <Items
        title="Packed Items"
        items={items.filter(item => item.packed)}
        onCheckOff={markAsPacked}
        onDelete={deleteItem}
      />
      <button className="button full-width" onClick={markAllAsUnpacked}>
        Mark All As Unpacked
      </button>
      <button
        className="button full-width secondary"
        onClick={deleteUnpackedItems}
      >
        Remove Unpacked Items
      </button>
    </div>
  );
};
