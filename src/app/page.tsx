import {redirect, RedirectType} from 'next/navigation';

type Props = {};
const Page = ({}: Props) => {
  return redirect('/dashboard', RedirectType.replace);
};

export default Page;
