import { Form, Input, Button } from "antd";

import { CustomApiIntegration } from "@chirpstack/chirpstack-api-grpc-web/api/application_pb";

import { onFinishFailed } from "../../helpers";

interface IProps {
  initialValues: CustomApiIntegration;
  onFinish: (obj: CustomApiIntegration) => void;
}

function CustomApiIntegrationForm(props: IProps) {
  const onFinish = (values: CustomApiIntegration.AsObject) => {
    const i = new CustomApiIntegration();
    i.setApplicationId(props.initialValues.getApplicationId());
    i.setEndpointUrl(values.endpointUrl);
    props.onFinish(i);
  };

  return (
    <Form
      layout="vertical"
      initialValues={props.initialValues.toObject()}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Endpoint URL"
        name="endpointUrl"
        tooltip="ChirpStack will make a POST request to this URL with the event payload."
        rules={[{ required: true, message: "Please enter an endpoint URL!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CustomApiIntegrationForm;