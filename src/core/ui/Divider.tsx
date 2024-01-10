function Divider({ classNames }: { classNames: string }) {
  return (
    <hr
      className={`w-full border border-gray-50 dark:border-black-400 ${classNames}`}
    />
  );
}

export default Divider;
