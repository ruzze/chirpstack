-- Your SQL goes here
ALTER TABLE device_profile
        ADD COLUMN wmi_codec_fields JSONB NOT NULL DEFAULT '[]';
