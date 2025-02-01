/** @format */

import { Button, Card, Text } from "@nextui-org/react";
import { ReactNode } from "react";

interface Props {
	children: ReactNode | ReactNode[];
	buttonFunc: Function;
}

export const ErrorCard = ({ children, buttonFunc }: Props) => (
	<Card color='error' bordered>
		<Card.Header
			css={{
				padding: "1rem",
				justifyContent: "space-between"
			}}>
			<Text
				as='h2'
				size='1.5rem'
				css={{
					color: "var(--light)",
					fontWeight: "700"
				}}>
				Error
			</Text>
			<Button
				auto
				bordered
				css={{
					bg: "$error",
					borderColor: "var(--light)",
					color: "var(--light)",
					fontWeight: "700",
					"&:hover": {
						bg: "var(--light)",
						color: "$error"
					}
				}}
				onPress={() => buttonFunc()}>
				Retry
			</Button>
		</Card.Header>
		<Card.Body
			css={{
				padding: "0 1rem 1rem 1rem"
			}}>
			{children}
		</Card.Body>
	</Card>
);
