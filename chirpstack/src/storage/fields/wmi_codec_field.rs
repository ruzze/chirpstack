use diesel::backend::Backend;
use diesel::pg::Pg;
use diesel::sql_types::Jsonb;
use diesel::{deserialize, serialize};
use serde::{Deserialize, Serialize};

#[derive(
    Serialize, Deserialize, Debug, Clone, PartialEq, Eq, AsExpression, FromSqlRow, Default,
)]
#[diesel(sql_type = Jsonb)]
pub struct WmiCodecField {
    pub name: String,
    pub type_name: String,
    pub bytes: u32,
}

#[derive(Debug, Clone, PartialEq, Eq, Default, FromSqlRow, AsExpression)]
#[diesel(sql_type = Jsonb)]
pub struct WmiCodecFields(pub Vec<WmiCodecField>);

impl From<Vec<WmiCodecField>> for WmiCodecFields {
    fn from(v: Vec<WmiCodecField>) -> Self {
        WmiCodecFields(v)
    }
}

impl deserialize::FromSql<Jsonb, Pg> for WmiCodecFields {
    fn from_sql(value: <Pg as Backend>::RawValue<'_>) -> deserialize::Result<Self> {
        let value = <serde_json::Value as deserialize::FromSql<Jsonb, Pg>>::from_sql(value)?;
        let fields: Vec<WmiCodecField> = serde_json::from_value(value)?;
        Ok(WmiCodecFields(fields))
    }
}

impl serialize::ToSql<Jsonb, Pg> for WmiCodecFields {
    fn to_sql<'b>(&'b self, out: &mut serialize::Output<'b, '_, Pg>) -> serialize::Result {
        let value = serde_json::to_value(&self.0)?;
        <serde_json::Value as serialize::ToSql<Jsonb, Pg>>::to_sql(&value, &mut out.reborrow())
    }
}
