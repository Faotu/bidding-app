// import { Menu } from '@headlessui/react';
// import Dropdown from '~/core/ui/Dropdown';

// type Props = {
//   label: string;
//   items: Array<JSX.Element>;
// };

// const DropdownButton = ({ title }: { title: string }) => (
//   <Menu.Button
//     as={'span'}
//     className="mt-2 inline-flex w-full cursor-pointer justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
//   >
//     <span className="sr-only">{title}</span>
//     <wbr />
//     {title}
//     <svg
//       className="-mr-1 ml-2 h-5 w-5"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 20 20"
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <path fillRule="evenodd" d="M10 14l-5-5h10l-5 5z" clipRule="evenodd" />
//     </svg>
//   </Menu.Button>
// );

// export default function DropdownWithCheckboxes({ label, items }: Props) {
//   return (
//     <Dropdown
//       className="DropdownWithCheckboxes"
//       button={DropdownButton({ title: label })}
//       items={items}
//     />
//   );
// }
