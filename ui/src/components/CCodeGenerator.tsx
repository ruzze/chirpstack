import CodeEditor from "./CodeEditor";
import type { WmiField } from "./WmiCodecCreator";

interface IProps {
  fields?: WmiField[];
}

const mapTypeToCType = (type: string, bytes: number): string => {
  switch (type) {
    case "float":
      return "float";
    case "integer":
      switch (bytes) {
        case 1:
          return "int8_t";
        case 2:
          return "int16_t";
        case 4:
          return "int32_t";
        default:
          return `// unsupported integer size: ${bytes} bytes`;
      }
    case "boolean":
      return "bool";
    default:
      return "unknown";
  }
};

const generateCCode = (fields: WmiField[]): string => {
  if (!fields || fields.length === 0) {
    return "// Add some fields to generate sample C/C++ code.";
  }

  const functionParams = fields
    .map(f => `${mapTypeToCType(f.type, f.bytes)} ${f.name}`)
    .join(", ");

  const bufferSize = fields.map(f => f.bytes).reduce((acc, curr) => acc + curr, 0);

  const serializationLines = fields
    .map(f => {
      const cType = mapTypeToCType(f.type, f.bytes);
      if (cType.startsWith("//")) {
        return `    // ${f.name}: unsupported type`;
      }
      if (f.type === "boolean") {
        return `    buffer[offset++] = ${f.name} ? 1 : 0;`;
      }
      return `    memcpy(buffer + offset, &${f.name}, sizeof(${cType}));\n    offset += sizeof(${cType});`;
    })
    .join("\n\n");

  return `#include <cstdint>
#include <cstring>

// Make sure to include the appropriate LoRaWAN library for your hardware.
// #include "LoRaWAN.h"

/**
 * @brief Prepares and sends a LoRaWAN data packet.
 * 
 * WARNING: This function uses 'memcpy', which preserves the native byte order
 * (endianness) of the microcontroller. Most devices (e.g., ARM-based)
 * are Little Endian.
 * 
 * Make sure the ChirpStack decoder is configured to interpret the data
 * with the same byte order (defaults to Little Endian).
 */
void sendData(${functionParams}) {
    // Start composing the packet
    LoRaWAN.beginPacket();

    // Buffer to hold the serialized data
    uint8_t buffer[${bufferSize}];
    uint8_t offset = 0;

    // Serialize the fields
${serializationLines}

    // Write the data to the LoRaWAN transmission buffer
    LoRaWAN.write(buffer, offset);

    // Send the packet
    // The 'true' parameter for a confirmed send is optional
    LoRaWAN.endPacket(); 
}
`;
};

function CCodeGenerator(props: IProps) {
  const fields = props.fields ? props.fields.filter(f => f && f.name) : [];
  const code = generateCCode(fields);

  return (
    <div style={{ marginBottom: 24 }}>
      <h4>Sample C/C++ Code for the device</h4>
      <CodeEditor value={code} language="c_cpp" disabled />
    </div>
  );
}

export default CCodeGenerator;