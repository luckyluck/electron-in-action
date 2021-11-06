import React, { useState } from 'react';

export const NewItem = ({ onSubmit = () => {} }) => {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(value);
    setValue('');
  };

  return (
    <form className="NewItem" onSubmit={handleSubmit}>
      <input type="text" className="NewItem-input" value={value} onChange={e => setValue(e.target.value)} />
      <input type="submit" className="NewItem-submit button" />
    </form>
  );
};
