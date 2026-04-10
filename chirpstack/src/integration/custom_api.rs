use std::collections::HashMap;
use std::sync::OnceLock;
use std::time::Duration;

use anyhow::Result;
use async_trait::async_trait;
use prost::Message;
use reqwest::header::{HeaderMap, CONTENT_TYPE};
use reqwest::Client;
use serde::Serialize;
use tracing::{info, trace, warn};

use super::Integration as IntegrationTrait;
use crate::codec;
use crate::storage::application::CustomApiConfiguration;
use chirpstack_api::integration;
use mongodb::{bson::doc, Client as MongoClient}; // <-- Import necessari da MongoDB
use serde_json::Value as JsonValue;

static CLIENT: OnceLock<Client> = OnceLock::new();

fn get_client() -> Client {
    CLIENT
        .get_or_init(|| {
            Client::builder()
                .timeout(Duration::from_secs(5))
                .use_rustls_tls()
                .build()
                .unwrap()
        })
        .clone()
}

pub struct Integration {
    config: CustomApiConfiguration,
}

#[derive(Serialize)]
pub struct UplinkPayload<'a> {
    event: &'a str,
    payload: &'a integration::UplinkEvent,
}

impl Integration {
    pub fn new(conf: &CustomApiConfiguration) -> Self {
        Integration {
            config: conf.clone(),
        }
    }

    async fn save_to_mongodb(&self, doc: JsonValue) -> Result<()> {
        info!("Connecting to MongoDB");
        let client = MongoClient::with_uri_str(&self.config.mongodb_uri).await?;
        let db = client.database(&self.config.mongodb_database);
        let coll = db.collection::<mongodb::bson::Document>(&self.config.mongodb_collection);

        let bson_doc = mongodb::bson::to_bson(&doc)?
            .as_document()
            .ok_or_else(|| anyhow!("Failed to convert to BSON document"))?
            .clone();

        info!("Inserting document into MongoDB");
        coll.insert_one(bson_doc).await?;
        Ok(())
    }
}

#[async_trait]
impl IntegrationTrait for Integration {
    async fn uplink_event(
        &self,
        _vars: &HashMap<String, String>,
        pl: &integration::UplinkEvent,
    ) -> Result<()> {
        info!("Handling uplink event for MongoDB integration");

        let payload_to_save: JsonValue = if let Some(obj) = &pl.object {
            info!("Using decoded JSON object from codec");
            serde_json::to_value(obj)?
        } else {
            info!("Codec did not produce a JSON object, using raw data (hex encoded)");
            serde_json::json!({ "data": hex::encode(&pl.data) })
        };

        let full_doc = serde_json::json!({
            "deviceInfo": pl.device_info,
            "payload": payload_to_save,
            "rxInfo": pl.rx_info,
            "txInfo": pl.tx_info,
            "time": pl.time,
        });

        if let Err(e) = self.save_to_mongodb(full_doc).await {
            warn!(error = %e, "Failed to save document to MongoDB");
            // Decidi se vuoi che l'errore interrompa il flusso o solo loggarlo.
            // Per ora lo logghiamo e continuiamo.
        }

        Ok(())
    }

    async fn join_event(
        &self,
        _vars: &HashMap<String, String>,
        _pl: &integration::JoinEvent,
    ) -> Result<()> {
        Ok(())
    }

    async fn ack_event(
        &self,
        _vars: &HashMap<String, String>,
        _pl: &integration::AckEvent,
    ) -> Result<()> {
        Ok(())
    }

    async fn txack_event(
        &self,
        _vars: &HashMap<String, String>,
        _pl: &integration::TxAckEvent,
    ) -> Result<()> {
        Ok(())
    }

    async fn log_event(
        &self,
        _vars: &HashMap<String, String>,
        _pl: &integration::LogEvent,
    ) -> Result<()> {
        Ok(())
    }

    async fn status_event(
        &self,
        _vars: &HashMap<String, String>,
        _pl: &integration::StatusEvent,
    ) -> Result<()> {
        Ok(())
    }

    async fn location_event(
        &self,
        _vars: &HashMap<String, String>,
        _pl: &integration::LocationEvent,
    ) -> Result<()> {
        Ok(())
    }

    async fn integration_event(
        &self,
        _vars: &HashMap<String, String>,
        _pl: &integration::IntegrationEvent,
    ) -> Result<()> {
        Ok(())
    }
}
