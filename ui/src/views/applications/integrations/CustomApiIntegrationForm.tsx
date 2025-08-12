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
    i.setMongodbUri(values.mongodbUri);
    i.setMongodbDatabase(values.mongodbDatabase);
    i.setMongodbCollection(values.mongodbCollection);
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
        label="MongoDB URI"
        name="mongodbUri"
        tooltip="e.g. mongodb://user:password@host:port/db?authSource=admin"
        rules={[{ required: true, message: "Please enter a MongoDB URI!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="MongoDB database"
        name="mongodbDatabase"
        rules={[{ required: true, message: "Please enter a MongoDB database name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="MongoDB collection"
        name="mongodbCollection"
        rules={[{ required: true, message: "Please enter a MongoDB collection name!" }]}
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