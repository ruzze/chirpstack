import CreateIftttIntegration from "./integrations/CreateIftttIntegration";
import EditIftttIntegration from "./integrations/EditIftttIntegration";
import CreateCustomApiIntegration from "./integrations/CreateCustomApiIntegration";
import EditCustomApiIntegration from "./integrations/EditCustomApiIntegration";
import { useTitle } from "../helpers";

interface IProps {
  tenant: Tenant;
}

const ApplicationLayout = (props: IProps) => {
  const { tenant } = props;
  const { title } = useTitle();

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card>
        <Routes>
          <Route path="/integrations/ifttt/create" element={<CreateIftttIntegration application={app} />} />
          <Route
            path="/integrations/ifttt/edit"
            element={<EditIftttIntegration application={app} measurementKeys={props.measurementKeys} />}
          />
          <Route path="/integrations/custom-api/create" element={<CreateCustomApiIntegration application={app} />} />
          <Route path="/integrations/custom-api/edit" element={<EditCustomApiIntegration application={app} />} />
        </Routes>
      </Card>
    </Space>
  );
};

export default ApplicationLayout; 