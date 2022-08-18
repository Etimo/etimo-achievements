import { useState } from 'react';

// Hook to manage the state of a key value store (an object)
const useKeyValueStore = (initialValue: Record<string, string> = {}) => {
  const [entries, setEntries] = useState<Record<string, string>>(initialValue);

  const setEntry = (key: string, value: string) => {
    setEntries({ ...entries, [key]: value });
  };

  const removeEntry = (key: string) => {
    setEntries(
      Object.keys(entries)
        .filter((k) => k !== key)
        .reduce((res, key) => Object.assign(res, { [key]: entries[key] }), {})
    );
  };

  // TODO: Add removeEntries and addEntries if needed

  const resetEntries = () => {
    if (Object.keys(entries).length === 0) return;
    setEntries({});
  };

  const noEntries = Object.keys(entries).length === 0;

  return { entries, setEntry, removeEntry, resetEntries, noEntries };
};

export default useKeyValueStore;
