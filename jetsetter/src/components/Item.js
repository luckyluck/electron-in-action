import React from 'react';

export const Item = ({ packed, value, onCheckOff }) => (
  <article className="Item">
    <label>
      <input type="checkbox" checked={packed} onChange={onCheckOff} />
      {value}
    </label>
  </article>
);
