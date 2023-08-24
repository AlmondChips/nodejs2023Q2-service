export const cascadeDeleteKeyId = <T>(source: T[], keyString: string) => {
  return (id: string) => {
    const updatedItems = source.map((item) => {
      if (item[keyString] === id) {
        item[keyString] = null;
      }
      return item;
    });
    return updatedItems;
  };
};
