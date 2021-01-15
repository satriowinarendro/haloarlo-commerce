/*
 *
 *  * Copyright (c) 2018-2019 AccelByte Inc. All Rights Reserved.
 *  * This is licensed software from AccelByte Inc, for limitations
 *  * and restrictions contact your company contract manager.
 *
 */

const storageMethods = (storageType: any) => ({
    setObject: (key: string, value: any) => {
      storageType.setItem(key, JSON.stringify(value));
    },
  
    getObject: (key: string) => {
      const value = storageType.getItem(key);
      return value && JSON.parse(value);
    },
  
    updateObject: (key: string, propKey: string, propNewValue: any) => {
      let value = storageMethods(storageType).getObject(key);
      value = {
        ...value,
        [propKey]: propNewValue,
      };
      storageMethods(storageType).setObject(key, value);
    },
  });
  
  const extendedStorage = typeof window !== "undefined" ? {
    localStorage: storageMethods(localStorage),
    sessionStorage: storageMethods(sessionStorage),
  } : null;
  
  export default extendedStorage;
  