import React from "react";
import type { UserInfo } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '~/core/ui/Avatar';
import classNames from "classnames";

type ProfileAvatarProps =
  | {
      user: Maybe<UserInfo>;
    }
  | {
      text: Maybe<string>;
    };

interface ProfileAvatarExtraProps {
  className?: string;
}

const ProfileAvatar: React.FCC<ProfileAvatarProps & ProfileAvatarExtraProps> = (props) => {
  if ('user' in props && props.user) {
    return (
      <Avatar className={classNames(props?.className)}>
        {props.user.photoURL ? <AvatarImage src={props.user.photoURL} /> : null}

        <AvatarFallback>{getUserInitials(props.user)}</AvatarFallback>
      </Avatar>
    );
  }

  if ('text' in props && props.text) {
    return (
      <Avatar className={classNames(props?.className)}>
        <AvatarFallback>{props.text[0]}</AvatarFallback>
      </Avatar>
    );
  }

  return null;
};

function getUserInitials(user: UserInfo) {
  const displayName = getDisplayName(user);

  return displayName[0] ?? '';
}

function getDisplayName(user: UserInfo) {
  if (user.displayName) {
    return user.displayName;
  }

  return user.email ?? 'Anonymous';
}

export default ProfileAvatar;
