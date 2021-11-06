import React from 'react';

export const Item = ({ packed, value, onCheckOff, onDelete }) => (
  <article className="Item">
    <label>
      <input type="checkbox" checked={packed} onChange={onCheckOff} />
      {value}
    </label>
    <button className="delete" onClick={onDelete}>X</button>
  </article>
);
