import { useNavigate } from "react-router-dom";

import { Card } from "antd";

import type { Application } from "@chirpstack/chirpstack-api-grpc-web/api/application_pb";
import {
  CustomApiIntegration,
  CreateCustomApiIntegrationRequest,
} from "@chirpstack/chirpstack-api-grpc-web/api/application_pb";

import CustomApiIntegrationForm from "./CustomApiIntegrationForm";
import ApplicationStore from "../../../stores/ApplicationStore";

interface IProps {
  application: Application;
}

function CreateCustomApiIntegration(props: IProps) {
  const navigate = useNavigate();

  const onFinish = (obj: CustomApiIntegration) => {
    obj.setApplicationId(props.application.getId());

    const req = new CreateCustomApiIntegrationRequest();
    req.setIntegration(obj);

    ApplicationStore.createCustomApiIntegration(req, () => {
      navigate(`/tenants/${props.application.getTenantId()}/applications/${props.application.getId()}/integrations`);
    });
  };

  const i = new CustomApiIntegration();

  return (
    <Card title="Add Custom API integration">
      <CustomApiIntegrationForm initialValues={i} onFinish={onFinish} />
    </Card>
  );
}

export default CreateCustomApiIntegration;
