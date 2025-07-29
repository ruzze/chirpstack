import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "antd";

import type {
  Application,
  CustomApiIntegration,
  GetCustomApiIntegrationResponse,
} from "@chirpstack/chirpstack-api-grpc-web/api/application_pb";
import {
  GetCustomApiIntegrationRequest,
  UpdateCustomApiIntegrationRequest,
} from "@chirpstack/chirpstack-api-grpc-web/api/application_pb";

import CustomApiIntegrationForm from "./CustomApiIntegrationForm";
import ApplicationStore from "../../../stores/ApplicationStore";

interface IProps {
  application: Application;
}

function EditCustomApiIntegration(props: IProps) {
  const navigate = useNavigate();
  const [integration, setIntegration] = useState<CustomApiIntegration | undefined>(undefined);

  useEffect(() => {
    const req = new GetCustomApiIntegrationRequest();
    req.setApplicationId(props.application.getId());

    ApplicationStore.getCustomApiIntegration(req, (resp: GetCustomApiIntegrationResponse) => {
      setIntegration(resp.getIntegration());
    });
  }, [props]);

  const onFinish = (obj: CustomApiIntegration) => {
    const req = new UpdateCustomApiIntegrationRequest();
    req.setIntegration(obj);

    ApplicationStore.updateCustomApiIntegration(req, () => {
      navigate(`/tenants/${props.application.getTenantId()}/applications/${props.application.getId()}/integrations`);
    });
  };

  if (integration === undefined) {
    return null;
  }

  return (
    <Card title="Update Custom API integration">
      <CustomApiIntegrationForm initialValues={integration} onFinish={onFinish} />
    </Card>
  );
}

export default EditCustomApiIntegration;