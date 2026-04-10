import { Link } from "react-router-dom";

import { Col, Card, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import type { Application } from "@chirpstack/chirpstack-api-grpc-web/api/application_pb";
import { DeleteCustomApiIntegrationRequest } from "@chirpstack/chirpstack-api-grpc-web/api/application_pb";

import ApplicationStore from "../../../stores/ApplicationStore";

interface IProps {
  application: Application;
  add?: boolean;
}

function CustomApiCard(props: IProps) {
  const onDelete = () => {
    const req = new DeleteCustomApiIntegrationRequest();
    req.setApplicationId(props.application.getId());
    ApplicationStore.deleteCustomApiIntegration(req, () => {});
  };

  let actions: JSX.Element[] = [];

  if (props.add) {
    actions = [
      <Link to="custom-api/create">
        <PlusOutlined />
      </Link>,
    ];
  } else {
    actions = [
      <Link to="custom-api/edit">
        <EditOutlined />
      </Link>,
      <Popconfirm title="Are you sure you want to delete this integration?" onConfirm={onDelete}>
        <DeleteOutlined />
      </Popconfirm>,
    ];
  }

  return (
    <Col span={8}>
      <Card
        title="WildLife Integration"
        className="integration-card"
        cover={
          <img
            alt="Wildlife"
            src="https://wildlifemovement.org/wp-content/uploads/2022/11/123-2048x674.jpg"
            style={{ padding: 1 }}
          />
        }
        actions={actions}
      >
        <Card.Meta description="The Wildlife Integrations forwards events to our mongodb databases." />
      </Card>
    </Col>
  );
}

export default CustomApiCard;
