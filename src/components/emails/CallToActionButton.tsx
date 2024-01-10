import { Button } from '@react-email/button';

// update this with your brand's primary color
const PRIMARY_COLOR = `#6466f1`;

function CallToActionButton(
  props: React.PropsWithChildren<{
    href: string;
  }>
) {
  return (
    <Button
      style={{
        backgroundColor: PRIMARY_COLOR,
        padding: '16px 24px',
        borderRadius: 8,
        color: 'white',
      }}
      href={props.href}
    >
      {props.children}
    </Button>
  );
}

export default CallToActionButton;
