import Card from 'react-bootstrap/Card';

export default function DashboardSummary(props) {
  return (
    <Card style={{}}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          HKD{props.data}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}