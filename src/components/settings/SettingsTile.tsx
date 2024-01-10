import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

const SettingsTile: React.FCC<{
  heading?: string | React.ReactNode;
  subHeading?: string | React.ReactNode;
  actions?: React.ReactNode;
}> = ({ children, heading, subHeading, actions }) => {
  return (
    <div className={'flex flex-col space-y-6 px-4'}>
      <div className={'flex flex-col space-y-1'}>
        <div className={'flex justify-between'}>
          <If condition={heading}>
            <Heading type={4}>
              <span className={'font-medium'}>{heading}</span>
            </Heading>
          </If>

          <If condition={actions}>
            <div>{actions}</div>
          </If>
        </div>

        <If condition={subHeading}>
          <p className={'text-gray-500 dark:text-gray-400'}>{subHeading}</p>
        </If>
      </div>

      <div
        className={
          'rounded-lg border border-gray-100 p-2.5 dark:border-black-300 lg:p-6'
        }
      >
        {children}
      </div>
    </div>
  );
};

export default SettingsTile;
