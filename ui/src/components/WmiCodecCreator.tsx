import { useEffect } from "react";
import { Form, Input, Select, InputNumber, Row, Col, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export interface WmiField {
  name: string;
  type: "float" | "integer" | "boolean";
  bytes: number;
}

interface IProps {
  value?: WmiField[];
  onChange?: (value: WmiField[]) => void;
}

function WmiCodecCreator(props: IProps) {
  const [form] = Form.useForm();

  const onValuesChange = (_: any, allValues: { wmiFields: WmiField[] }) => {
    if (props.onChange) {
      props.onChange(allValues.wmiFields ? allValues.wmiFields.filter(f => f) : []);
    }
  };

  useEffect(() => {
    form.setFieldsValue({ wmiFields: props.value || [] });
  }, [props.value, form]);

  return (
    <Form form={form} onValuesChange={onValuesChange} layout="vertical">
      <Form.List name="wmiFields">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={24} style={{ display: "flex", marginBottom: 8, alignItems: "baseline" }}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Inserisci il nome del campo" }]}
                  >
                    <Input placeholder="Nome Campo" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    initialValue="float"
                    rules={[{ required: true, message: "Seleziona un tipo" }]}
                  >
                    <Select placeholder="Tipo">
                      <Select.Option value="float">Float</Select.Option>
                      <Select.Option value="integer">Integer</Select.Option>
                      <Select.Option value="boolean">Boolean</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "bytes"]}
                    initialValue={4}
                    rules={[{ required: true, message: "Inserisci i byte" }]}
                  >
                    <InputNumber placeholder="Bytes" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add({ name: "", type: "float", bytes: 4 })} block icon={<PlusOutlined />}>
                Aggiungi Campo
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
}

export default WmiCodecCreator;