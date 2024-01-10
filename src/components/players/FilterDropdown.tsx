// import { useMemo } from 'react';

// import type { UserInfo } from 'firebase/auth';
// import { Trans } from 'next-i18next';
// import { Menu } from '@headlessui/react';

// import {
//   ChevronDownIcon,
//   Cog8ToothIcon,
//   ArrowLeftOnRectangleIcon,
//   Squares2X2Icon,
// } from '@heroicons/react/24/outline';

// import Dropdown from '~/core/ui/Dropdown';
// // import ProfileAvatar from './ProfileAvatar';

// // const FilterDropdown: React.FCC<{
// //   user: Maybe<UserInfo>;
// //   signOutRequested: () => void;
// // }> = ({ user, signOutRequested }) => {
// const FilterDropdown: React.FCC = () => {
//   const ProfileDropdownButton = (
//     <Menu.Button
//       as={'span'}
//       className={'flex cursor-pointer items-center space-x-2 border border-grey-300 rounded-md px-3'}
//     >
//       <span className="sr-only">Filter</span><wbr />
//       Filter
//       {/* <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
//         <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
//       </svg> */}
//       {/* <ChevronDownIcon className={'hidden h-3 sm:block'} /> */}
//     </Menu.Button>
//   );

//   // const signedInAsLabel = useMemo(() => {
//   //   return (
//   //     user?.email ??
//   //     user?.phoneNumber ?? <Trans i18nKey={'common:anonymousUser'} />
//   //   );
//   // }, [user]);

//   const items = [
//     <Dropdown.Item className={'rounded-none py-0'} key={'signedInAs'}>
//       <div
//         className={'flex flex-col justify-start text-left text-xs ellipsify'}
//       >
//         <div className={'text-gray-500'}>Signed in as</div>

//         <div>
//           <span className={'block ellipsify'}>Signed in as label placeholder</span>
//         </div>
//       </div>
//     </Dropdown.Item>,
//     <Dropdown.Divider key={'divider1'} />,
//     <ProfileDropdownMenuItem key={'profile'} href={'/dashboard'}>
//       <Squares2X2Icon className={'h-5'} />
//       <span>
//         <Trans i18nKey={'common:dashboardTabLabel'} />
//       </span>
//     </ProfileDropdownMenuItem>,
//     <ProfileDropdownMenuItem key={'profile'} href={'/settings/profile'}>
//       <Cog8ToothIcon className={'h-5'} />
//       <span>
//         <Trans i18nKey={'common:settingsTabLabel'} />
//       </span>
//     </ProfileDropdownMenuItem>,
//     <Dropdown.Divider key={'divider2'} />,
//     <ProfileDropdownMenuItem key={'sign-out'} onClick={() => console.log("place holder function")}>
//       <ArrowLeftOnRectangleIcon className={'h-5'} />
//       <span>
//         <Trans i18nKey={'auth:signOut'} />
//       </span>
//     </ProfileDropdownMenuItem>,
//   ];

//   return <Dropdown button={ProfileDropdownButton} items={items} />;
// };

// function ProfileDropdownMenuItem(
//   props: React.PropsWithChildren<
//     | {
//       onClick?: () => void;
//     }
//     | {
//       href?: string;
//     }
//   >
// ) {
//   const onClick = 'onClick' in props ? props.onClick : undefined;
//   const href = 'href' in props ? props.href : undefined;

//   return (
//     <Dropdown.Item href={href} onClick={onClick}>
//       <span className={'space-between flex w-full items-center space-x-4'}>
//         {props.children}
//       </span>
//     </Dropdown.Item>
//   );
// }

// export default FilterDropdown;
