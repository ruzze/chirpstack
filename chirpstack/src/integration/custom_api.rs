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
use crate::storage::application::CustomApiConfiguration;
use chirpstack_api::integration;

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
    endpoint_url: String,
}

#[derive(Serialize)]
pub struct UplinkPayload<'a> {
    event: &'a str,
    payload: &'a integration::UplinkEvent,
}

impl Integration {
    pub fn new(conf: &CustomApiConfiguration) -> Integration {
        trace!("Initializing custom_api integration");

        Integration {
            endpoint_url: conf.endpoint_url.clone(),
        }
    }

    async fn post_uplink(&self, pl: &integration::UplinkEvent) -> Result<()> {
        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());

        let payload = UplinkPayload {
            event: "up",
            payload: pl,
        };

        info!(url = %self.endpoint_url, "Posting uplink event to custom API");
        let res = get_client()
            .post(&self.endpoint_url)
            .json(&payload)
            .headers(headers)
            .send()
            .await;

        match res {
            Ok(res) => match res.error_for_status() {
                Ok(_) => {}
                Err(e) => {
                    warn!(url = %self.endpoint_url, error = %e, "Posting uplink event to custom API failed");
                }
            },
            Err(e) => {
                warn!(url = %self.endpoint_url, error = %e, "Posting uplink event to custom API failed");
            }
        }

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
        self.post_uplink(pl).await
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
