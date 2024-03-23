'use client';
import { useState, useEffect } from 'react';

import { getJwtToken } from '../../serverUtils/loginUser';

export default function Positions() {
  const [positions, setPositions] = useState<any>({});
  const getUserPositions = async () => {
    const jwt = getJwtToken();
    const formData = new FormData();
    formData.append('loginData', JSON.stringify(jwt));

    if (!jwt) return;
    const response1 = await fetch(`api/position`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    // const response = await getPositions(jwt);
    // const positionsData = await response.result;
    // console.log(positionsData);
    // setPositions(positionsData);
  };
  useEffect(() => {
    getUserPositions(); // Call getPositions when the component mounts
  }, []);
  return <div>Positions Page</div>;
}
