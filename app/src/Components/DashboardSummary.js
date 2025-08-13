import Card from 'react-bootstrap/Card';
import './DashboardSummary.css'; // Import the CSS file

export default function DashboardSummary(props) {
  return (
    <Card style={{}}>
      <Card.Body>
      <Card.Title className="dashboard-summary-title">
        {props.title}
      </Card.Title>
      <Card.Text className="dashboard-summary-data">
        HKD {props.data}
      </Card.Text>
      </Card.Body>
    </Card>
  );
}