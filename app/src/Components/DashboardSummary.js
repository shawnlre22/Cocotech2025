import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './DashboardSummary.css';

export default function DashboardSummary({ title, data, tooltipText }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={`tooltip-${title}`}>{tooltipText}</Tooltip>}
    >
      <Card className="dashboard-summary-card">
        <Card.Body>
          <Card.Title className="dashboard-summary-title">
            {title}
          </Card.Title>
          <Card.Text className="dashboard-summary-data">
            $ {data}
          </Card.Text>
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
}
