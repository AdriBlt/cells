import * as React from "react";
import { Card } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";

export interface CardProps {
    title: string;
    description: string;
    link: string;
    imageUrl: string;
}

export interface CardsPageProps {
    title: string;
    description: string;
    cards: CardProps[];
    showBackButton?: boolean;
}

export function CardsPage(props: CardsPageProps) {
    const history = useHistory();

    return (
        <div style={{ maxWidth: '1250px', margin: '10px auto' }}>
            <div style={{ padding: '10px' }}>
                <h3>
                    {props.showBackButton && (
                        <Icon.ArrowLeftSquare
                            onClick={() => history.goBack()}
                            style={{ cursor: 'pointer', marginRight: '5px', marginTop: '-4px' }}
                        />
                    )}
                    {props.title}
                </h3>
                <p>{props.description}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', padding: '5px' }}>
                {props.cards.map((card: CardProps) => (
                    <Card
                        key={card.link}
                        style={{ width: '18rem', margin: '5px', cursor: 'pointer' }}
                        onClick={() => history.push(card.link)}
                    >
                        <Card.Img
                            variant="top"
                            src={card.imageUrl}
                        />
                        <Card.Body>
                            <Card.Title>{card.title}</Card.Title>
                            <Card.Text>{card.description}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}