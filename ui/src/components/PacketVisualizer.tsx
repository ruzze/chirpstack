import { Tag } from "antd";
import type { WmiField } from "./WmiCodecCreator";

interface IProps {
  fields?: WmiField[];
}

const typeColor: { [key: string]: string } = {
  float: "blue",
  integer: "green",
  boolean: "gold",
};

function PacketVisualizer(props: IProps) {
  const fields = props.fields ? props.fields.filter(f => f && f.name) : [];

  if (fields.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h4>Packet Visualizer</h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #d9d9d9",
          padding: "8px",
          borderRadius: "2px",
          background: "#fafafa",
        }}
      >
        {fields.map((field, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #f0f0f0",
              padding: "8px 16px",
              marginRight: "8px",
              marginBottom: "8px",
              background: "white",
              borderRadius: "2px",
              textAlign: "center",
            }}
          >
            <div>
              <strong>{field.name || "N/A"}</strong>
            </div>
            <div style={{ marginTop: "4px" }}>
              <Tag color={typeColor[field.type]}>{field.type}</Tag>
              <Tag>
                {field.bytes} byte{field.bytes > 1 ? "s" : ""}
              </Tag>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PacketVisualizer; 