/** @format */

import { Card, Col, Row, Button, Text, Collapse } from "@nextui-org/react";
import { DataTitleStyled } from "../styles/DataTitleStyled";
import { DataCopyrightStyled } from "../styles/DataCopyrightStyled";
import { DataDescriptionStyled } from "../styles/DataDescriptionStyled";
import { DataDescTitleStyled } from "../styles/DataDescTitleStyled";
import { DataImgStyled } from "../styles/DataImgStyled";
import { ApodDataInterface } from "../interfaces/ApodDataInterface";

export function DataSection({ data }: { data: ApodDataInterface }) {
	return (
		<>
			<Card cover bordered as='article' color='gradient'>
				<Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
					<Col>
						<DataTitleStyled as='h2'>{data.title}</DataTitleStyled>
						{data.copyright && <DataCopyrightStyled as='p'>{data.copyright}</DataCopyrightStyled>}
					</Col>
				</Card.Header>
				<Card.Body>
					<DataImgStyled
						src={data.media_type === "image" ? data.url : data.thumbnail_url!}
						alt='Astronomy Picture of the Day'
					/>
				</Card.Body>
				<Card.Footer
					blur
					css={{
						position: window.innerWidth > 768 ? "absolute" : "relative",
						bgBlur: "#0f1114",
						borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
						bottom: 0,
						zIndex: 10
					}}>
					<Collapse title={<DataDescTitleStyled>Description</DataDescTitleStyled>} divider={false}>
						<DataDescriptionStyled>{data.explanation}</DataDescriptionStyled>
					</Collapse>
				</Card.Footer>
			</Card>
		</>
	);
}
