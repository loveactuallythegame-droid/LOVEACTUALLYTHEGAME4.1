import React from 'react';

export const Separator: React.FC<React.HTMLAttributes<HTMLHRElement>> = (props) => (
  <hr className="my-4 border-t" {...props} />
);

export default Separator;
