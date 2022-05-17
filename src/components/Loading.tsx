/** @format */

import { Loading as NextLoading } from "@nextui-org/react";

interface Props {
	children: React.ReactNode | React.ReactNode[];
	type: "points" | "points-opacity";
}

export const Loading = ({ children, type }: Props) => (
	<NextLoading
		color='white'
		size='lg'
		type={type}
		textColor='white'
		css={{
			marginTop: "1rem"
		}}>
		{children}
	</NextLoading>
);
